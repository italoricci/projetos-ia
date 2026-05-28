import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerPrompts } from './prompt/index.ts';
import { registerResources } from './resources/index.ts';
import { registerTools } from './tools/index.ts';

export const server = new McpServer({
  name: '@iagenerate/ciphersuite-mcp',
  version: '0.0.1',
});

registerTools(server);
registerResources(server);
registerPrompts(server);
