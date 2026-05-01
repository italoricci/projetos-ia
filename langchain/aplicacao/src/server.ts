import Fastify from 'fastify';
import { createGraph } from './graph/graph.ts';
import { HumanMessage } from 'langchain';

const graph = createGraph();

export const createServer = () => {
  const app = Fastify({ logger: false });

  app.post(
    '/chat',
    {
      schema: {
        body: {
          type: 'object',
          required: ['question'],
          properties: {
            question: { type: 'string', minLength: 3 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { question } = request.body as { question: string };
        const response = await graph.invoke({
          messages: [new HumanMessage(question)],
        });
        console.log('🔥 Resposta gerada com suceso');
        return reply.send(response.output);
      } catch (error) {
        console.error('🚨 Erro ao processar requisicao:', error);
        reply.status(500).send({ error: 'Erro interno' });
      }
    },
  );

  return app;
};
