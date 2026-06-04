import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CustomerSchemaQuery } from '../../domain/customer.ts';
import { PromptNames } from '../constants/constants.ts';

export function registerCreateCustomerPrompt(server: McpServer) {
  server.registerPrompt(
    PromptNames.CREATE_CUSTOMER,
    {
      description:
        'Prompt to create a customer using the create_customer tool.',
      argsSchema: CustomerSchemaQuery.shape,
    },
    (customer) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please create a customer using the create_customer tool.\nCustomer: ${JSON.stringify(
              customer,
            )}`,
          },
        },
      ],
    }),
  );
}
