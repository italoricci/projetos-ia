import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CustomerService } from '../application/customer.service.ts';
import { registerPrompts } from './prompts/index.ts';
import { registerApiInfoResource } from './resources/api-info.resource.ts';
import { registerTools } from './tools/index.ts';

const BASE_URL = 'http://localhost:9999/v1';
const service = CustomerService.create(BASE_URL);

export const server = new McpServer({
  name: 'customers-mcp',
  version: '0.0.1',
});

registerTools(server, service);
registerApiInfoResource(server, BASE_URL);
registerPrompts(server);
