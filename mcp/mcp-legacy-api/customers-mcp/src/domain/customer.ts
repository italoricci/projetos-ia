// mapeamento do retorno da api legada

import { z } from 'zod/v3';

export const CustomerSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  phone: z.string(),
});

// Helpers for tool inputs/outputs
export const CustomerSchemaIdRequired = CustomerSchema.extend({
  _id: z.string(),
});

// PUT /customers/:id payload
export const CustomerUpdateInputSchema = z.object({
  id: z.string().describe('ID of the customer to update'),
  name: z.string().describe('Name of the customer'),
  phone: z.string().describe('Phone number of the customer'),
});

// DELETE /customers/:id payload
export const CustomerDeleteInputSchema = z.object({
  id: z.string().describe('ID of the customer to delete'),
});

export type Customer = z.infer<typeof CustomerSchema>;

export const CustomerSchemaQuery = z.object({
  _id: z.string().optional().describe('ID of the customer'),
  phone: z.string().optional().describe('Phone number of the customer'),
  name: z.string().optional().describe('Name of the customer'),
});

export type CustomerQuery = z.infer<typeof CustomerSchemaQuery>;

export type CustomerIdRequired = z.infer<typeof CustomerSchemaIdRequired>;
export type CustomerUpdateInput = z.infer<typeof CustomerUpdateInputSchema>;
export type CustomerDeleteInput = z.infer<typeof CustomerDeleteInputSchema>;

export type CreatedCustomer = { message: string; id: string };
