---
agent: agent
description: Implementa uma tarefa pendente por vez, com testes.
---

Implemente tarefas de `tasks.md` para a feature indicada após este comando:

${input:feature:Informe o número ou caminho da feature}

Trabalhe em uma tarefa por invocação:
1. Leia `spec.md`, `plan.md`, `tasks.md`, `specs/constitution.md` e as instructions aplicáveis.
2. Escolha a próxima tarefa `- [ ]` cujas dependências estejam concluídas.
3. Se a spec estiver incorreta ou contradizer o plano, pare sem implementar e informe o problema.
4. Implemente a tarefa seguindo o plano, as instructions e a constituição. Escreva ou atualize os testes correspondentes.
5. Rode `npm run test` e `npm run typecheck` no projeto.
6. Marque a tarefa como `- [x]` somente quando o critério de pronto estiver atendido e testes e typecheck estiverem verdes.
7. Pare após concluir uma fatia coesa e peça revisão humana; não comece outra tarefa nesta invocação.

Nunca desative testes nem verificações de tipos para fazê-los passar. Se algum comando falhar, corrija a causa ou reporte o bloqueio sem marcar a tarefa como concluída.
