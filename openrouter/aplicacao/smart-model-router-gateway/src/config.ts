// importando todos os objetos de configuracao do projeto

console.assert(
  process.env.OPENROUTER_API_KEY,
  'OPENROUTER_API_KEY is not defined'
);

export type OpenRouterConfig = {
  apiKey: string;
  httpReferer: string;
  xTitle: string;
  port: number;
  models: string[];
  temperature: number;
  maxTokens: number;
  systemPrompt: string;

  // informacoes para buscar de modelos: ex (modelo mais barato, modelo mais rapido, etc)
  provider: {
    sort: {
      by: string;
      partition: string;
    };
  };
};

export const config: OpenRouterConfig = {
  apiKey: process.env.OPENROUTER_API_KEY!,
  httpReferer: 'http://personal-knowledge-base.com',
  xTitle: 'SmartModelRouterGateway',
  port: 3000,
  models: [
    'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
    'poolside/laguna-xs.2:free',
    'openai/gpt-oss-120b:free',
  ],
  temperature: 0.2,
  maxTokens: 1500,
  systemPrompt:
    'Você é um assistente de IA útil e eficiente. Responda às perguntas de forma clara e concisa, fornecendo informações relevantes e precisas. Mantenha suas respostas curtas e diretas ao ponto, evitando detalhes desnecessários. Se a pergunta for ambígua, peça esclarecimentos para fornecer a melhor resposta possível.',
  provider: {
    sort: {
      //   by: 'price', // preco
      //   by: 'latency', // latencia
      by: 'throughput', // taxa de transferencia
      partition: 'none',
    },
  },
};
