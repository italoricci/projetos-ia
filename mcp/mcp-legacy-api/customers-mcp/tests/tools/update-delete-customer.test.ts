import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import type { Customer } from '../../src/domain/customer.ts';
import { ToolNames } from '../../src/mcp/constants/constants.ts';
import { createTestClient } from '../test-helper.ts';

type CreateCustomerResult = {
  structuredContent: { message: string; id: string };
};

type UpdateCustomerResult = {
  structuredContent: { customer: Customer | null };
};

type DeleteCustomerResult = {
  structuredContent: { message: string };
};

type GetCustomerResult = {
  structuredContent: { customer: Customer | null };
};

describe('Customer MCP Update/Delete Suite', () => {
  let client: Client;

  before(async () => {
    client = await createTestClient();
  });

  after(async () => {
    await client.close();
  });

  it('should update a customer', async () => {
    const customerCreate = {
      name: `Customer ${Math.floor(Math.random() * 1000)}`,
      phone: `119${Math.floor(Math.random() * 100000000)}`,
    };

    const created = (await client.callTool({
      name: ToolNames.CREATE_CUSTOMER,
      arguments: customerCreate,
    })) as unknown as CreateCustomerResult;

    const updatedPayload = {
      id: created.structuredContent.id,
      name: `Updated ${Math.floor(Math.random() * 1000)}`,
      phone: `118${Math.floor(Math.random() * 100000000)}`,
    };

    const updated = (await client.callTool({
      name: ToolNames.UPDATE_CUSTOMER,
      arguments: updatedPayload,
    })) as unknown as UpdateCustomerResult;

    assert.ok(updated.structuredContent.customer);

    // A API legada pode responder o customer atualizado sem retornar _id no corpo.
    // Neste MCP, validamos o name/phone do payload atualizado.

    assert.strictEqual(
      updated.structuredContent.customer?.name,
      updatedPayload.name,
    );
    assert.strictEqual(
      updated.structuredContent.customer?.phone,
      updatedPayload.phone,
    );
  });

  it('should delete a customer', async () => {
    const customerCreate = {
      name: `Customer ${Math.floor(Math.random() * 1000)}`,
      phone: `119${Math.floor(Math.random() * 100000000)}`,
    };

    const created = (await client.callTool({
      name: ToolNames.CREATE_CUSTOMER,
      arguments: customerCreate,
    })) as unknown as CreateCustomerResult;

    const deleted = (await client.callTool({
      name: ToolNames.DELETE_CUSTOMER,
      arguments: { id: created.structuredContent.id },
    })) as unknown as DeleteCustomerResult;

    assert.ok(deleted.structuredContent.message);

    const getAfter = (await client.callTool({
      name: ToolNames.GET_CUSTOMER,
      arguments: { _id: created.structuredContent.id },
    })) as unknown as GetCustomerResult;

    assert.strictEqual(getAfter.structuredContent.customer, null);
  });
});
