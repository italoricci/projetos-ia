import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CustomerService } from '../../application/customer.service.ts';
import {
  CustomerSchema,
  CustomerSchemaQuery,
  type CustomerQuery,
} from '../../domain/customer.ts';
import { ToolNames } from '../constants/constants.ts';

export function registerGetCustomer(
  server: McpServer,
  service: CustomerService,
) {
  server.registerTool(
    ToolNames.GET_CUSTOMER,
    {
      description: 'Find a customer by _id, name or phone',
      inputSchema: CustomerSchemaQuery.describe(
        'Query to find a customer by _id, name or phone. At least one field is required.',
      ),
      outputSchema: {
        customer: CustomerSchema.nullable().describe(
          'Customer found or null if no customer was found',
        ),
      },
    },
    async (query: CustomerQuery) => {
      try {
        const customer = await service.getCustomer(query);
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
              text: 'Failed to get customer',
            },
          ],
        };
      }
    },
  );
}
