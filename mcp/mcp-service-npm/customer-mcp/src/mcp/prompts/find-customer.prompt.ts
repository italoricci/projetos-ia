import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CustomerQuerySchema } from '../../domain/customer.ts';
import { PromptNames } from '../constants/constants.ts';

export function registerFindCustomerPrompt(server: McpServer) {
  server.registerPrompt(
    PromptNames.FIND_CUSTOMER,
    {
      description: 'Prompt to find a customer by name, phone or ID.',
      argsSchema: CustomerQuerySchema.shape,
    },
    (query) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please find the customer matching the following query using the get_customer or list_customers tool.\nQuery: ${JSON.stringify(query)}`,
          },
        },
      ],
    }),
  );
}
