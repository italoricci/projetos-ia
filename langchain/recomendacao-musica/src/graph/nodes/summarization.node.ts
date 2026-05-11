import { HumanMessage } from 'langchain';
import type { Runtime } from '@langchain/langgraph';
import { OpenRouterService } from '../../services/open-router.service.ts';
import type { GraphState } from '../graph.ts';
import {
  type ConversationSummary,
  getSummarizationSystemPrompt,
  getSummarizationUserPrompt,
  SummarySchema,
} from '../../prompts/v1/summarization.ts';
import { PreferencesService } from '../../services/preferences.service.ts';
import { RemoveMessage } from '@langchain/core/messages';

export function createSummarizationNode(
  llmClient: OpenRouterService,
  preferencesService: PreferencesService,
) {
  return async (
    state: GraphState,
    runtime?: Runtime,
  ): Promise<Partial<GraphState>> => {
    const history = state.messages.map((msg) => ({
      role: HumanMessage.isInstance(msg) ? 'User' : 'AI',
      content: msg.text,
    }));

    const previousSummary = state.conversationSummary as
      | ConversationSummary
      | undefined;

    const systemPrompt = getSummarizationSystemPrompt();
    const userPrompt = getSummarizationUserPrompt(history, previousSummary);

    const result = await llmClient.generateStructured(
      userPrompt,
      systemPrompt,
      SummarySchema,
    );

    if (!result.success) {
      console.error('🍑 Error generating summarization:', result.error);
      return {
        needsSummarization: false,
      };
    }

    const userId = String(
      runtime?.context?.userId || state.userId || 'unknown_user',
    );

    await preferencesService.storeSummary(userId, result.data!);

    const deleteMessages = state.messages.slice(0, -2).map(
      (msg) =>
        new RemoveMessage({
          id: msg.id as string,
        }),
    );

    return {
      messages: deleteMessages,
      conversationSummary: result.data,
      needsSummarization: false,
    };
  };
}
