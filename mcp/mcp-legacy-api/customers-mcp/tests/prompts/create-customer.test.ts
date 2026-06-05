import { Client } from '@modelcontextprotocol/sdk/client';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { PromptNames } from '../../src/mcp/constants/constants.ts';
import { createTestClient } from '../test-helper.ts';

describe('Customer Create Prompt', async () => {
  let client: Client;

  before(async () => {
    client = await createTestClient();
  });

  after(async () => {
    await client.close();
  });

  it('should return the create_customer_prompt', async () => {
    const result = await client.getPrompt({
      name: PromptNames.CREATE_CUSTOMER,
      arguments: { name: 'John', phone: '1234567890' },
    });

    const text = result.messages[0].content;
    assert.ok(
      'text' in text && text.text.includes('create_customer'),
      'Prompt should reference the create_customer tool',
    );
    assert.ok(
      'text' in text && text.text.includes('John'),
      'Prompt should include the customer name',
    );
  });
});
