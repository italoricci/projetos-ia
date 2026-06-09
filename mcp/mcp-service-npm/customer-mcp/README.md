# customers-mcp

Servidor MCP (Model Context Protocol) em Node.js/TypeScript que expõe um CRUD de **customers** como **tools**, além de um recurso (resource) e um prompt.

Este pacote também é útil como **exemplo de publicação** em registry público (npm) e privado (Verdaccio), servindo de base para você empacotar e distribuir servidores MCP.

## Visão geral

- **Tools** (ações)
  - `customers-list`
  - `customers-get`
  - `customers-create`
  - `customers-update`
  - `customers-delete`
- **Resource**
  - `api-info` (metadados sobre a API)
- **Prompt**
  - `findCustomer` (para buscar customer por critérios)

> O servidor se conecta a uma API HTTP em `http://localhost:9999/v1` (configurável por código via `BASE_URL`) e usa autenticação por header `X-Service-Token`.

## Requisitos

- Node.js compatível com o projeto (ver `engines` no `package.json`)
- Dependências instaladas (`npm ci`)

## Rodando localmente

### 1) Instalar dependências

```bash
npm ci
```

### 2) Definir autenticação

O servidor espera uma variável de ambiente:

- `SERVICE_TOKEN` (token usado para chamar a API)

Exemplo:

```bash
export SERVICE_TOKEN="<seu-token>"
```

### 3) Iniciar o servidor MCP

```bash
npm run start
```

O modo de desenvolvimento com watch:

```bash
npm run dev
```

## Inspecionando / verificando o servidor MCP

```bash
npm run mcp:inspect
```

## Verdaccio (registry privado) - comandos do pacote

O `docker-compose.yaml` em `customer-mcp/` sobe o Verdaccio em `http://localhost:4873`.

### Subir/Descer

```bash
npm run registry:start
npm run registry:stop
```

### Login no Verdaccio

```bash
npm run registry:login:private
```

### Publicar no Verdaccio

```bash
npm run release:private
```

## npm (registry público) - comandos do pacote

### Login no npm público

```bash
npm run registry:login:public
```

### Publicar no npm público

```bash
npm run release:public
```

## Testes

```bash
npm test
```

Para testes com watch/debug:

```bash
npm run test:dev
```

## Estrutura do código (pontos principais)

- `src/mcp/server.ts`: criação do `McpServer` e registro de tools/resources/prompts
- `src/mcp/tools/*`: implementação de cada tool
- `src/mcp/resources/*`: resource `api-info`
- `src/mcp/prompts/*`: prompt `findCustomer`
- `src/infrastructure/customer-http-client.ts`: cliente HTTP que chama a API backend

## Observação sobre nomes/versões

A versão do pacote está em `package.json`. Use os scripts `release:*` para fazer `npm version patch` e publicar.
