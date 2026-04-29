import { OpenRouter } from '@openrouter/sdk';
import { config, type OpenRouterConfig } from './config.ts';
import { type ChatGenerationParams } from '@openrouter/sdk/models';

export type LLMResponse = {
  model: string;
  response: string;
};

export class OpenRouterService {
  private client: OpenRouter;
  private config: OpenRouterConfig;

  constructor(configOverride?: OpenRouterConfig) {
    this.config = configOverride ?? config;

    this.client = new OpenRouter({
      apiKey: this.config.apiKey,
      httpReferer: this.config.httpReferer,
      xTitle: this.config.xTitle,
    });
  }

  async generate(prompt: string): Promise<LLMResponse> {
    const response = await this.client.chat.send({
      models: this.config.models,
      messages: [
        { role: 'system', content: this.config.systemPrompt },
        { role: 'user', content: prompt },
      ],
      stream: false, // agrupar os resultados em uma resposta unica, sem streaming
      temperature: this.config.temperature,
      maxTokens: this.config.maxTokens,
      provider: this.config.provider as ChatGenerationParams['provider'], // informacoes para buscar de modelos
    });

    const content =
      response.choices.at(0)?.message.content ??
      'Desculpe, não consegui gerar uma resposta.';

    return {
      model: response.model,
      response: String(content),
    };
  }
}
