import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CustomerService } from '../../application/customer.service.ts';
import {
  CustomerSchema,
  CustomerUpdateInputSchema,
  type CustomerUpdateInput,
} from '../../domain/customer.ts';
import { ToolNames } from '../constants/constants.ts';

export function registerUpdateCustomerTool(
  server: McpServer,
  service: CustomerService,
) {
  server.registerTool(
    ToolNames.UPDATE_CUSTOMER,
    {
      description: 'Update a customer by id',
      inputSchema: CustomerUpdateInputSchema,
      outputSchema: {
        customer: CustomerSchema.nullable().describe(
          'Updated customer or null if it does not exist',
        ),
      },
    },
    async (input: CustomerUpdateInput) => {
      try {
        const { id, name, phone } = input;

        const customer = await service.updateCustomer(id, { name, phone });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(customer, null, 2),
            },
          ],
          structuredContent: { customer },
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: 'Failed to update a customer',
            },
          ],
        };
      }
    },
  );
}
