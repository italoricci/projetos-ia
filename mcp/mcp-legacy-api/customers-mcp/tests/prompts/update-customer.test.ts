import { Client } from '@modelcontextprotocol/sdk/client';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { PromptNames } from '../../src/mcp/constants/constants.ts';
import { createTestClient } from '../test-helper.ts';

describe('Customer Update Prompt', async () => {
  let client: Client;

  before(async () => {
    client = await createTestClient();
  });

  after(async () => {
    await client.close();
  });

  it('should return the update_customer_prompt', async () => {
    const result = await client.getPrompt({
      name: PromptNames.UPDATE_CUSTOMER,
      arguments: { id: 'customer-id-123', name: 'Jane', phone: '11999999999' },
    });

    const text = result.messages[0].content;
    assert.ok(
      'text' in text && text.text.includes('update_customer'),
      'Prompt should reference the update_customer tool',
    );
    assert.ok(
      'text' in text && text.text.includes('Customer name'),
      'Prompt should include Customer name section',
    );
  });
});
