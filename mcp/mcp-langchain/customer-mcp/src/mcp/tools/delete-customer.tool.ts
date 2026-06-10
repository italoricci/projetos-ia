import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod/v3';
import { CustomerService } from '../../application/customer-service.ts';
import { CustomerMutationSchema } from '../../domain/customer.ts';
import { ToolNames } from '../constants/constants.ts';

export function registerDeleteCustomerTool(
  server: McpServer,
  service: CustomerService,
) {
  server.registerTool(
    ToolNames.DELETE_CUSTOMER,
    {
      description: 'Delete a customer by id',
      inputSchema: {
        _id: z.string().describe('MongoDB ObjectId of the customer to delete'),
      },
      outputSchema: CustomerMutationSchema.shape,
    },
    async ({ _id }) => {
      try {
        const res = await service.deleteCustomer(_id);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(res, null, 2),
            },
          ],
          structuredContent: {
            message: res?.message ?? `customer ${_id} deleted!`,
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
