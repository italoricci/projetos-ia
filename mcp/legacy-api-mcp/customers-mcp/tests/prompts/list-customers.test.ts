import { Client } from '@modelcontextprotocol/sdk/client';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { PromptNames } from '../../src/mcp/constants/constants.ts';
import { createTestClient } from '../test-helper.ts';

describe('Customer List Prompt', async () => {
  let client: Client;

  before(async () => {
    client = await createTestClient();
  });

  after(async () => {
    await client.close();
  });

  it('should return the list_customers_prompt', async () => {
    const result = await client.getPrompt({
      name: PromptNames.LIST_CUSTOMERS,
      arguments: {},
    });

    const text = result.messages[0].content;
    assert.ok(
      'text' in text && text.text.includes('list_customers'),
      'Prompt should reference the list_customers tool',
    );
  });
});
