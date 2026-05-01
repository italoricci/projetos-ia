import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.ts';
import type { FastifyInstance } from 'fastify';

// Fixture reutilizável
let app: FastifyInstance;

test.before(() => {
  app = createServer();
});

// Helper para evitar repetição do inject
async function postChat(question: string) {
  const response = await app.inject({
    method: 'POST',
    url: '/chat',
    payload: { question },
  });
  return { statusCode: response.statusCode, response: response.body };
}

test('comando uppercase deve retornar a string em maiúsculas', async () => {
  const mensagem = 'upper TransFOrmar essa MenSAGEM em maiúsculas';
  const { statusCode, response } = await postChat(mensagem);

  assert.equal(statusCode, 200);
  assert.equal(response, mensagem.toUpperCase());
});

test('comando lowercase deve retornar a string em minúsculas', async () => {
  const mensagem = 'LOWER TRANSFORMAR ESSA MENSAGEM EM MINÚSCULAS';
  const { statusCode, response } = await postChat(mensagem);

  assert.equal(statusCode, 200);
  assert.equal(response, mensagem.toLowerCase());
});

test('comando desconhecido deve retornar a string em minúsculas', async () => {
  const mensagem = 'Tudo bem?';
  const esperado = "Comando desconhecido, por favor use 'upper' ou 'lower'";
  const { statusCode, response } = await postChat(mensagem);

  assert.equal(statusCode, 200);
  assert.equal(response, esperado);
});
