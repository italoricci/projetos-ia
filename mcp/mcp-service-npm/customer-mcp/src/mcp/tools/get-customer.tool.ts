import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CustomerService } from '../../application/customer-service.ts';
import {
  CustomerMutationSchema,
  CustomerQuerySchema,
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
      inputSchema: CustomerQuerySchema,
      outputSchema: CustomerMutationSchema.shape,
    },
    async (query: CustomerQuery) => {
      try {
        const customer = await service.findCustomer(query);
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
