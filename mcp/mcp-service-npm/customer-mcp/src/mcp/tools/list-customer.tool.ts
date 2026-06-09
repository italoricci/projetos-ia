import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod/v3';
import { CustomerService } from '../../application/customer-service.ts';
import { CustomerSchema } from '../../domain/customer.ts';
import { ToolNames } from '../constants/constants.ts';

export function registerListCustomerTool(
  server: McpServer,
  service: CustomerService,
) {
  server.registerTool(
    ToolNames.LIST_CUSTOMERS,
    {
      description: 'List all customers',
      inputSchema: {},
      outputSchema: {
        customers: z.array(CustomerSchema).describe('Array of all customers'),
      },
    },
    async () => {
      try {
        const customers = await service.listCustomers();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(customers, null, 2),
            },
          ],
          structuredContent: { customers },
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: 'Failed to list all customers',
            },
          ],
        };
      }
    },
  );
}
