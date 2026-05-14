# projetos-ia

Coleção de projetos e experimentos práticos sobre Inteligência Artificial, aprendizado de máquina e aplicações web multimodais.

**Visão geral**

Este repositório reúne materiais, demos e infraestruturas usadas em aulas, lives e projetos pessoais relacionados a IA. O objetivo é fornecer exemplos reprodutíveis, notas de estudo e pequenas aplicações que facilitam o aprendizado prático.

---

## 📚 Conteúdo (preview por subdiretório)

Abaixo, cada subdiretório tem um resumo no mesmo padrão:

- **Visão rápida**
- **Tecnologias**
- **Como rodar**

---

### `teoria/`

**Visão rápida**: material teórico e anotações próprias sobre IA, ML e aplicações práticas.

**Tecnologias**: não se aplica (conteúdo)

**Como rodar**: não se aplica

**Arquivos principais**

- `notas.md`
- `prereq.md`
- `leitura_autoral.pdf` / `links_apoio.pdf`

---

### `mcp/`

**Visão rápida**: projetos relacionados ao **Model Context Protocol (MCP)** para integrar assistentes com fontes externas.

**Tecnologias**: MCP (conceito) + stack varia por subprojeto

**Como rodar**: depende do subprojeto

#### `mcp/context7/`

**Visão rápida**: autenticação com **Next.js**, **Better Auth** e **GitHub OAuth** com persistência em **SQLite**.

**Tecnologias**

- Next.js
- Better Auth
- GitHub OAuth
- SQLite

**Como rodar**

```bash
npm install
# configure .env.local com GITHUB_CLIENT_ID e GITHUB_CLIENT_SECRET
npx @better-auth/cli migrate
npm run dev
```

#### `mcp/grafana/`

**Visão rápida**: stack completa de observabilidade (métricas, logs, traces e alertas) integrada ao fluxo MCP.

**Tecnologias**

- OpenTelemetry Collector
- Grafana, Prometheus, Tempo, Loki
- Blackbox Exporter
- Demo application instrumentada (`_alumnus/`)

**Como rodar**

```bash
npm run docker:infra:up      # Sobe a infraestrutura
npm run docker:infra:logs    # Logs
npm run docker:infra:down    # Para
```

---

### `neo4j/`

**Visão rápida**: embeddings e busca por similaridade usando **Neo4j Vector Store** + modelos da **Hugging Face**.

**Tecnologias**

- Neo4j
- Hugging Face Transformers (embeddings)
- Node.js 22+

**Como rodar**

```bash
npm run infra:up    # Docker Compose (Neo4j)
npm start           # Pipeline embeddings + busca
```

---

### `rag/`

**Visão rápida**: implementação de **RAG** com Neo4j Vector Store + LangChain + OpenRouter.

**Tecnologias**

- LangChain
- Neo4j
- Hugging Face Transformers
- OpenRouter

**Como rodar**

```bash
npm run infra:up
npm start
```

---

### `ollama/`

**Visão rápida**: exemplos de requisições HTTP para execução local de modelos via **Ollama**.

**Tecnologias**

- Ollama (runtime local)
- Arquivos `.http` (REST Client no VSCode)

**Como rodar**

- Use o(s) arquivo(s) `.http` do diretório (ajuste modelo/endpoint conforme necessário)

---

### `prompt-injection/`

**Visão rápida**: demo educacional de **prompt injection** e **defesas com guardrails baseados em LLM**, com **controle de acesso por papel** (admin vs member).

**Tecnologias**

- Node.js, TypeScript
- LangGraph (graph + roteamento)
- OpenRouter (LLM principal + modelo “safeguard”)

**Como rodar**

```bash
npm install
cp .env.example .env
# preencha OPENROUTER_API_KEY

# Modo seguro (guardrails ativados)
npm run chat -- --user ananeri

# Modo não seguro (vulnerável)
npm run chat -- --user ananeri --unsafe

# Admin (sempre funciona)
npm run chat -- --user erickwendel
```

---

### `langchain/`

**Visão rápida**: demos/worflows com **LangGraph/LangChain** (e Fastify quando aplicável).

**Tecnologias**

- LangGraph / LangChain
- TypeScript
- Zod
- OpenRouter (nos exemplos que usam LLM)

**Como rodar**: depende do subprojeto

#### `langchain/registro-medico/`

**Visão rápida**: agentic workflow para **agendamento/cancelamento** com **LangGraph**.

**Tecnologias**

- LangGraph
- Fastify (API)
- OpenRouter + LangSmith (tracing, conforme README do projeto)

**Como rodar**

```bash
cd langchain/registro-medico
npm install
npm run dev
# ou
npm start
```

#### `langchain/recomendacao-musica/` (nota: no repo aparece como `recomendacao-musica/`)

**Visão rápida**: recomendador com **memória persistida** no LangGraph (multi-turn + isolamento por thread + preferências persistidas).

**Tecnologias**

- LangGraph
- OpenRouter
- PostgreSQL (checkpointer/store)
- SQLite (preferências) — conforme o README do projeto

**Como rodar**

```bash
npm install
# defina OPENROUTER_API_KEY no .env
npm run docker:up   # se necessário para PostgreSQL
npm run chat:italo
```

---

### `openrouter/`

**Visão rápida**: consumo da API OpenRouter e variações de gateway/roteamento inteligente.

**Tecnologias**

- OpenRouter SDK
- Fastify/Express (conforme o subprojeto)

**Como rodar**

- depende do subdiretório

---

### `tensorflow/`

**Visão rápida**: experimentos com **TensorFlow.js** (browser e Node.js), incluindo detecção e recomendações.

**Tecnologias**

- TensorFlow.js
- (por projeto) YOLOv5/web workers e/ou lógica MVC/recomendação

**Como rodar**: depende do subprojeto

#### `tensorflow/duck-hunt/`

**Visão rápida**: Duck Hunt com detecção de patos via YOLOv5 (WebGL + pipeline web).

**Tecnologias**

- TensorFlow.js
- YOLOv5 (modelo otimizado para web)

**Como rodar**

- use o README local do diretório (instruções específicas)

#### `tensorflow/ecommerce-recomendation/`

**Visão rápida**: app web que faz acompanhamento de compras (sessionStorage) e prepara base para recomendações com TF.js.

**Tecnologias**

- TensorFlow.js
- JavaScript (front-end MVC)

**Como rodar**

```bash
npm install
npm start
# abra http://localhost:8080
```

---

### `web2.0/`

**Visão rápida**: demos web com IA executada/assistida no browser (Chrome Built-in AI e variações multimodais).

**Tecnologias**

- APIs experimentais do Chrome
- UI client-side

**Como rodar**

- depende do subdiretório (`webai`, `webai-multimodal`, `webai2.0`)

---

## 🛠️ Tecnologias Utilizadas (visão geral do repo)

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
