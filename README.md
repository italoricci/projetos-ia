# projetos-ia

Coleção de projetos e experimentos práticos sobre Inteligência Artificial, aprendizado de máquina e aplicações web multimodais.

**Visão geral**

Este repositório reúne materiais, demos e infra‑estruturas usadas em aulas, lives e projetos pessoais relacionados a IA. O objetivo é fornecer exemplos reprodutíveis, notas de estudo e pequenas aplicações que facilitam o aprendizado prático.

**Conteúdo principal**

- **anotacoes/**: material teórico e anotações próprias sobre IA — conceitos, referências, anotações de aulas e resumos (fundamentos de ML, redes neurais, LLMs, RAG, embeddings). Ideal como ponto de consulta rápido.
- **mcp/playwright/**: automação de testes com Playwright integrada ao fluxo MCP (prompts, geração e validação de testes). Contém configuração do Playwright, exemplos de testes e relatórios. Use para validar UIs e fluxos multimodais.
- **tensorflow/**: base para redes neurais — exemplos, scripts e infraestrutura mínima para treinar modelos (ex.: classificadores, demos de aprendizado). Serve como ponto de partida para experimentar com TensorFlow/JS ou Node/TF.
- **web2.0/**: demos web que usam modelos embarcados ou integrações client-side (ex.: `webai`, `webai-multimodal`, `webai2.0`). Projetos práticos para experimentar interfaces que consomem modelos localmente no browser.

**Como começar (rápido)**

- Para listas e notas: abra `anotacoes/anotacoes.md`.
- Para executar os exemplos de Playwright:
  1.  `cd mcp/playwright`
  2.  `npm install`
  3.  `npx playwright test`
- Para os demos web: abra `web2.0/<projeto>/index.html` no navegador ou rode um servidor estático.
- Para experimentar `tensorflow/`: leia o README dentro da pasta e execute os scripts de exemplo (instale dependências via `npm` quando necessário).

**Boas práticas**

- Não faça commit de arquivos de ambiente, chaves ou artefatos de build. Use `.gitignore` para manter o repositório limpo.
- Documente rapidamente novos experimentos (README curto na pasta do projeto) para facilitar reuso.

**Contribuição**

Contribuições são bem‑vindas: abra uma issue ou envie um pull request com mudanças pequenas e explicativas. Prefira PRs com exemplos executáveis e instruções de uso.

**Licença**

Ver [LICENSE.md](LICENSE.md).

---

_Resumo sucinto: notas, testes automatizados com Playwright/MCP, bases com TensorFlow e demos web com modelos embarcados._
