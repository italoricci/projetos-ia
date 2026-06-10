import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod/v3';
import { CustomerService } from '../../application/customer-service.ts';
import { ToolNames } from '../constants/constants.ts';

export function registerCreateCustomer(
  server: McpServer,
  service: CustomerService,
) {
  server.registerTool(
    ToolNames.CREATE_CUSTOMER,
    {
      description: 'Create a new customer',
      inputSchema: {
        name: z.string().describe('Name of the customer'),
        phone: z.string().describe('Phone number of the customer'),
      },
      outputSchema: {
        message: z.string().describe('Name of the created customer'),
        id: z.string().describe('ID of the created customer'),
      },
    },
    async ({ name, phone }) => {
      try {
        const customer = await service.createCustomer({ name, phone });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(customer, null, 2),
            },
          ],
          structuredContent: customer,
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: 'Failed to create a customer',
            },
          ],
        };
      }
    },
  );
}
