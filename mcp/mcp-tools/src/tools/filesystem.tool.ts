// https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem
export const fileSystemTool = () => {
  return {
    filesystem: {
      tranport: 'stdio' as const,
      command: 'npx',
      args: [
        '-y',
        '@modelcontextprotocol/server-filesystem',
        `${process.cwd()}/reports`, // importante mandar um diretorio especifico, correndo risco de estourar o contexto da IA
      ],
    },
  };
};
