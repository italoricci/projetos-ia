# Módulo Legacy API MCP

Este módulo usa **MCP (Model Context Protocol)** para expor uma **API legada** (no nosso caso, a API do **Erick Wendel**) no formato que agentes e copilots conseguem consumir com consistência.

Na prática, o objetivo é transformar o legado em uma **“camada de capacidade”**:

- **Tools**: operações executáveis pelo agente (ex.: buscar dados, criar registros, atualizar status, etc.)
- **Resources**: metadados para orientar o modelo (ex.: formatos esperados, semântica de campos, regras de uso)
- (Opcional) **Prompts**: instruções prontas para guiar fluxos de trabalho ponta a ponta

## Por que isso se parece com o que o mercado faz?

Empresas normalmente não “reinventam” sistemas antigos. Em vez disso, criam um **produto/proxy** sobre o backend, padronizando a interface para diferentes consumidores (times diferentes, agentes diferentes, automações diferentes).

O MCP cumpre esse mesmo papel: ele cria um contrato estável e orientado a intenção (tools + recursos), reduzindo retrabalho de integrações e permitindo que o legado seja usado por IA com menos acoplamento.

Assim, a API permanece onde está, mas passa a ser consumida como **capacidade de agente**, com governança e testabilidade do comportamento exposto.

## Observacoes

A API legada (nodejs-fastify-mongodb-crud) e da autoria do Erick Wendel para cadastro de usuario.
