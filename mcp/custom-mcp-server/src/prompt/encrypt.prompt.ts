import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';

export function registerEncryptPrompt(server: McpServer) {
  server.registerPrompt(
    'encrypt_message_prompt',
    {
      description:
        'Prompt to encrypt a plain-text message using the encrypt_message tool',
      argsSchema: {
        message: z.string().describe('The message to encrypt'),
        encryptionKey: z
          .string()
          .describe(
            'Any passphrase to use for encryption — the server derives a strong key from it automatically',
          ),
      },
    },
    ({ message, encryptionKey }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please encrypt the following message using the encrypt_message tool.\nMessage: ${message}\nEncryption key: ${encryptionKey}`,
          },
        },
      ],
    }),
  );
}
