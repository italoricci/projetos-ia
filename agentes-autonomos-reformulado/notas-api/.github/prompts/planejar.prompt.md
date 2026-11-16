---
agent: agent
description: Gera o plano técnico (como) a partir de uma spec existente.
---

Gere o plano técnico da feature indicada após este comando (um número ou caminho):

${input:spec:Informe o número ou caminho da especificação}

Regras:
- Localize e leia a especificação indicada e `specs/constitution.md`. Se o número corresponder a mais de uma especificação, pergunte qual usar.
- Crie `plan.md` na mesma pasta da especificação.
- Não implemente nada; limite-se ao plano técnico.
- Inclua estas seções:
  1. **Arquivos e camadas:** arquivos a criar ou alterar, respeitando o fluxo HTTP/CLI → service → store.
  2. **Modelo de dados:** tipos e schemas Zod relevantes.
  3. **Contratos:** rotas HTTP e/ou comandos CLI, com entradas e saídas.
  4. **Decisões e trade-offs:** alternativas consideradas e justificativas.
  5. **Estratégia de testes:** casos e abordagem com `node:test`.
  6. **Riscos e revisão humana:** riscos, dúvidas e decisões que precisam de revisão ou decisão humana.
