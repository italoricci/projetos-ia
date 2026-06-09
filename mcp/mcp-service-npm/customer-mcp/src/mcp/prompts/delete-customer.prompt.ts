import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PromptNames } from '../constants/constants.ts';

export function registerDeleteCustomerPrompt(server: McpServer) {
  server.registerPrompt(
    PromptNames.DELETE_CUSTOMER,
    {
      description:
        'Prompt to delete a customer using the delete_customer tool.',
      argsSchema: {},
    },
    (input) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Please delete a customer using the delete_customer tool.',
              `Customer id: ${JSON.stringify((input as any)?.id ?? '')}`,
            ].join('\n'),
          },
        },
      ],
    }),
  );
}
