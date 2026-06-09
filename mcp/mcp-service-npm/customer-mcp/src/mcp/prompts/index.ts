import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCreateCustomerPrompt } from './create-customer.prompt.ts';
import { registerDeleteCustomerPrompt } from './delete-customer.prompt.ts';
import { registerFindCustomerPrompt } from './find-customer.prompt.ts';
import { registerListCustomersPrompt } from './list-customers.prompt.ts';
import { registerUpdateCustomerPrompt } from './update-customer.prompt.ts';

export function registerPrompts(server: McpServer) {
  registerFindCustomerPrompt(server);
  registerCreateCustomerPrompt(server);
  registerListCustomersPrompt(server);
  registerDeleteCustomerPrompt(server);
  registerUpdateCustomerPrompt(server);
}
