import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerDecryptionInfoResource } from './decrypt.resource.ts';
import { registerEncryptionInfoResource } from './encrpyt.resource.ts';

export function registerResources(server: McpServer) {
  registerEncryptionInfoResource(server);
  registerDecryptionInfoResource(server);
}
