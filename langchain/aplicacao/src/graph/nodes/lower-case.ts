import { type GraphState } from '../graph.ts';

export function LowerCase(state: GraphState): GraphState {
  const response = state.output.toLowerCase();

  return {
    ...state,
    output: response,
  };
}
