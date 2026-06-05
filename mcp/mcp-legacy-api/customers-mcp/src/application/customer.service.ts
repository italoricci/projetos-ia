import pkg from 'lodash';
import type {
  CreatedCustomer,
  Customer,
  CustomerQuery,
} from '../domain/customer.ts';
import { CustomerHttpClient } from '../infrastructure/customer.http-client.ts';

const { isUndefined, omitBy, some } = pkg;

export class CustomerService {
  private readonly client: CustomerHttpClient;

  private constructor(client: CustomerHttpClient) {
    this.client = client;
  }

  static create(baseUrl: string): CustomerService {
    const client = new CustomerHttpClient(baseUrl);
    return new CustomerService(client);
  }

  async listCustomers(): Promise<Customer[]> {
    return await this.client.listCustomers();
  }

  async createCustomer(
    customer: Omit<Customer, '_id'>,
  ): Promise<CreatedCustomer> {
    return await this.client.createCustomer(customer);
  }

  async getCustomer(query: CustomerQuery): Promise<Customer | null> {
    if (query._id) {
      return await this.client.getCustomerById(query._id);
    }

    const customers = await this.client.listCustomers();
    const filters = omitBy(query, isUndefined);

    return (
      customers.find((customer) =>
        some(filters, (value, key) => {
          const field = customer[key as keyof Customer];

          if (typeof field === 'string' && typeof value === 'string') {
            return field.toLowerCase().includes(value.toLowerCase());
          }

          return field === value;
        }),
      ) ?? null
    );
  }

  async updateCustomer(
    id: string,
    customer: Omit<Customer, '_id'>,
  ): Promise<Customer | null> {
    return await this.client.updateCustomerById(id, customer);
  }

  async deleteCustomer(id: string): Promise<{ message: string } | null> {
    return await this.client.deleteCustomerById(id);
  }
}
