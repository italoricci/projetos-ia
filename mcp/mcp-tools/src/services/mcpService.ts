import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { getCsv2JsonTool } from '../tools/csv2json.tool.ts';
import { fileSystemTool } from '../tools/filesystem.tool.ts';
import { mongoTool } from '../tools/mongo.tool.ts';

export const getMCPTools = async () => {
  const client = new MultiServerMCPClient({
    mcpServers: {
      ...mongoTool(),
      ...fileSystemTool(),
    },
    onMessage: (log, source) => {
      console.log(`[${source.server}] - ${log.data}`);
    },
  });

  const mcpTools = await client.getTools();

  return [...mcpTools, getCsv2JsonTool()];
};
