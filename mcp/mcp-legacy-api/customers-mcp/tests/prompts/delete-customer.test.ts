import { Client } from '@modelcontextprotocol/sdk/client';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { PromptNames } from '../../src/mcp/constants/constants.ts';
import { createTestClient } from '../test-helper.ts';

describe('Customer Delete Prompt', async () => {
  let client: Client;

  before(async () => {
    client = await createTestClient();
  });

  after(async () => {
    await client.close();
  });

  it('should return the delete_customer_prompt', async () => {
    const result = await client.getPrompt({
      name: PromptNames.DELETE_CUSTOMER,
      arguments: { id: 'customer-id-123' },
    });

    const text = result.messages[0].content;
    assert.ok(
      'text' in text && text.text.includes('delete_customer'),
      'Prompt should reference the delete_customer tool',
    );
  });
});
