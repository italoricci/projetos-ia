# Instruções do projeto

## Stack
- Node.js 22 LTS; TypeScript ESM em modo estrito.
- Zod valida entradas nas fronteiras HTTP e CLI.
- Testes com `node:test` via `tsx`; HTTP sem framework, usando `node:http`.

## Comandos
- Dev: `npm run dev` — `tsx src/index.js`; a API deve atender em `localhost:3000`.
- CLI: `npm run cli` — `tsx src/cli.ts`.
- Testes: `npm test` — `node --import tsx --test src/**/*.test.ts`.
- Typecheck: `npm run typecheck` — `tsc --noEmit`.

## Estrutura
- `src/domain/`: tipos e schemas Zod; sem I/O.
- `src/store/`: persistência em memória atrás de interfaces.
- `src/service/`: regras de negócio.
- `src/http/`: fronteira HTTP.
- `src/cli.ts`: fronteira CLI.
- `specs/`: especificações orientadas a comportamento.

## Convenções
- Não pule camadas: HTTP/CLI → service → store.
- Valide entradas externas com Zod.
- Erros de domínio são classes e traduzidos na borda HTTP/CLI.
- Toda lógica nova nasce com teste; testes e typecheck devem permanecer verdes.
- Nunca comite segredos nem leia `.env`.

## Fluxo de trabalho
- Siga `/especifica` → `/planejar` → `/tarefas` → `/implementar`, com revisão humana entre fases.
- Guarde artefatos em `specs/`, com no máximo 40 linhas cada.
- Não crie manual de estilo.
