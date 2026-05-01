import { AIMessage } from 'langchain';
import { type GraphState } from '../graph.ts';

export function FallBack(state: GraphState): GraphState {
  const mensagem = "Comando desconhecido, por favor use 'upper' ou 'lower'";
  return {
    ...state,
    output: mensagem,
  };
}
