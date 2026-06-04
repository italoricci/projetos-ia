import { Client } from '@modelcontextprotocol/sdk/client';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { PromptNames } from '../../src/mcp/constants/constants.ts';
import { createTestClient } from '../test-helper.ts';

describe('Customer Prompts', async () => {
  let client: Client;

  before(async () => {
    client = await createTestClient();
  });

  after(async () => {
    await client.close();
  });

  it('should return the find_customer_prompt', async () => {
    const result = await client.getPrompt({
      name: PromptNames.FIND_CUSTOMER,
      arguments: { name: 'John', phone: '1234567890', _id: 'customer-id-123' },
    });
    const text = result.messages[0].content;
    assert.ok(
      'text' in text && text.text.includes('customer'),
      'Prompt should reference the get_customer tool',
    );
    assert.ok(
      'text' in text && text.text.includes('John'),
      'Prompt should include the query',
    );
  });
});
