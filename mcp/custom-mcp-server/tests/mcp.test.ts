import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { createTestClient } from './helpers.ts';

interface ResponseTool {
  structuredContent: {
    encryptedMessage?: string;
    decryptedMessage?: string;
  };
}

interface PromptMessage {
  role: string;
  content: {
    type: string;
    text: string;
  };
}

interface PromptResponse {
  description?: string;
  messages: PromptMessage[];
}

async function callTool(
  message: string,
  encryptionKey: string,
  client: Client,
  tool: string = 'encrypt_message',
) {
  const result = (await client.callTool({
    name: tool,
    arguments: {
      message,
      encryptionKey,
    },
  })) as unknown as ResponseTool;

  return result;
}

async function getPrompt(
  name: string,
  args: Record<string, string>,
  client: Client,
) {
  const result = (await client.getPrompt({
    name,
    arguments: args,
  })) as unknown as PromptResponse;

  return result;
}

describe('MCP Tools Tests Suite', () => {
  let client: Client;
  const encryptionKey = 'passphrase';

  before(async () => {
    client = await createTestClient();
  });

  after(async () => {
    await client.close();
  });

  it('should encrypt message', async () => {
    const message =
      'And if you go, I wanna go with you And if you die, I wanna die with you';

    const {
      structuredContent: { encryptedMessage },
    } = await callTool(message, encryptionKey, client);

    assert.ok(encryptedMessage, 'Encrypted message should exist');
    assert.ok(encryptedMessage.length > 60, 'Encrypted message invalid');
  });

  it('should decrypt message', async () => {
    const message =
      'And if you go, I wanna go with you And if you die, I wanna die with you';

    const {
      structuredContent: { encryptedMessage },
    } = await callTool(message, encryptionKey, client);

    assert.ok(encryptedMessage, 'Encrypted message should exist');

    const {
      structuredContent: { decryptedMessage },
    } = await callTool(
      encryptedMessage,
      encryptionKey,
      client,
      'decrypt_message',
    );

    assert.deepStrictEqual(message, decryptedMessage, 'Deu ruim');
  });

  it('should list the encryption://info resource', async () => {
    const { resources } = await client.listResources();
    const info = resources.find((r) => r.uri === 'encryption://info');

    assert.ok(info, 'encryption://info should be listed!');
  });

  it('should list the decryption://info resource', async () => {
    const { resources } = await client.listResources();
    const info = resources.find((r) => r.uri === 'decryption://info');

    assert.ok(info, 'decryption://info should be listed!');
  });

  it('should list encrypt_message_prompt', async () => {
    const { prompts } = await client.listPrompts();
    const prompt = prompts.find((p) => p.name === 'encrypt_message_prompt');

    assert.ok(prompt, 'encrypt_message_prompt should be listed!');
  });

  it('should list decrypt_message_prompt', async () => {
    const { prompts } = await client.listPrompts();
    const prompt = prompts.find((p) => p.name === 'decrypt_message_prompt');

    assert.ok(prompt, 'decrypt_message_prompt should be listed!');
  });

  it('should get encrypt_message_prompt with interpolated arguments', async () => {
    const message = 'hello world';

    const prompt = await getPrompt(
      'encrypt_message_prompt',
      {
        message,
        encryptionKey,
      },
      client,
    );

    assert.ok(prompt.messages.length > 0, 'Prompt should contain messages');
    assert.strictEqual(prompt.messages[0]?.role, 'user');
    assert.strictEqual(prompt.messages[0]?.content.type, 'text');
    assert.match(
      prompt.messages[0]?.content.text ?? '',
      /Please encrypt the following message using the encrypt_message tool\./,
    );
    assert.match(
      prompt.messages[0]?.content.text ?? '',
      /Message: hello world/,
    );
    assert.match(
      prompt.messages[0]?.content.text ?? '',
      /Encryption key: passphrase/,
    );
  });

  it('should get decrypt_message_prompt with interpolated arguments', async () => {
    const message = 'ivhex:cipherhex';

    const prompt = await getPrompt(
      'decrypt_message_prompt',
      {
        message,
        encryptionKey,
      },
      client,
    );

    assert.ok(prompt.messages.length > 0, 'Prompt should contain messages');
    assert.strictEqual(prompt.messages[0]?.role, 'user');
    assert.strictEqual(prompt.messages[0]?.content.type, 'text');
    assert.match(
      prompt.messages[0]?.content.text ?? '',
      /Please decrypt the following message using the decrypt_message tool\./,
    );
    assert.match(
      prompt.messages[0]?.content.text ?? '',
      /Encrypted message: ivhex:cipherhex/,
    );
    assert.match(
      prompt.messages[0]?.content.text ?? '',
      /Encryption key: passphrase/,
    );
  });
});
