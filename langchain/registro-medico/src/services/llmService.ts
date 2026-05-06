import { config, type ModelConfig } from '../config.ts';
import { ChatOpenAI } from '@langchain/openai';
import {
  createAgent,
  HumanMessage,
  providerStrategy,
  SystemMessage,
} from 'langchain';
import z from 'zod/v4';

export class LLMService {
  private config: ModelConfig;
  private llmClient: ChatOpenAI;

  constructor(configOverride?: ModelConfig) {
    this.config = configOverride ?? config;

    this.llmClient = new ChatOpenAI({
      temperature: this.config.temperature,
      modelName: this.config.models.at(0),
      apiKey: this.config.apiKey,
      configuration: {
        baseURL: 'https://openrouter.ai/api/v1',
        defaultHeaders: {
          'X-Title': this.config.xTitle,
          Referer: this.config.httpReferer,
        },
      },

      // configuracao do open router ai, incluindo a chave de api e os headers personalizados
      modelKwargs: {
        models: this.config.models,
        provider: {
          sort: {
            by: this.config.provider.sort.by,
            partition: this.config.provider.sort.partition,
          },
        },
      },
    });
    1;
  }

  async generateStructured<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: z.ZodSchema<T>,
  ) {
    console.log(`🤖 Generating structured response with LLM...`);

    try {
      // pra trabalhar com reponseFormat, o provedor precisa suportar, nesse caso o modelo do open router foi: nvidia/nemotron-3-super-120b-a12b:free
      const agent = createAgent({
        model: this.llmClient,
        tools: [],
        responseFormat: providerStrategy(schema),
      });

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt),
      ];
      const data = await agent.invoke({ messages });

      return {
        sucess: true,
        data: data.structuredResponse,
      };
    } catch (error) {
      console.error('Error generating structured response:', error);
      return {
        sucess: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
