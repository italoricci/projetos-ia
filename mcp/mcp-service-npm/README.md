# MCP Service Example (Public npm + Private Verdaccio)

Este repositório é um **exemplo de como publicar um servidor MCP** como pacote **no registry público (npm)** e também em um registry **privado via Verdaccio**.

Ele contém um exemplo de servidor MCP (`customer-mcp`) que expõe operações tipo CRUD como **tools** do Model Context Protocol.

## O que tem aqui

- `customer-mcp/`: servidor MCP exemplo (Node.js/TypeScript) para gerenciar “customers” via tools/resources.
- `customer-mcp/docker-compose.yaml`: exemplo de subir o **Verdaccio** localmente para testar o registry privado.
- `customer-mcp/getServiceToken.sh`: script auxiliar para obter tokens (exemplo de autenticação no serviço em `http://localhost:9999`).

> Observação: o arquivo `README.md` deste repositório foca em **como publicar** o servidor MCP. Para uso do servidor em si, veja a documentação dentro de `customer-mcp/`.

## Publicando no npm (registry público)

1. Configure credenciais do npm:
   - `npm login`
2. No diretório do pacote (`customer-mcp`), verifique se o pacote está correto:
   - `package.json` possui `name` e `version`.
3. Faça build (se aplicável):
   - `npm run build`
4. Publique:
   - `npm publish`

## Publicando no Verdaccio (registry privado)

1. Inicie o Verdaccio (local):
   - `cd customer-mcp`
   - `docker compose up`
2. Configure o npm para apontar para o Verdaccio:
   - `npm set registry http://localhost:4873/`
3. Faça login no Verdaccio:
   - `npm login --registry http://localhost:4873/`
4. Publique:
   - `cd customer-mcp`
   - `npm publish`

## Testando após publicar

- Instale o pacote do registry público ou privado (dependendo de onde você publicou).
- Valide se o comando/entrada do pacote (bin) funciona e se o servidor MCP inicia corretamente.
