import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod/v3';
import { CustomerService } from '../../application/customer.service.ts';
import {
  CustomerDeleteInputSchema,
  type CustomerDeleteInput,
} from '../../domain/customer.ts';
import { ToolNames } from '../constants/constants.ts';

export function registerDeleteCustomerTool(
  server: McpServer,
  service: CustomerService,
) {
  server.registerTool(
    ToolNames.DELETE_CUSTOMER,
    {
      description: 'Delete a customer by id',
      inputSchema: CustomerDeleteInputSchema,
      outputSchema: {
        message: z.string().describe('Deletion message'),
      },
    },
    async (input: CustomerDeleteInput) => {
      try {
        const res = await service.deleteCustomer(input.id);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(res, null, 2),
            },
          ],
          structuredContent: {
            message: res?.message ?? `customer ${input.id} deleted!`,
          },
        };
      } catch (error) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: 'Failed to delete a customer',
            },
          ],
        };
      }
    },
  );
}
