import {
  getSystemPrompt,
  getUserPromptTemplate,
  IntentSchema,
} from '../../prompts/v1/identifyIntent.ts';
import { professionals } from '../../services/appointmentService.ts';
import { LLMService } from '../../services/llmService.ts';
import type { GraphState } from '../graph.ts';

export function createIdentifyIntentNode(llmClient: LLMService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`🔍 Identifying intent...`);
    const input = state.messages.at(-1)!.text;

    try {
      // gerando prompt de sistema para nortear o modelo;
      const systemPrompt = getSystemPrompt(professionals);
      // prompt de fato do cliente;
      const userPrompt = getUserPromptTemplate(input);

      const result = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        IntentSchema,
      );

      if (!result.sucess) {
        console.error('❌ LLM failed to identify intent:', result.error);
        return {
          intent: 'unknown',
          error: result.error,
        };
      }

      const response = result.data!;
      console.log(`✅ Intent identified: ${response.intent}`);
      return {
        ...response,
      };
    } catch (error) {
      console.error('❌ Error in identifyIntent node:', error);
      return {
        intent: 'unknown',
        error:
          error instanceof Error
            ? error.message
            : 'Intent identification failed',
      };
    }
  };
}
