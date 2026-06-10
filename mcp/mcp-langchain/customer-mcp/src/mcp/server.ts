import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CustomerService } from '../application/customer-service.ts';
import { registerPrompts } from './prompts/index.ts';
import { registerApiInfoResource } from './resources/api-info.ts';
import { registerTools } from './tools/index.ts';

const BASE_URL = 'http://localhost:9999/v1';
const SERVICE_TOKEN = process.env.SERVICE_TOKEN!;
const service = new CustomerService(BASE_URL, SERVICE_TOKEN);

export const server = new McpServer({
  name: 'customers-mcp',
  version: '0.0.1',
});

registerApiInfoResource(server, BASE_URL);
registerTools(server, service);
registerPrompts(server);
