import { END, MessagesZodMeta, START, StateGraph } from '@langchain/langgraph';
import { withLangGraph } from '@langchain/langgraph/zod';
import { BaseMessage } from 'langchain';
import { z } from 'zod/v3'; // validação de dados, json;
import { IdentifyIntent } from './nodes/indentify-intent.ts';
import { ChatResponse } from './nodes/chat-response.ts';
import { LowerCase } from './nodes/lower-case.ts';
import { UpperCase } from './nodes/upper-case.ts';
import { FallBack } from './nodes/fallback.ts';

const GraphState = z.object({
  messages: withLangGraph(z.custom<BaseMessage[]>(), MessagesZodMeta),
  output: z.string(),
  command: z.enum(['uppercase', 'lowercase', 'unknown']),
});

export type GraphState = z.infer<typeof GraphState>;

export function createGraph() {
  const workflow = new StateGraph({ stateSchema: GraphState })
    // adicionando os nos
    .addNode('identifyIntent', IdentifyIntent)
    .addNode('chatResponse', ChatResponse)
    .addNode('lowerCase', LowerCase)
    .addNode('upperCase', UpperCase)
    .addNode('fallback', FallBack)
    // adicionando inicio de fluxo
    .addEdge(START, 'identifyIntent')
    // fluxo condicional
    .addConditionalEdges('identifyIntent', routerByState, {
      uppercase: 'upperCase', // redirecionando para o node correspondente
      lowercase: 'lowerCase',
      fallback: 'fallback',
    })
    // incluindo retorno e fim do fluxo
    .addEdge('upperCase', 'chatResponse')
    .addEdge('lowerCase', 'chatResponse')
    .addEdge('fallback', 'chatResponse')

    .addEdge('chatResponse', END);

  return workflow.compile();
}

function routerByState(state: GraphState): string {
  switch (state.command) {
    case 'uppercase':
      return 'uppercase';
    case 'lowercase':
      return 'lowercase';
    default:
      return 'fallback';
  }
}
