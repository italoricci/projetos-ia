# Constitution — Notas API

Princípios não negociáveis que toda spec, plano, tarefa e código devem seguir.

1. **Camadas explícitas.** Dependências fluem `http/cli -> service -> store`. O domínio não faz I/O.
2. **Validação na fronteira.** Toda entrada externa é validada com Zod antes de virar domínio.
3. **Erros de domínio.** Falhas previsíveis viram classes de erro, traduzidas em status ou saída na borda.
4. **Testes fazem parte da tarefa.** Nenhuma lógica nova entra sem teste. Typecheck e testes devem permanecer verdes.
5. **Segurança por padrão.** Sem segredos no repositório. Ações destrutivas passam por guardrails (deny-list + pre-commit), não pela confiança no modelo.
6. **Spec antes do código.** Mudanças relevantes passam por spec -> plan -> task -> implement, com revisão humana entre fases.
7. **Pequeno e reversível.** Cada tarefa cabe em um commit.

## Stack obrigatória

Node.js 22, TypeScript ESM strict, Zod, `node:test` via `tsx` e `node:http`.
