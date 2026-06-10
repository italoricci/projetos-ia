import { randomUUID } from 'node:crypto';
import { ADMIN_SUPER_SECRET, authUsers } from './auth.js';

export async function serviceTokenExamples(fastify) {
  console.log('🤖 Validate with Service-Tokens');

  const adminUser = authUsers.at(0);
  const memberUser = authUsers.at(1);
  const user = adminUser;
  console.log(user);

  const authResponse = await fastify.inject({
    method: 'POST',
    url: `/v1/auth/service-token`,
    payload: {
      ...user,
      adminSuperSecret: ADMIN_SUPER_SECRET,
    },
  });
  const { role, serviceToken } = await authResponse.json();
  console.log(' serviceTokenResponse ', { role, serviceToken });

  const createCustomerResponse = await fastify.inject({
    method: 'POST',
    url: `/v1/customers`,
    headers: {
      'X-Service-Token': `${serviceToken}`,
    },
    payload: { name: `name${randomUUID()}`, phone: 'test' },
  });

  console.log(' serviceTokenResponse ', await createCustomerResponse.json());
}
