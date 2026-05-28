import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDecryptPrompt } from './decrypt.prompt.ts';
import { registerEncryptPrompt } from './encrypt.prompt.ts';

export function registerPrompts(server: McpServer) {
  registerDecryptPrompt(server);
  registerEncryptPrompt(server);
}
