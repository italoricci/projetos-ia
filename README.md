# projetos-ia

Coleção de projetos e experimentos práticos sobre Inteligência Artificial, aprendizado de máquina e aplicações web multimodais.

**Visão geral**

Este repositório reúne materiais, demos e infraestruturas usadas em aulas, lives e projetos pessoais relacionados a IA. O objetivo é fornecer exemplos reprodutíveis, notas de estudo e pequenas aplicações que facilitam o aprendizado prático.

---

## 📚 Conteúdo

### `teoria/`

Material teórico e anotações próprias sobre IA — conceitos, referências, anotações de aulas e resumos. Abrange fundamentos de ML, redes neurais, LLMs, RAG, embeddings, engenharia de prompt, fine-tuning, algoritmos genéticos, aprendizado por reforço e execução local de modelos (Ollama, OpenWeights).

**Arquivos principais:**

- `notas.md` — Resumo didático de IA, ML, DL, RNAs, LLMs, engenharia de prompt, RAG, fine-tuning e mais.
- `prereq.md` — Pré-requisitos e referências de estudo.
- `leitura_autoral.pdf` / `links_apoio.pdf` — Materiais de apoio.

---

### `mcp/`

Projetos relacionados ao **Model Context Protocol (MCP)**, padrão da Anthropic para integrar assistentes de IA com fontes de dados externas.

#### `mcp/context7/`

Demo de autenticação com **Next.js**, **Better Auth** e **GitHub OAuth** usando SQLite como banco de dados.

- Login com GitHub OAuth
- Sessão com Better Auth
- Banco SQLite local (`better-auth.sqlite`)
- Interface minimalista com Next.js 14+

**Setup:** `npm install` → configurar `.env.local` → `npx @better-auth/cli migrate` → `npm run dev`

#### `mcp/grafana/`

Stack completa de **observabilidade e monitoramento** com Grafana, integrada ao MCP para consulta de métricas, logs, traces e alertas diretamente do IDE.

**Componentes:**
| Serviço | Função |
|---------|--------|
| **Grafana** | Visualização unificada (métricas, logs, traces) |
| **Prometheus** | Coleta e armazenamento de métricas |
| **Tempo** | Rastreamento distribuído (distributed tracing) |
| **Loki** | Agregação e consulta de logs |
| **OpenTelemetry Collector** | Hub central de telemetria (recebe OTLP, distribui para backends) |
| **Blackbox Exporter** | Monitoramento externo de endpoints HTTP/TCP/ICMP |
| **\_alumnus/** | Aplicação demo Fastify + PostgreSQL instrumentada com OpenTelemetry |

**Comandos principais:**

```bash
npm run docker:infra:up      # Sobe infraestrutura
npm run docker:infra:down    # Para infraestrutura
npm run docker:infra:logs    # Visualiza logs
```

#### `mcp/playwright/`

Automação de testes E2E com **Playwright**, integrada ao fluxo MCP. Contém configuração do Playwright, exemplos de testes e prompts para geração automática de testes.

- Testes de formulários e validação de UI
- Suporte a fallback HTML para ambientes offline
- Prompts para geração de testes via IA

**Comandos:** `npm test` | `npm run test:ci`

---

### `neo4j/`

Sistema de **embeddings e busca por similaridade** usando **Neo4j Vector Store** com modelos da Hugging Face.

- Processamento de PDFs (`tensores.pdf`)
- Geração de embeddings com `HuggingFaceTransformersEmbeddings`
- Armazenamento vetorial no Neo4j
- Busca por similaridade semântica
- Node.js 22+ com suporte a TypeScript nativo (`--experimental-strip-types`)

**Comandos:**

```bash
npm run infra:up    # Sobe Neo4j via Docker Compose
npm start           # Executa pipeline de embeddings + busca
```

---

### `rag/`

Implementação completa de **RAG (Retrieval Augmented Generation)** combinando Neo4j Vector Store, LangChain e OpenRouter.

- Processamento de documentos PDF
- Geração de embeddings com Hugging Face
- Armazenamento vetorial no Neo4j
- Geração de respostas com LLM via OpenRouter
- Salvamento automático das respostas em arquivos Markdown

**Tecnologias:** LangChain, Neo4j, Hugging Face Transformers, OpenRouter

**Comandos:**

```bash
npm run infra:up    # Sobe Neo4j via docker compose
npm start           # Executa pipeline RAG completo
```

---

### `ollama/`

Exemplos de requisições HTTP para execução de **modelos locais via Ollama**.

- Arquivo `.http` para testes com extensão REST Client (VSCode)
- Exemplos com modelos `llama2-uncensored:7b` e `tinyllama`
- Execução 100% local sem custos por token

---

### `openrouter/`

Proxy para consumo da API unificada do **OpenRouter** com suporte a múltiplos modelos e roteamento inteligente.

#### `openrouter/aplicacao/smart-model-router-gateway/`

Gateway **Fastify** para roteamento inteligente entre modelos do OpenRouter.

- Proxy para `/api/v1/chat/completions` com streaming de respostas
- Roteamento por custo, latência ou throughput
- Fallback automático entre modelos
- Suporte a CORS e live-reload
- Interface HTML simples para testes

** tecnologias:** Fastify, @openrouter/sdk, TypeScript

**Comandos:**

```bash
cd openrouter/aplicacao/smart-model-router-gateway
npm install
npm run dev    # Desenvolvimento com watch
npm test       # Executa testes
```

Servidor na porta 3000.

---

#### `openrouter/conceitos/`

Exemplos introdutórios de consumo da API OpenRouter.

- Servidor Express.js simples
  -Requisições HTTP diretas com curl/shell
- Interface HTML para testes básicos

---

### `tensorflow/`

Projetos e experimentos com **TensorFlow.js** para aprendizado de máquina no browser e Node.js.

#### `tensorflow/base/`

Base minimalista para redes neurais com TensorFlow.js no Node.js.

- Dependência: `@tensorflow/tfjs-node`
- Watch mode nativo do Node.js

#### `tensorflow/duck-hunt/`

Jogo **Duck Hunt** com detecção de patos em tempo real usando **YOLOv5** e TensorFlow.js.

- Modelo YOLOv5n otimizado para web (`yolov5n_web_model/`)
- Detecção de objetos no browser via WebGL
- Pipeline completo: bundling com Gulp/Webpack, assets, infraestrutura Terraform
- Arquitetura com web workers para inferência não-bloqueante

#### `tensorflow/ecommerce-recomendation/`

Sistema de **recomendação para e-commerce** com TensorFlow.js.

- Perfis de usuários e catálogo de produtos
- Histórico de compras com `sessionStorage`
- Estrutura MVC (Model-View-Controller)
- WIP: motor de recomendação com embeddings e banco vetorial (Chroma/LanceDB)

---

### `web2.0/`

Demos web que utilizam **modelos de IA embarcados no browser** via APIs experimentais do Chrome e integrações client-side.

#### `web2.0/webai/`

Chat interativo usando a **API nativa de IA do Google Chrome** (Gemini Nano / Built-in AI).

- Execução 100% offline no dispositivo do cliente
- Interface em dark mode com suporte a Markdown
- Streaming de respostas token a token
- Verificação de disponibilidade da API antes da inicialização

#### `web2.0/webai-multimodal/`

Demo **multimodal** (texto + imagem/áudio) com controle de parâmetros (temperature, topK).

- Upload de arquivos (imagem/áudio)
- Parâmetros ajustáveis de geração
- Arquitetura modular: controllers, services, views
- Serviço de tradução integrado

#### `web2.0/webai2.0/`

Versão simplificada da demo WebAI com interface limpa e parâmetros configuráveis.

- Temperature e TopK ajustáveis via UI
- Respostas em streaming
- Design responsivo e acessível

---

## 🛠️ Tecnologias Utilizadas

| Categoria           | Tecnologias                                                        |
| ------------------- | ------------------------------------------------------------------ |
| **Runtime**         | Node.js 22+, TypeScript (experimental strip types)                 |
| **Frameworks**      | Next.js, Express.js, Fastify                                       |
| **ML/IA**           | TensorFlow.js, Hugging Face Transformers, LangChain                |
| **Banco de Dados**  | Neo4j (vetorial), PostgreSQL, SQLite                               |
| **Observabilidade** | Grafana, Prometheus, Tempo, Loki, OpenTelemetry, Blackbox Exporter |
| **Testes**          | Playwright                                                         |
| **Infraestrutura**  | Docker, Docker Compose, Terraform                                  |
| **APIs de IA**      | OpenRouter, Ollama, Gemini Nano (Chrome Built-in AI)               |
| **Ferramentas**     | GitHub OAuth, Better Auth, CORS, Live Reload                       |

---

## 🚀 Como Usar

Cada subdiretório possui seu próprio `README.md` ou `package.json` com instruções específicas. Em geral:

1. Navegue até o projeto de interesse
2. Instale as dependências: `npm install`
3. Siga as instruções do README local

---

## 📄 Licença

MIT — Veja os arquivos `LICENSE` individuais em cada subprojeto quando disponíveis.
