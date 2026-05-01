import { type GraphState } from '../graph.ts';

export function IdentifyIntent(state: GraphState): GraphState {
  const input = state.messages.at(-1)?.text ?? ''; // pegar a mensagem do input;
  const intputLower = input.toLocaleLowerCase();

  let command: GraphState['command'] = 'unknown';

  if (intputLower.includes('upper')) {
    command = 'uppercase';
  } else if (intputLower.includes('lower')) {
    command = 'lowercase';
  }

  return {
    ...state,
    command,
    output: input,
  };
}
