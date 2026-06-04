# TODO - Update/Delete Customer MCP

- [x] Ler/validar schema do domain e preparar extends Zod para input de id obrigatório
- [x] Implementar update/delete no CustomerHttpClient
- [x] Implementar métodos updateCustomer/deleteCustomer no CustomerService
- [x] Criar tool MCP `update_customer` (update-customer.tool.ts)
- [x] Criar tool MCP `delete_customer` (delete-customer.tool.ts)

- [x] Registrar novas tools em `src/mcp/tools/index.ts`
- [x] Adicionar ToolNames para update/delete em `src/mcp/constants/constants.ts`
- [x] Criar testes unitários para update/delete via MCP client
- [x] Rodar `npm test` e corrigir qualquer falha até ficar 100% passando
