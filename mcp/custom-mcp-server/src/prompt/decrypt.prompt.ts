import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';

export function registerDecryptPrompt(server: McpServer) {
  server.registerPrompt(
    'decrypt_message_prompt',
    {
      description:
        'Prompt to decrypt an encrypted message using the decrypt_message tool',
      argsSchema: {
        message: z
          .string()
          .describe('The encrypted message in the format iv:ciphertext'),
        encryptionKey: z
          .string()
          .describe(
            'The same passphrase used during encryption — the server derives the decryption key from it automatically',
          ),
      },
    },
    ({ message, encryptionKey }) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Please decrypt the following message using the decrypt_message tool.\nEncrypted message: ${message}\nEncryption key: ${encryptionKey}`,
          },
        },
      ],
    }),
  );
}
