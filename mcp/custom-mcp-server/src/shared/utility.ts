import z from 'zod/v3';

export const textContent = (text: string) => [{ type: 'text' as const, text }];

export const passphraseSchema = z
  .string()
  .min(1, 'Encryption key is required.')
  .describe('Passphrase used to derive the encryption key.');

export const handleToolError = (
  action: 'encrypt' | 'decrypt',
  error: unknown,
) => {
  const message =
    error instanceof Error
      ? error.message
      : `Unknown error while trying to ${action} the message.`;

  return {
    isError: true,
    content: textContent(`Failed to ${action} message: ${message}`),
  };
};
