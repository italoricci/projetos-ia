import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PromptNames } from '../constants/constants.ts';

export function registerListCustomersPrompt(server: McpServer) {
  server.registerPrompt(
    PromptNames.LIST_CUSTOMERS,
    {
      description:
        'Prompt to list all customers using the list_customers tool.',

      argsSchema: {},
    },
    () => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: 'Please list all customers using the list_customers tool.',
          },
        },
      ],
    }),
  );
}
