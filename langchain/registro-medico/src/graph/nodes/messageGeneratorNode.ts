import {
  getSystemPrompt,
  getUserPromptTemplate,
  MessageSchema,
} from '../../prompts/v1/messageGenerator.ts';
import { LLMService } from '../../services/llmService.ts';
import type { GraphState } from '../graph.ts';
import { AIMessage } from 'langchain';

export function createMessageGeneratorNode(llmClient: LLMService) {
  return async (state: GraphState): Promise<Partial<GraphState>> => {
    console.log(`💬 Generating response message...`);

    try {
      const sucess = state.actionSuccess ? 'success' : 'error';
      const scenario = state.intent ? `${state.intent}_${sucess}` : 'unknown';
      const details = {
        professionalName: state.professionalName,
        datetime: state.datetime,
        patientName: state.patientName,
        reason: state.reason,
        error: state.actionError || state.error,
      };

      const systemPrompt = getSystemPrompt();
      const userPrompt = getUserPromptTemplate({
        scenario,
        details,
      });

      const response = await llmClient.generateStructured(
        systemPrompt,
        userPrompt,
        MessageSchema,
      );

      if (response.error) {
        console.error('❌ LLM failed to generate message:', response.error);
        return {
          messages: [
            ...state.messages,
            new AIMessage('Desculpe, nao consegui gerar as resposta.'),
          ],
        };
      }

      const { message } = response.data!;
      console.log(`✅ Message generated: ${message}`);

      return {
        messages: [...state.messages, new AIMessage(message)],
      };
    } catch (error) {
      console.error('❌ Error in messageGenerator node:', error);
      return {
        ...state,
        messages: [
          ...state.messages,
          new AIMessage('An error occurred while processing your request.'),
        ],
      };
    }
  };
}
