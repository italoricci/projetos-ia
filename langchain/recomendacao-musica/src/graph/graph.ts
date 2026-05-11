import { StateGraph, START, END, MessagesZodMeta } from '@langchain/langgraph';
import { withLangGraph } from '@langchain/langgraph/zod';
import { z } from 'zod/v3';

import type { BaseMessage } from '@langchain/core/messages';
import { OpenRouterService } from '../services/open-router.service.ts';
import { createChatNode } from './nodes/chat.node.ts';
import { createSummarizationNode } from './nodes/summarization.node.ts';
import { createSavePreferencesNode } from './nodes/save-preference.node.ts';
import {
  routeAfterChat,
  routeAfterSavePreferences,
} from './nodes/edge-conditions.node.ts';
import { type MemoryService } from '../services/memory.service.ts';
import { PreferencesService } from '../services/preferences.service.ts';

const ChatStateAnnotation = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),
  userContext: z.string().optional(),
  extractedPreferences: z.any().optional(),
  needsSummarization: z.boolean().optional(),
  conversationSummary: z.any().optional(),
  userId: z.string().optional(),
});

export type GraphState = z.infer<typeof ChatStateAnnotation>;

export function buildChatGraph(
  llmClient: OpenRouterService,
  memoryService: MemoryService,
  preferencesService: PreferencesService,
) {
  const graph = new StateGraph(ChatStateAnnotation)
    .addNode('chat', createChatNode(llmClient, preferencesService))
    .addNode('savePreferences', createSavePreferencesNode(preferencesService))
    .addNode(
      'summarize',
      createSummarizationNode(llmClient, preferencesService),
    )

    .addEdge(START, 'chat')

    .addConditionalEdges('chat', routeAfterChat, {
      savePreferences: 'savePreferences',
      summarize: 'summarize',
      end: END,
    })

    .addConditionalEdges('savePreferences', routeAfterSavePreferences, {
      summarize: 'summarize',
      end: END,
    })

    .addEdge('summarize', END);

  return graph.compile({
    checkpointer: memoryService.checkpointer,
    store: memoryService.store,
  });
}
