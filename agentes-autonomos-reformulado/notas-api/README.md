# notas-api

API HTTP e CLI para criar, listar, concluir e remover tarefas. Requer Node.js 22 ou superior e npm.

## Instalação e execução

```bash
npm install
npm run dev
```

A API atende em `http://localhost:3000`. Os comandos abaixo devem ser executados em outro terminal, na pasta do projeto.

## CLI

```bash
npm run cli -- create "Preparar apresentação"
npm run cli -- list             # todas (padrão)
npm run cli -- list open        # abertas
npm run cli -- list done        # concluídas
npm run cli -- complete <id>
npm run cli -- remove <id>
```

O comando `create` exibe o ID gerado, usado para concluir ou remover a tarefa. Títulos vazios ou repetidos são rejeitados; espaços nas pontas e diferenças entre maiúsculas e minúsculas não distinguem títulos.

## API HTTP

| Método | Rota | Resultado |
| --- | --- | --- |
| `POST` | `/tasks` | Cria tarefa com `{ "title": "..." }`; retorna `201` e a tarefa. |
| `GET` | `/tasks?status={all,open,done}` | Lista tarefas; `status` é opcional e assume `all`. |
| `PATCH` | `/tasks/:id/complete` | Conclui a tarefa; retorna `200` e a tarefa atualizada. |
| `DELETE` | `/tasks/:id` | Remove a tarefa; retorna `204` sem corpo. |

Exemplo:

```bash
curl -X POST http://localhost:3000/tasks \
  -H 'content-type: application/json' \
  -d '{"title":"Preparar apresentação"}'
curl 'http://localhost:3000/tasks?status=open'
```

Entradas inválidas retornam `400`, título duplicado `409` e tarefa inexistente `404`. As respostas de erro incluem `error.code` e `error.message`.

## Persistência e desenvolvimento

API e CLI compartilham `.data/tasks.json`, criado localmente e ignorado pelo Git. Os dados permanecem após reiniciar os processos.

```bash
npm test
npm run typecheck
```
