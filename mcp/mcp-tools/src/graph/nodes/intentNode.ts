import { AIMessage } from 'langchain';
import {
  getSystemPrompt,
  type IntentData,
  IntentSchema,
} from '../../prompts/v1/identifyIntent.ts';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../state.ts';

export function intentNode(_openRouterService: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log('🧠 Intent node processing...');
    try {
      const rawQuestion = state.messages.at(-1)!.text as string;
      const systemPrompt = getSystemPrompt();

      const response = await _openRouterService.generateStructured(
        systemPrompt,
        rawQuestion,
        IntentSchema,
      );

      const { intent, fileContent, fileName, fileType } =
        response.data as IntentData;

      if (!intent || !fileType) {
        console.log(
          '⚠️ Missing intent or fileType in parsed data:',
          response.data,
        );
        throw new Error('Invalid intent data');
      }

      const fileNameFormated = fileName ?? `data.${fileType}`;
      console.log('📋 Extracted intent:', intent);
      console.log('📄 File Type:', fileType);
      console.log('📄 File name:', fileNameFormated);

      return {
        intent: intent,
        fileContent: fileContent ?? '',
        fileName: fileNameFormated,
      };
    } catch (error) {
      console.error('Intent node error:', error);
      return {
        messages: [
          new AIMessage(
            'Sorry, I had trouble understanding the intent. Please rephrase your question or provide more details.',
          ),
        ],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}
