import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { PromptNames } from '../constants/constants.ts';

export function registerUpdateCustomerPrompt(server: McpServer) {
  server.registerPrompt(
    PromptNames.UPDATE_CUSTOMER,
    {
      description:
        'Prompt to update a customer using the update_customer tool.',
      argsSchema: {},
    },
    (input) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: [
              'Please update a customer using the update_customer tool.',
              `Customer id: ${JSON.stringify((input as any)?.id ?? '')}`,
              `Customer name: ${JSON.stringify((input as any)?.name ?? '')}`,
              `Customer phone: ${JSON.stringify((input as any)?.phone ?? '')}`,
              `Customer update payload: ${JSON.stringify(input)}`,
            ].join('\n'),
          },
        },
      ],
    }),
  );
}
