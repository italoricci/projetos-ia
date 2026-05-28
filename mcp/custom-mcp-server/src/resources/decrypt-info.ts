import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerDecryptionInfoResource(server: McpServer) {
  server.registerResource(
    'decryption://info',
    'decryption://info',
    {
      description:
        'Describes how decryption works, the required encrypted message format, and the passphrase requirement for this server.',
    },
    () => ({
      contents: [
        {
          uri: 'decryption://info',
          mimeType: 'text/plain',
          text: `
Purpose: Decrypt a previously encrypted message
Required input format: <16-byte IV in hex>:<ciphertext in hex>
Passphrase requirement:
  - Use the exact same passphrase that was used during encryption.
  - The server derives the decryption key from the passphrase automatically.

Notes:
  - The encrypted message must keep the full "iv:ciphertext" format unchanged.
  - If the passphrase is different, decryption will fail.
  - If the message is malformed or incomplete, decryption will fail.
  - The output is the original plain text message.
          `.trim(),
        },
      ],
    }),
  );
}
