import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent, providerStrategy } from 'langchain';
import {
  getGuardrailsSystemPrompt,
  GuardrailsSchema,
} from '../../prompts/guardrails.ts';
import { config, type ModelConfig } from '../config.ts';
import { getTools } from './mcpService.ts';

export type GuardrailResult = {
  safe: boolean;
  reason?: string;
  score?: number;
  analysis?: string;
};

export class OpenRouterService {
  private config: ModelConfig;
  private llmClient: ChatOpenAI;
  private safeGuardClient: ChatOpenAI;
  private fsAgent: ReturnType<typeof createAgent> | null = null;

  constructor(configOverride?: ModelConfig) {
    this.config = configOverride ?? config;
    this.llmClient = this.#createChatModel(this.config.models[0]);
    this.safeGuardClient = this.#createChatModel(this.config.guardrailsModel);
  }

  // # significa metodo privado, ou seja, nao pode ser acessado fora da classe.
  // E usado para indicar que o metodo e uma implementacao interna da classe e nao deve ser usado diretamente por outras partes do codigo.
  #createChatModel(modelName: string): ChatOpenAI {
    return new ChatOpenAI({
      apiKey: this.config.apiKey,
      modelName: modelName,
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'HTTP-Referer': this.config.httpReferer,
          'X-Title': this.config.xTitle,
        },
      },
      modelKwargs: {
        models: this.config.models,
        provider: this.config.provider,
      },
    });
  }

  async generate(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.fsAgent) {
      const tools = await getTools();
      this.fsAgent = createAgent({
        model: this.llmClient,
        tools,
      });
    }

    const messages = [
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ];

    const response = await this.fsAgent.invoke({ messages });
    const content = String(response.messages.at(-1)?.text ?? '');

    return content;
  }

  async checkGuardrails(
    prompt: string,
    enabled: boolean = true,
  ): Promise<GuardrailResult> {
    if (!enabled) {
      return { safe: true, reason: 'Guardrails check is disabled.' };
    }

    // usando json prompt para garantir que o prompt seja passado como string, evitando problemas de formatação ou injeção direta.
    const secureAgent = createAgent({
      model: this.safeGuardClient,
      responseFormat: providerStrategy(GuardrailsSchema),
    });

    const messages = [
      new HumanMessage(prompt),
      new SystemMessage(getGuardrailsSystemPrompt()),
    ];

    const result = await secureAgent.invoke({ messages });
    const response = result.structuredResponse as GuardrailResult;

    return {
      safe: response.safe,
      reason: response.reason,
      score: response.score,
      analysis: response.analysis,
    };
  }
}
