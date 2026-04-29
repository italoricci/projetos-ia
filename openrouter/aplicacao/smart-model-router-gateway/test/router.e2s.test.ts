import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.ts';
import { OpenRouterService } from '../src/openrouter-service.ts';
import { config } from '../src/config.ts';
import type { FastifyInstance } from 'fastify';

// ── helpers ──────────────────────────────────────────────────────────────────

function buildApp(overrides: Partial<typeof config> = {}): FastifyInstance {
  const routerService = new OpenRouterService({ ...config, ...overrides });
  return createServer(routerService);
}

async function perguntaCapital(app: FastifyInstance) {
  return app.inject({
    method: 'POST',
    url: '/chat',
    payload: { question: 'Qual é a capital da Argentina?' },
  });
}

function validarRetornoCapital(
  response: Awaited<ReturnType<FastifyInstance['inject']>>
) {
  assert.equal(response.statusCode, 200, 'Expected status code to be 200');
  const body = response.json();
  console.log('Resposta do modelo:', body);
  assert.ok(body.answer, 'Response should contain an answer');
  assert.ok(
    body.answer.response.includes('Buenos Aires'),
    'Answer should mention Buenos Aires'
  );
}

// ── pre-conditions ────────────────────────────────────────────────────────────

before(() => {
  assert.ok(
    process.env.OPENROUTER_API_KEY,
    'OPENROUTER_API_KEY is not defined'
  );
});

// ── tests ─────────────────────────────────────────────────────────────────────

test('routes to throughput model by default', async () => {
  const app = buildApp();
  const response = await perguntaCapital(app);
  validarRetornoCapital(response);
});

test('routes to cheapest model by default', async () => {
  const app = buildApp({
    provider: {
      sort: { by: 'price', partition: 'none' },
    },
  });
  const response = await perguntaCapital(app);
  validarRetornoCapital(response);
});

test('routes to latency model by default', async () => {
  const app = buildApp({
    provider: {
      sort: { by: 'latency', partition: 'none' },
    },
  });
  const response = await perguntaCapital(app);
  validarRetornoCapital(response);
});
