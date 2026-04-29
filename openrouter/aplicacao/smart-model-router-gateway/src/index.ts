import { config } from './config.ts';
import { OpenRouterService } from './openrouter-service.ts';
import { createServer } from './server.ts';

const routerService = new OpenRouterService(config);
const app = createServer(routerService);

await app.listen({ port: 3000, host: '0.0.0.0' });

console.info(`Server is running at http://localhost:3000`);

app
  .inject({
    method: 'POST',
    url: '/chat',
    payload: {
      question: 'Qual capital do brasil?',
    },
  })
  .then((response) => {
    console.log('Response from /chat:', response.json());
  })
  .catch((error) => {
    console.error('Error during test request:', error);
  });
