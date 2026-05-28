import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDecryptMessageTool } from './decrypt.tool.ts';
import { registerEncryptMessageTool } from './encrypt.tool.ts';

export function registerTools(server: McpServer) {
  registerEncryptMessageTool(server);
  registerDecryptMessageTool(server);
}
