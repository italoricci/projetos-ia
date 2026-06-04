import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CustomerService } from '../../application/customer.service.ts';
import { registerCreateCustomer } from './create-customer.tool.ts';
import { registerDeleteCustomerTool } from './delete-customer.tool.ts';
import { registerGetCustomer } from './get-customer.tool.ts';
import { registerListCustomerTool } from './list-customer.tool.ts';
import { registerUpdateCustomerTool } from './update-customer.tool.ts';

export function registerTools(server: McpServer, service: CustomerService) {
  registerListCustomerTool(server, service);
  registerCreateCustomer(server, service);
  registerGetCustomer(server, service);
  registerUpdateCustomerTool(server, service);
  registerDeleteCustomerTool(server, service);
}
