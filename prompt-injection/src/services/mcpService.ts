import { MultiServerMCPClient } from '@langchain/mcp-adapters';

// process.cwd - current working directory,
// para garantir que o MCP acesse os arquivos relativos ao projeto,
// independentemente de onde o comando seja executado

export const getTools = async () => {
  const mcpClient = new MultiServerMCPClient({
    filesystem: {
      transport: 'stdio',
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-filesystem', process.cwd()],
    },
  });
  // documentacao que sera injetado no prompt do modelo,
  // para que ele possa usar as ferramentas disponiveis
  return mcpClient.getTools();
};
