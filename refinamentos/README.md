# Discovery & Refinement

## Visão geral

Este repositório implementa um pipeline de **Discovery & Refinement** para transformar requisitos brutos e feedbacks em artefatos acionáveis para engenharia e produto, usando LLMs.

O pipeline utiliza **LLMS** para:

- extrair e refinar requisitos/edge cases;
- gerar especificações em Markdown e Mermaid.js;
- produzir artefatos estruturados em **JSON** para consumo downstream (ex.: i18n e priorização de backlog);
- sanitizar dados de usuários (LGPD) antes de análise.

## Arquitetura do Pipeline (alto nível)

Com base nos arquivos encontrados no repositório, o fluxo pode ser descrito assim:

1. **Discovery (Requisitos / Briefing)**
   - Entrada: `requisitos/briefing-bruto.md` (fluxo feliz + regras iniciais)
   - Saída esperada: refinamentos, estados de UI e cenários ocultos

2. **Refinement (Extração de riscos e estados)**
   - Arquivo de instrução: `requisitos/system-instructions-refinement.md`
   - Resultado (exemplo): `gerados/refinamento-gerado.md`

3. **Geração de Diagrama de Fluxo (Mermaid.js)**
   - Instrução: `requisitos/mermaid-prompt.md`
   - Saída: `gerados/diagrama-fluxo-agendamento-pix-mermaid.md` e/ou `gerados/diagrama-fluxo-agendamento.mermaid`

4. **Geração de Mensagens (UX Writer / i18n-ready)**
   - Instrução: `requisitos/ux-writer.md` e `requisitos/extract-task.md`
   - Saída: JSON com chaves de erro e ações (ex.: `gerados/messages-pt-BR.json`)

5. **Sanitização LGPD (Data Sanitization)**
   - Instrução: `requisitos/sanitizer-data.md`
   - Entrada exemplo: `data/garbage-data.json`
   - Saída gerada:
     - `gerados/sanitized-data.json`
     - `gerados/sanitized-garbage-data.json` (dataset sanitizado para teste)

6. **Priorização de Backlog (a partir de feedbacks sanitizados)**
   - Instrução: `requisitos/backlog-feedback.md`
   - Saída gerada:
     - `gerados/sanitized-data-backlog.md`
     - `gerados/sanitized-tickets-backlog.json`

## Como utilizar

1. Clone o repositório:
   - `git clone <url-do-repositorio>`
   - `cd refinamentos`

2. Garanta que você tem um motor de LLM configurado (ex.: Google AI Studio / Gemini) capaz de:
   - ler os prompts em `requisitos/`;
   - aplicar o prompt no contexto dos arquivos de entrada;
   - escrever os artefatos em `gerados/`.

3. Estruture seu runner de LLM para:
   - carregar os arquivos de instrução em `requisitos/`;
   - alimentar as entradas relevantes (ex.: `data/garbage-data.json`, `requisitos/briefing-bruto.md`);
   - persistir saídas em `gerados/`.

4. Se necessário, implemente etapas específicas:
   - **Sanitização LGPD**: produzir um array JSON estrito (sem PII), incluindo `author` anonimizado.
   - **Extração de backlog**: transformar o array sanitizado em:
     - markdown priorizado (`sanitized-data-backlog.md`)
     - JSON array bruto (`sanitized-tickets-backlog.json`) conforme schema.

## Stack Tecnológico

- **Engenharia de Prompt**
- **LLMs (Minimax M2.7, Nemotron 3 e Kimi K2.6)**
- **Markdown**
- **JSON**
- **Mermaid.js**
- **Data Sanitization (LGPD)**

## Artefatos gerados (exemplos)

- `gerados/refinamento-gerado.md`
- `gerados/diagrama-fluxo-agendamento-pix-mermaid.md`
- `gerados/messages-pt-BR.json`
- `gerados/sanitized-data.json`
- `gerados/sanitized-data-backlog.md`
- `gerados/sanitized-tickets-backlog.json`

## Observações

- Todos os outputs “contratuais” (i18n e backlog) devem respeitar o formato estrito definido nos prompts.
- A sanitização LGPD deve remover PII e descartar ruídos/bots, preservando contexto técnico útil.
