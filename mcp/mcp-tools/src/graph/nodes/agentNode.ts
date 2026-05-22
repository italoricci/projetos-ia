import { AIMessage } from 'langchain';
import { getSystemPrompt, getUserPrompt } from '../../prompts/v1/agentNode.ts';
import { OpenRouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../state.ts';

export function agentNode(_openRouterService: OpenRouterService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log('🤖 Agent node processing...');
    try {
      const userPrompt = getUserPrompt({
        intent: state.intent!,
        fileContent: state.fileContent!,
        fileName: state.fileName!,
      });
      const systemPrompt = getSystemPrompt();

      const result = await _openRouterService.generateStructured(
        systemPrompt,
        userPrompt,
      );

      return {
        error: undefined,
        messages: [new AIMessage(result.data as string)],
      };
    } catch (error) {
      console.error('Agent error:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        messages: [
          new AIMessage('Sorry, I had trouble processing the request.'),
        ],
      };
    }
  };
}
