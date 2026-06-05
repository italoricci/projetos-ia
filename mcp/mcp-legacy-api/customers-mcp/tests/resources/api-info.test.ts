import { Client } from '@modelcontextprotocol/sdk/client';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import { ResourceNames } from '../../src/mcp/constants/constants.ts';
import { createTestClient } from '../test-helper.ts';

describe('Customer Resource Suite', () => {
  let client: Client;
  before(async () => {
    client = await createTestClient();
  });

  after(async () => {
    await client.close();
  });

  it(`should list the ${ResourceNames.API_INFO} resources`, async () => {
    const { resources } = await client.listResources();
    const info = resources.find((r) => r.uri === ResourceNames.API_INFO);
    assert.ok(info);
  });
});
