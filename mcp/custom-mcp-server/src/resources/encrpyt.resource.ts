import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerEncryptionInfoResource(server: McpServer) {
  server.registerResource(
    'encryption://info',
    'encryption://info',
    {
      description:
        'Describe the encryption algorithm, key requirements, and output format used by this server',
    },
    () => ({
      contents: [
        {
          uri: 'encryption://info',
          mimeType: 'text/plain',
          text: `
Algorithm : AES-256-CBC
Key derivation: scrypt (passphrase + fixed server salt → 32-byte key)
Output format: <16-byte IV in hex>:<ciphertext in hex>  (separated by ":")
Notes:
  - Users pass any passphrase — the server derives a strong 32-byte key automatically using scrypt.
  - A random IV is generated for every encryption — the same message encrypted twice will produce different output.
  - Use the exact same passphrase to decrypt.
  - Keep the full "iv:ciphertext" string to decrypt later.
          `.trim(),
        },
      ],
    }),
  );
}
