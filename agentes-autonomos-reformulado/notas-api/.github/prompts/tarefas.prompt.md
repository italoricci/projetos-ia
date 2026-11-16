---
agent: agent
description: Quebra o plano em tarefas pequenas, ordenadas e testáveis.
---

Gere `tasks.md` para a feature indicada após este comando (um número ou caminho):

${input:feature:Informe o número ou caminho da feature}

Regras:
- Localize e leia `spec.md` e `plan.md` da feature. Se a indicação não identificar a feature de forma única, pergunte qual usar.
- Liste as tarefas em ordem de dependência.
- Numere cada tarefa e inicie a linha com `- [ ]` para acompanhar o progresso.
- Mantenha cada tarefa pequena o suficiente para um único commit.
- Defina um critério claro de pronto para cada tarefa (por exemplo, o teste que deve passar).
- Declare as dependências entre tarefas, quando houver.
- Não implemente nada.
