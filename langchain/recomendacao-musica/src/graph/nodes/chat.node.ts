import type { Runtime } from '@langchain/langgraph';
import { AIMessage, HumanMessage } from 'langchain';
import {
  ChatResponseSchema,
  getSystemPrompt,
  getUserPromptTemplate,
} from '../../prompts/v1/chat-response.ts';
import { OpenRouterService } from '../../services/open-router.service.ts';
import type { GraphState } from '../graph.ts';
import { PreferencesService } from '../../services/preferences.service.ts';
import { config } from '../../config.ts';

export function createChatNode(
  llmClient: OpenRouterService,
  preferencesService: PreferencesService,
) {
  return async (
    state: GraphState,
    runtime?: Runtime,
  ): Promise<Partial<GraphState>> => {
    // runtime, proprio objeto do langchain para manipulacao de memoria, logs, etc;
    const userId = String(
      runtime?.context?.userId || state.userId || 'unknown_user',
    );
    const userContext =
      state.userContext ?? (await preferencesService.getBasicInfo(userId));
    // HumamMessage.isInstance utilitario para verificar o tipo da mensagem, se é do tipo humano ou IA, e extrair o conteúdo para criar o histórico da conversa.
    const history = state.messages
      .map((msg) => {
        `${HumanMessage.isInstance(msg) ? 'User' : 'AI'}: ${msg.content} `;
      })
      .join('\n');

    const input = state.messages.at(-1)?.text || '';

    const systemPrompt = getSystemPrompt(userContext);
    const userPrompt = getUserPromptTemplate(input, history);

    const result = await llmClient.generateStructured(
      userPrompt,
      systemPrompt,
      ChatResponseSchema,
    );

    if (!result.success) {
      console.error('Error generating chat response:', result.error);
      return {
        messages: [
          new AIMessage(
            'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente mais tarde.',
          ),
        ],
      };
    }

    const response = result.data!;

    const totalMessages = state.messages.length;

    // regra fixa, para caso o cliente tenha mais de 6 mensagens,
    // o sistema deve gerar um resumo da conversa para otimizar
    // o contexto e evitar atingir os limites de tokens do modelo.
    const needsSummarization = totalMessages >= config.maxMessagesSummary;

    // sumarizacao e importante para nao perder o contexto da conversa,
    // e para otimizar o uso do modelo, evitando atingir os limites de tokens, e
    //  garantindo que a IA tenha acesso as informações mais relevantes da conversa,
    // mesmo que o histórico seja longo.
    return {
      messages: [new AIMessage(response.message)],
      extractedPreferences: response.shouldSavePreferences
        ? response.preferences
        : undefined,
      needsSummarization,
    };
  };
}
