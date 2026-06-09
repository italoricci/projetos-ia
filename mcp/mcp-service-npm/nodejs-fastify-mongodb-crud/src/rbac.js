import { authUsers } from './auth.js';

export async function rbacUserExamples(fastify) {
  console.log('💬 Validate with JWT');

  const adminUser = authUsers.at(0);
  const memberUser = authUsers.at(1);
  const user = adminUser;

  console.log(user);

  const authResponse = await fastify.inject({
    method: 'POST',
    url: `/v1/auth/login`,
    payload: user,
  });
  const { token } = await authResponse.json();
  console.log(token);

  const createCustomerResponse = await fastify.inject({
    method: 'POST',
    url: `/v1/customers`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    payload: { name: 'test', phone: 'test' },
  });

  console.log(' createCustomerResponse ', await createCustomerResponse.json());
}
