# Recomendador de Músicas com Memória (LangGraph)

Demonstração de **persistência de memória no LangGraph** com um chatbot conversacional que recomenda músicas com base nas preferências do usuário, mantendo contexto entre mensagens.

## 🎯 O que eu quero provar neste projeto

Neste projeto, eu quero demonstrar:

- **Conversas com estado (multi-turn)**: a IA precisa lembrar o contexto entre mensagens.
- **Persistência por thread (sessão)**: conversas diferentes não devem “vazar” entre si.
- **Aprendizado incremental de preferências**: quando o usuário informa nome/gêneros/bandas etc., o sistema extrai e salva essas informações.
- **Gerenciamento de contexto**: sumarização do histórico quando ele cresce.
- **Integração real com LLM**: chamadas ao modelo via **OpenRouter**.

## Recursos

- 🎵 **Recomendações inteligentes**: a IA sugere músicas com base nas preferências aprendidas.
- 💬 **Memória conversacional**: lembra nome, bandas e gêneros já informados.
- 🔄 **Isolamento por thread (sessão)**: diferentes usuários/sessões mantêm memórias separadas.
- 📝 **Aprendizado dinâmico**: ao longo da conversa, novas preferências podem ser extraídas e salvas.
- 🧪 **Testes de integração**: verificam comportamento usando chamadas reais ao modelo (quando habilitados).

## Architecture

### Workflow do LangGraph

- `chat`: gera resposta e identifica preferências novas (via schema estruturado)
- `savePreferences`: persiste/mescla as preferências extraídas do usuário
- `summarize`: quando necessário, resume o histórico e remove mensagens antigas

Fontes úteis:

- https://docs.langchain.com/oss/javascript/langgraph/persistence

```
START → chat (with memory) → END
         ↓
   Checkpointer persists state
   across invocations
```

### Project Structure

```
src/
  ├── config.ts                     # Configuration with memory settings
  ├── index.ts                      # Interactive CLI chat interface
  ├── graph/
  │   ├── graph.ts                  # Simple graph with one chat node
  │   └── factory.ts                # Graph builder with memory service
  ├── services/
  │   ├── memory-service.ts         # MemorySaver initialization
  │   └── openrouter-service.ts     # LLM client with chat method
  └── utils/
      └── prompt-loader.ts          # Template loading
prompts/
  └── system.txt                    # System prompt for song recommender
tests/
  └── chat-memory.test.ts           # Integration tests with real LLM
```

## Como a memória funciona

Este projeto demonstra **dois níveis de memória**:

### 1) Memória da conversa (LangGraph checkpointer)

- **Thread ID**: cada conversa usa um `thread_id` para isolamento.
- **Replay automático**: ao invocar novamente com o mesmo `thread_id`, o grafo consegue continuar o contexto.
- **Estado persistido entre execuções**: o LangGraph persiste o estado via _checkpointer_.

### 2) Memória de preferências do usuário (PreferencesService)

- As preferências são extraídas pelo LLM em formato estruturado (schemas Zod).
- Persistência em **SQLite** (via `knex` + `better-sqlite3`).
- Recuperação das preferências para compor o _system prompt_ em mensagens futuras.
- As informações persistidas incluem: nome, idade, gêneros, bandas/artistas e contexto relevante.

Isso demonstra um padrão “híbrido” de memória:

- estado de curto prazo para o contexto da conversa
- memória de longo prazo para preferências do usuário

```typescript
// First message
await graph.invoke(
  { messages: [new HumanMessage("Hi! I'm Alex")] },
  { configurable: { thread_id: 'user-123' } },
);

// Second message - AI remembers "Alex" from previous message
await graph.invoke(
  { messages: [new HumanMessage('Recommend some songs')] },
  { configurable: { thread_id: 'user-123' } },
);
```

## Como executar

1. **Instalar dependências**:

   ```bash
   npm install
   ```

2. **Configurar variáveis de ambiente (.env)**:
   O projeto usa **OpenRouter** (defina `OPENROUTER_API_KEY`).

   Exemplo mínimo:

   ```env
   OPENROUTER_API_KEY=sua_chave_openrouter
   ```

   Observação: `src/config.ts` também define `xTitle`, modelos e a _connection string_ do PostgreSQL usada para o checkpointer/store do LangGraph.

3. **Subir o PostgreSQL (se necessário)**:

   ```bash
   npm run docker:up
   ```

4. **Rodar o chat (CLI)**:

   ```bash
   npm run chat:italo
   ```

   Opcional: simular uma sessão diferente passando `--user` (isso altera o `thread_id`):

   ```bash
   node --experimental-strip-types --env-file .env src/index.ts --user maria
   ```

5. **Rodar testes**:
   ```bash
   npm test
   ```

## Exemplo de conversa

```
Você: Oi!
IA: Olá! Que bom te ver. Me conta seu nome e que tipo de música você gosta.

Você: Meu nome é Alex e eu gosto de rock, principalmente Foo Fighters.
IA: Prazer, Alex! Foo Fighters é demais! Tem outras bandas que você curte ou algum subgênero de rock específico?

Você: Pode recomendar algumas músicas pra mim?
IA: Claro, Alex! Como você curte Foo Fighters, uma boa pra você é "Everlong" (pela energia e impacte da faixa)...
```

## Aprendizados

- **Conversas com estado (multi-turn)**: a memória permite diálogos naturais.
- **Isolamento por thread**: diferentes sessões mantêm contexto separado.
- **Arquitetura simples**: nós bem definidos + checkpointer de memória resolvem o problema.
- **Testes de integração**: a verificação com LLM real garante que o fluxo funciona.

## Próximos passos

- Habilitar/expandir testes de integração conforme o ambiente.
- Tornar a configuração de bancos mais “plugável” via `.env`.
- Evoluir a UI do chat (por exemplo, uma web app com sessões).
- Refinar extração/validação de preferências (campos mais estruturados e menos ambíguos).

## Instalação e configuração

### Instalar dependências

```bash
npm install
```

### Variáveis de ambiente (.env)

Crie um arquivo `.env` na raiz do projeto.

```env
OPENROUTER_API_KEY=sua_chave_openrouter

# Se você quiser, também pode definir referer/título (usados como headers)
# OPENROUTER_HTTP_REFERER=http://localhost:3000
# OPENROUTER_X_TITLE=Recomendador de Músicas

# Observação: a conexão do checkpointer/store está em src/config.ts (PostgreSQL).
```

## Como usar (chat)

### Rodar o chat via CLI

```bash
npm run chat:italo
```

### Trocar o “usuário”/sessão

O parâmetro `--user` influencia o `thread_id` usado pelo LangGraph para isolar a memória.

```bash
node --experimental-strip-types --env-file .env src/index.ts --user maria
```

### Rodar testes

```bash
npm test
```

## Como funciona o grafo

A execução do chatbot é controlada por um grafo LangGraph com nós e _edges_.

- **`chat`**: conversa com o usuário, gera resposta e decide se há preferências novas para extrair.
- **`savePreferences`**: persiste/mescla preferências no banco do usuário.
- **`summarize`**: quando o histórico fica grande, faz sumarização e remove mensagens antigas.

### Observação importante sobre este README

O projeto atual implementa o fluxo de **chat + memória + preferências + sumarização**.

## Conceitos do LangGraph neste projeto

- **Estado tipado** (Zod): o grafo mantém `messages`, `userId`, `userContext` e flags como `needsSummarization`.
- **Nós**:
  - `chat`: chama o LLM com prompts (incluindo preferências recuperadas) e decide se preferências novas devem ser salvas.
  - `savePreferences`: mescla preferências extraídas no banco do usuário.
  - `summarize`: quando o histórico cresce, cria um resumo estruturado e remove mensagens antigas.
- **Checkpointer**: persiste o estado entre invocações usando o `thread_id` (isolamento por sessão).

### Testes

Os testes e2e existem em `tests/chat.e2e.test.ts`. Alguns cenários estão com `it.skip` (estrutura pronta para ampliar cobertura conforme o ambiente). Para executar:

```bash
npm test
```

## Dependências e versões relevantes

- Node: configurado no `package.json` (ECMAScript Modules + TypeScript com `--experimental-strip-types`).
- OpenRouter: via `src/services/open-router.service.ts`.
- Persistência de estado do LangGraph: via PostgreSQL (checkpointer/store em `src/services/memory.service.ts`).
- Persistência de preferências: via SQLite (knex + better-sqlite3) em `src/services/preferences.service.ts`.

## Licença

MIT
