# Registro Médico (LangGraph)

Demo de um **agentic workflow** com **LangGraph** (TypeScript) para lidar com interações de **agendamento e cancelamento de consultas**.

O grafo detecta a intenção do usuário, executa a ação (agendar/cancelar) e então gera uma mensagem final amigável.

> Endpoint: `POST /chat`

---

## 🎯 O que o grafo faz

Fluxo (state machine):

`identifyIntent` → (`schedule` | `cancel` | `message`) → `message` → `END`

- **identifyIntent**: classifica a intenção do usuário em `schedule`, `cancel` ou `unknown` e extrai dados (médico, data/hora, paciente, motivo).
- **schedule**: valida campos e tenta criar o agendamento.
- **cancel**: valida campos e tenta cancelar o agendamento.
- **message**: gera a resposta final ao paciente (sucesso/erro) com base no estado atual.

Se a intenção vier `unknown` (ou se `error` existir), o grafo vai diretamente para `message`.

---

## 🧩 Nodes

- **identifyIntent** (`src/graph/nodes/identifyIntentNode.ts`)
  - Usa `IntentSchema` (Zod)
  - Monta prompts em `src/prompts/v1/identifyIntent.ts`
  - Retorna: `intent`, `professionalId`/`professionalName`, `datetime`, `patientName`, `reason`

- **schedule** (`src/graph/nodes/schedulerNode.ts`)
  - Valida com Zod (exige `professionalId`, `datetime`, `patientName`)
  - Chama `AppointmentService.bookAppointment(...)`
  - Retorna: `actionSuccess` e `appointmentData` ou `actionError`

- **cancel** (`src/graph/nodes/cancellerNode.ts`)
  - Valida com Zod (exige `professionalId`, `datetime`, `patientName`)
  - Chama `AppointmentService.cancelAppointment(...)`
  - Retorna: `actionSuccess` e `appointmentData` ou `actionError`

- **message** (`src/graph/nodes/messageGeneratorNode.ts`)
  - Usa `MessageSchema` (Zod)
  - Monta prompts em `src/prompts/v1/messageGenerator.ts`
  - Gera um `AIMessage` final com base no cenário:
    - `schedule_success`, `schedule_error`, `cancel_success`, `cancel_error`, `unknown`

---

## 📦 Estado do grafo (GraphState)

Definido em `src/graph/graph.ts` via Zod:

- `messages`: array de mensagens (LangGraph)
- `intent`: `schedule | cancel | unknown`
- `professionalId`, `professionalName`
- `datetime`
- `patientName`
- `reason` (opcional, para agendamento)
- `actionSuccess`, `actionError`, `appointmentData`
- `error` (opcional)

---

## 🌐 API HTTP (Fastify)

Arquivo: `src/server.ts`

### Request

`POST /chat`

Body:

```json
{
  "question": "string (minLength: 10)"
}
```

### Exemplo de input (agendar)

```bash
curl -X POST http://localhost:3000/chat \
  -H 'content-type: application/json' \
  -d '{"question":"Olá, sou Maria Santos e quero agendar uma consulta com Dr. Alicio da Silva amanhã às 16h para um check-up regular"}'
```

### Exemplo de input (cancelar)

```bash
curl -X POST http://localhost:3000/chat \
  -H 'content-type: application/json' \
  -d '{"question":"Cancele minha consulta com Dra. Ana Pereira que tenho hoje às 14h, me chamo Joao da Silva"}'
```

---

## 🛠️ Configuração (OpenRouter + LangSmith)

Crie um arquivo `.env` dentro de `registro-medico/`.

### Variáveis principais

```env
OPENROUTER_API_KEY=...

# Project/Tracing
LANGSMITH_API_KEY=...
LANGSMITH_TRACING=true
LANGSMITH_PROJECT=registro-medico

# (Opcional) O modelo/headers são controlados pelo `src/config.ts`
# e também via env vars relacionadas ao OpenRouter.
```

> Dica: o `src/config.ts` atualmente define `models`, `temperature` e headers do OpenRouter diretamente (além de ler `OPENROUTER_API_KEY`).

O cliente LLM está em `src/services/llmService.ts` e usa:

- `ChatOpenAI` com `baseURL=https://openrouter.ai/api/v1`
- `providerStrategy(schema)` para produzir **saídas estruturadas** via Zod

---

## 🚀 Como rodar

```bash
cd langchain/registro-medico
npm install
npm run dev
# ou
npm start
```

### Tests

```bash
npm test
```

> Observação: os testes E2E disparam calls para o modelo (dependendo da configuração), então podem ficar lentos caso o provedor esteja indisponível.

---

## 🗂️ Estrutura de pastas

- `src/graph/` — definição do grafo e factory
- `src/graph/nodes/` — nodes do LangGraph
- `src/prompts/v1/` — templates de prompts (intenção e resposta)
- `src/services/` — integração com LLM e serviço de agendamento
- `tests/` — testes E2E

---

## 🧠 Limitações do exemplo

- `AppointmentService` mantém **agendamentos em memória** (array local). Reiniciar o servidor zera os agendamentos.

---

## Licença

MIT
