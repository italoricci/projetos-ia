# Especificação: gerenciamento de tarefas

## 1. Contexto e problema
Usuários precisam criar e acompanhar tarefas por meio da interface HTTP ou da CLI, consultando seu estado e removendo tarefas que não são mais necessárias.

## 2. User Stories
- Como usuário, quero criar uma tarefa com título, para registrar algo que preciso fazer.
- Como usuário, quero listar tarefas por estado, para acompanhar todas, as abertas ou as concluídas.
- Como usuário, quero concluir uma tarefa, para registrar que foi feita.
- Como usuário, quero remover uma tarefa, para excluir um item que não preciso mais.

## 3. Requisitos funcionais
- **RF-1:** Permitir criar tarefas informando um título não vazio.
- **RF-2:** Rejeitar título já cadastrado após remover espaços nas pontas e desconsiderar maiúsculas/minúsculas na comparação.
- **RF-3:** Permitir listar tarefas com filtro `all`, `open` ou `done`; sem filtro, usar `all`.
- **RF-4:** Permitir concluir uma tarefa identificada individualmente.
- **RF-5:** Permitir remover uma tarefa identificada individualmente, aberta ou concluída.
- **RF-6:** Disponibilizar criação, listagem, conclusão e remoção pelas interfaces HTTP e CLI.
- **RF-7:** Informar claramente falhas de validação, título duplicado ou identificador inexistente em ambas as interfaces.

## 4. Critérios de aceite (EARS)
- Quando o usuário criar uma tarefa com título válido e único, o sistema deve registrá-la como aberta.
- Quando o usuário criar uma tarefa sem título ou com título duplicado, o sistema deve rejeitá-la e informar o motivo.
- Quando o usuário listar tarefas sem filtro, o sistema deve retornar todas; com `open` ou `done`, deve retornar apenas tarefas daquele estado.
- Quando o usuário concluir uma tarefa existente, o sistema deve marcá-la como concluída.
- Quando o usuário remover uma tarefa existente, aberta ou concluída, o sistema deve excluí-la.
- Quando uma ação informar identificador inexistente, o sistema deve reportar que a tarefa não foi encontrada.
- Quando uma operação válida for solicitada por HTTP ou CLI, o sistema deve oferecer o mesmo resultado funcional.

## 5. Fora de escopo
- Edição de títulos, prazos, prioridades, categorias ou outros atributos.
- Autenticação, compartilhamento e sincronização entre usuários.

## 6. Questões em aberto
- Nenhuma.
