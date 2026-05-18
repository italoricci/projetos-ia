import { createServer } from './server.ts';

const app = createServer();

await app.listen({ port: 4000, host: '0.0.0.0' });
console.log(`Server is running on http://0.0.0.0:4000`);

//  curl \
//  -X POST \
//  -H 'Content-type: application/json' \
//  --data '{"question": "upper"}' \
//  localhost:4000/chat

app
  .inject({
    method: 'POST',
    url: '/sales',
    payload: {
      //   question: 'Quais cursos são geralmente comprados juntos?',
      question:
        "Encontre os cursos que os alunos geralmente compram após 'Machine Learning em Navegadores'",
      //   question: 'Mostre a distribuição de receita entre todos os cursos',
      //   question: 'Quais usuários progrediram mais de 80%?',
      //   question: 'Quais cursos tiveram mais reembolsos?'
      // question: 'Which courses are commonly bought together?', // complex
      // question: "Find courses that students typically purchase after 'Machine Learning em Navegadores'", // complex
      // question: 'Show me the revenue distribution across all courses',
      // question: 'Which users have progressed over 80%?',
    },
  })
  .then((response) => {
    console.log(JSON.parse(response.body)?.answer);
  })
  .catch((error) => {
    console.error('Error making test request:', error);
  });
