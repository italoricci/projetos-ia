# Tarefas: gerenciamento de tarefas

- [x] **T1 — Definir persistência da CLI.** Decidir se tarefas precisam sobreviver entre execuções independentes da CLI e registrar a decisão no plano; pronto quando o ciclo `create` seguido de `list` tiver comportamento definido. Decisão: usar `.data/tasks.json`, compartilhado pela CLI e pela API. Dependências: nenhuma.
- [x] **T2 — Definir domínio de tarefas.** Criar tipo, estados e schemas Zod para título e filtro; pronto quando testes cobrirem título vazio, trimming e valores de status inválidos. Dependências: nenhuma.
- [x] **T3 — Implementar store.** Implementar armazenamento e busca por ID/título normalizado conforme a decisão de T1; pronto quando testes cobrirem CRUD e duplicidade sem diferenciar caixa/espaços externos. Dependências: T1, T2.
- [x] **T4 — Implementar serviço.** Adicionar regras de criação, listagem, conclusão e remoção, com erros de domínio; pronto quando testes cobrirem filtros, duplicidade e ID inexistente. Dependências: T3.
- [x] **T5 — Expor API HTTP.** Implementar servidor/rotas com validação Zod e tradução de erros; pronto quando testes cobrirem contratos, status HTTP, filtro padrão e falhas. Dependências: T4.
- [x] **T6 — Expor comandos CLI.** Implementar `create`, `list`, `complete` e `remove`, com mensagens e exit codes; pronto quando testes cobrirem entradas inválidas, erros e o ciclo entre execuções conforme T1. Dependências: T1, T4.
- [x] **T7 — Documentar e validar.** Atualizar README com rotas e comandos; pronto quando `npm test` e `npm run typecheck` passarem e os exemplos corresponderem aos contratos. Dependências: T5, T6.
