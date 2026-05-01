import { type GraphState } from '../graph.ts';

export function UpperCase(state: GraphState): GraphState {
  const response = state.output.toUpperCase();

  return {
    ...state,
    output: response,
  };
}
