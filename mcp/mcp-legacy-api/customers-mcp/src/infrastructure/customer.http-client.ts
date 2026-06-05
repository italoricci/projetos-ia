import type { CreatedCustomer, Customer } from '../domain/customer.ts';

export class CustomerHttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async listCustomers(): Promise<Customer[]> {
    const res = await fetch(`${this.baseUrl}/customers`);
    return res.json() as Promise<Customer[]>;
  }

  async createCustomer(
    customer: Omit<Customer, '_id'>,
  ): Promise<CreatedCustomer> {
    const res = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });
    return res.json() as Promise<CreatedCustomer>;
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    const res = await fetch(`${this.baseUrl}/customers/${id}`);
    if (res.status === 404) return null;
    return res.json() as Promise<Customer>;
  }

  async updateCustomerById(
    id: string,
    customer: Omit<Customer, '_id'>,
  ): Promise<Customer | null> {
    const res = await fetch(`${this.baseUrl}/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customer),
    });

    if (res.status === 404) return null;

    // Alguns backends retornam { message, id } ou body vazio no PUT.
    // Se não houver JSON, faz fallback consultando pelo id.
    try {
      const maybeJson = (await res.json()) as unknown;
      if (maybeJson && typeof maybeJson === 'object') {
        const asCustomer = maybeJson as Customer;
        if (typeof asCustomer._id === 'string') return asCustomer;
      }
    } catch {
      // ignore
    }

    return await this.getCustomerById(id);
  }

  async deleteCustomerById(id: string): Promise<{ message: string } | null> {
    const res = await fetch(`${this.baseUrl}/customers/${id}`, {
      method: 'DELETE',
    });

    if (res.status === 404) return null;

    // Backend pode retornar JSON ou vazio; tenta parsear com fallback.
    try {
      return (await res.json()) as { message: string };
    } catch {
      return { message: `customer ${id} deleted!` };
    }
  }
}
