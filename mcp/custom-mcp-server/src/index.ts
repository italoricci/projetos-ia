import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { server } from './mcp.ts';

async function main() {
  // transport: stdio, sse e http - podendo ser uma API, processamento por demanda;
  // stdio e executado na maquina do cliente (nesse caso um pacote npm);
  const tranport = new StdioServerTransport();
  await server.connect(tranport);
  // por padrao no mcp so existe console.error;
  console.error('Encrypt MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
