import { Client } from '@modelcontextprotocol/sdk/client';
import assert from 'node:assert';
import { after, before, describe, it } from 'node:test';
import type { CreatedCustomer, Customer } from '../../src/domain/customer.ts';
import { ToolNames } from '../../src/mcp/constants/constants.ts';
import { createTestClient } from '../test-helper.ts';

type CustomersResult = { structuredContent: { customers: Customer[] } };
type GetCustomerResult = { structuredContent: { customer: Customer } };
type CreateCustomerResult = {
  structuredContent: CreatedCustomer;
};

describe('Customer MCP Suite', () => {
  let client: Client;
  before(async () => {
    client = await createTestClient();
  });

  after(async () => {
    await client.close();
  });

  it('should be list all customers', async () => {
    const result = (await client.callTool({
      name: ToolNames.LIST_CUSTOMERS,
      arguments: {},
    })) as unknown as CustomersResult;

    assert.ok(result.structuredContent.customers.length > 0);
  });

  it('should create a customer', async () => {
    const customer = {
      name: `Customer ${Math.floor(Math.random() * 1000)}`,
      phone: `119${Math.floor(Math.random() * 100000000)}`,
    };

    const result = (await client.callTool({
      name: ToolNames.CREATE_CUSTOMER,
      arguments: customer,
    })) as unknown as CreateCustomerResult;

    assert.strictEqual(
      result.structuredContent.message,
      `user ${customer.name} created!`,
    );
    assert.ok(result.structuredContent.id);
  });

  it('should get a specify customer', async () => {
    const customerCreate = {
      name: `Customer ${Math.floor(Math.random() * 1000)}`,
      phone: `119${Math.floor(Math.random() * 100000000)}`,
    };

    (await client.callTool({
      name: ToolNames.CREATE_CUSTOMER,
      arguments: customerCreate,
    })) as unknown as CreateCustomerResult;

    const {
      structuredContent: { customer },
    } = (await client.callTool({
      name: ToolNames.GET_CUSTOMER,
      arguments: {
        name: customerCreate.name,
      },
    })) as unknown as GetCustomerResult;

    assert.ok(customer._id);
    assert.strictEqual(customer.name, customerCreate.name);
  });
});
