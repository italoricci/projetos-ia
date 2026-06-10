import { randomUUID } from 'node:crypto';
import { REQUESTS_PER_MINUTE } from './config.js';

export const authUsers = [
  {
    username: 'erickwendel',
    password: '123123',
    role: 'admin',
  },
  {
    username: 'italo',
    role: 'admin',
    password: '1234',
  },
  {
    username: 'guest',
    role: 'member',
    password: '1234',
  },
  {
    username: 'ananeri',
    password: '1234',
    role: 'member',
  },
];

export const JWT_SECRET = '99f24758-2f6e-4906-ad6c-d259c540b0ad';
export const ADMIN_SUPER_SECRET = 'super-secret-admin-token';

export const rateLimitOptions = {
  max: REQUESTS_PER_MINUTE, // mas por minutos
  timeWindow: '1 minute',
  keyGenerator: (request) =>
    (request.headers.authorization || request.headers['x-service-token']) ??
    request.ip,
};

const issuedServicesTokens = new Map(); // serviceToken -> role, ideal que se salve no banco de dados;

export function initAuthRoute(fastify) {
  // tipo um filtro por request, chamado a cada rrequest, para verificar se a rota precisa de autenticação ou não
  fastify.addHook('onRequest', async (request, reply) => {
    console.log('🔍 Verify need authentication:', request.originalUrl);

    const publicRoutes = [
      '/v1/health',
      '/v1/auth/login',
      '/v1/auth/service-token',
    ];

    if (publicRoutes.includes(request.originalUrl)) return;

    const authorization = request.headers.authorization;
    const serviceToken = request.headers['x-service-token'];

    if (authorization?.startsWith('Bearer ')) {
      try {
        await request.jwtVerify();
        return;
      } catch (error) {
        fastify.log.error({ error }, 'Error verifying JWT');
        return reply.code(401).send({ message: 'Invalid bearer token' });
      }
    }

    if (serviceToken) {
      try {
        const user = issuedServicesTokens.get(serviceToken);
        if (!user) {
          return reply.code(401).send({ message: 'Invalid service token' });
        }
        request.user = user;
        return;
      } catch (error) {
        fastify.log.error({ error }, 'Error validating service token');
        return reply.code(401).send({ message: 'Invalid service token' });
      }
    }

    return reply.code(401).send({
      message: 'Missing authentication header',
    });
  });

  fastify.post(
    '/v1/auth/login',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              token: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, password } = request.body;
      const user = authUsers.find(
        (u) =>
          u.username.toLocaleLowerCase() === username.toLocaleLowerCase() &&
          u.password === password,
      );
      if (!user) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }

      const token = fastify.jwt.sign(
        { username, role: user.role },
        { expiresIn: '1h' },
      );
      return reply.code(200).send({ token });
    },
  );

  fastify.post(
    '/v1/auth/service-token',
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password', 'adminSuperSecret'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' },
            adminSuperSecret: { type: 'string' },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              serviceToken: { type: 'string' },
              role: { type: 'string' },
            },
          },
          401: {
            type: 'object',
            properties: {
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { username, password, adminSuperSecret } = request.body;
      if (adminSuperSecret !== ADMIN_SUPER_SECRET) {
        return reply.code(401).send({ message: 'Invalid admin super secret' });
      }

      const user = authUsers.find(
        (u) =>
          u.username.toLocaleLowerCase() === username.toLocaleLowerCase() &&
          u.password === password,
      );
      if (!user) {
        return reply.code(401).send({ message: 'Invalid credentials' });
      }

      const serviceToken = randomUUID();
      issuedServicesTokens.set(serviceToken, {
        role: user.role,
        username: user.username,
      });
      return reply.code(200).send({ serviceToken, role: user.role });
    },
  );
}

export function requiredRole(role) {
  return async function (request, reply) {
    console.log('Role do request:', request.user?.role);
    if (request.user.role == role) return;
    return reply
      .code(403)
      .send({ message: 'Forbidden: insufficient permissions' });
  };
}
