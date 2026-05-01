import { AIMessage } from 'langchain';
import { type GraphState } from '../graph.ts';

export function ChatResponse(state: GraphState): GraphState {
  const response = state.output;
  const message = new AIMessage(response);

  return {
    ...state,
    messages: [...state.messages, message],
  };
}
