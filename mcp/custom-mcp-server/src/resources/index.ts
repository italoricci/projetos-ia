import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDecryptionInfoResource } from './decrypt-info.ts';
import { registerEncryptionInfoResource } from './encrpyt-info.ts';

export function registerResources(server: McpServer) {
  registerEncryptionInfoResource(server);
  registerDecryptionInfoResource(server);
}
