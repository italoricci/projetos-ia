import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import { decrypt } from '../service.ts';
import {
  handleToolError,
  passphraseSchema,
  textContent,
} from '../shared/utility.ts';

export function registerDecryptMessageTool(server: McpServer) {
  server.registerTool(
    'decrypt_message',
    {
      description: 'Decrypts an encrypted message using the same passphrase.',
      inputSchema: {
        message: z
          .string()
          .min(1)
          .describe('Encrypted message in the format iv:ciphertext.'),
        encryptionKey: passphraseSchema,
      },
      outputSchema: {
        decryptedMessage: z.string().describe('Decrypted plain text message.'),
      },
    },
    async ({ message, encryptionKey }) => {
      try {
        const decryptedMessage = decrypt(message, encryptionKey);

        return {
          content: textContent(decryptedMessage),
          structuredContent: { decryptedMessage },
        };
      } catch (error) {
        return handleToolError('decrypt', error);
      }
    },
  );
}
