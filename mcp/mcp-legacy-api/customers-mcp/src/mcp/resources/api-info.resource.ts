import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ResourceNames } from '../constants/constants.ts';

export function registerApiInfoResource(server: McpServer, baseUrl: string) {
  server.registerResource(
    ResourceNames.API_INFO,
    ResourceNames.API_INFO,
    {
      description: 'Describe the customer rest API that this MCP server wraps',
    },
    () => ({
      contents: [
        {
          uri: ResourceNames.API_INFO,
          mimeType: 'text/plain',
          text: `
Customers API

  Base URL : ${baseUrl}
  Endpoints:
    GET    /customers          — list all customers
    GET    /customers/:id      — get customer by id
    POST   /customers          — create customer  { name, phone }
    PUT    /customers/:id      — update customer  { name, phone }
    DELETE /customers/:id      — delete customer

  Customer shape: { _id: string, name: string, phone: string }
`,
        },
      ],
    }),
  );
}
