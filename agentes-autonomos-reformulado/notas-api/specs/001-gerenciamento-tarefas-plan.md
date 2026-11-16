# Plano técnico: gerenciamento de tarefas

## 1. Arquivos e camadas
- `src/domain/task.ts`: tipo `Task`, schema Zod de entrada e status `open | done`.
- `src/store/task-store.ts`: interface e implementação em arquivo JSON local (`.data/tasks.json`), com busca por ID e título normalizado.
- `src/service/task-service.ts`: criação, listagem, conclusão e remoção; erros de domínio para título duplicado e tarefa inexistente.
- `src/http/task-handler.ts` e `src/http/server.ts`: rotas `node:http`, validação na fronteira e tradução de erros.
- `src/cli.ts`: parsing/validação de argumentos, chamadas ao service e mensagens/exit codes.
- `src/index.ts`: inicialização HTTP; ajustar o script `dev` do `package.json` e remover o stub `src/index.js`.
- Testes próximos às camadas: `task-service.test.ts`, `task-handler.test.ts` e `cli.test.ts`.

## 2. Modelo de dados
- `Task`: `id` (UUID), `title` (string não vazia após `trim`) e `status` (`open` ou `done`).
- Validar corpo HTTP e filtros/argumentos CLI com schemas Zod.
- Comparar títulos após `trim()` e conversão para minúsculas; preservar o título informado após remover espaços nas pontas.
- O arquivo JSON local mantém tarefas por ID e é compartilhado pela API e pela CLI; os dados sobrevivem ao reinício dos processos.

## 3. Contratos
- HTTP: `POST /tasks` com `{ "title": string }` → `201` e tarefa criada.
- HTTP: `GET /tasks?status=all|open|done` (padrão `all`) → `200` e lista filtrada.
- HTTP: `PATCH /tasks/:id/complete` → `200` e tarefa concluída; `DELETE /tasks/:id` → `204`.
- Erros HTTP: entrada/filtro inválido `400`, título duplicado `409`, ID inexistente `404`, com resposta de erro consistente.
- CLI: `create <title>`, `list [all|open|done]`, `complete <id>` e `remove <id>`; omitir filtro equivale a `all`.
- CLI: sucesso em stdout; falha explicada em stderr com código de saída não zero.

## 4. Decisões e trade-offs
- Usar arquivo JSON local para persistir e compartilhar tarefas entre execuções independentes da CLI e da API, sem adicionar uma dependência de banco de dados.
- Usar UUID para identificar tarefas sem depender de título, que é único apenas após normalização.
- Manter regras no service para que HTTP e CLI compartilhem o mesmo comportamento.

## 5. Estratégia de testes
- Store/service: persistência entre instâncias, título vazio/duplicado, comparação ignorando caixa e espaços externos, filtros, conclusão, remoção e ID inexistente.
- HTTP: status e payload de sucesso, filtro padrão e explícito, validação, duplicidade e ID inexistente.
- CLI: argumentos válidos/inválidos, filtro padrão, saída de erro e código de saída; injetar dependências para evitar estado compartilhado.
- Rodar `npm test` e `npm run typecheck`.

## 6. Riscos e revisão humana
- O arquivo JSON é local e não oferece sincronização entre máquinas; falhas de leitura ou gravação devem ser reportadas, nunca tratadas como store vazio.
- Confirmar a forma final das mensagens de erro e dos nomes dos comandos antes da implementação.
