import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import z from 'zod/v3';
import { encrypt } from '../service.ts';
import {
  handleToolError,
  passphraseSchema,
  textContent,
} from '../shared/utility.ts';

export function registerEncryptMessageTool(server: McpServer) {
  server.registerTool(
    'encrypt_message',
    {
      description: 'Encrypts a plain text message using a passphrase.',
      inputSchema: {
        message: z.string().min(1).describe('Plain text message to encrypt.'),
        encryptionKey: passphraseSchema,
      },
      outputSchema: {
        encryptedMessage: z
          .string()
          .describe('Encrypted message in the format iv:ciphertext.'),
      },
    },
    async ({ message, encryptionKey }) => {
      try {
        const encryptedMessage = encrypt(message, encryptionKey);

        return {
          content: textContent(encryptedMessage),
          structuredContent: { encryptedMessage },
        };
      } catch (error) {
        return handleToolError('encrypt', error);
      }
    },
  );
}
