# Guia Rápido: Conceitos de IA

## Inteligência Artificial (IA)

Simulação de processos de inteligência humana por máquinas, especialmente computadores. Envolve aprendizado, raciocínio, percepção e processamento de linguagem natural. Tipos:

- **IA Fraca (Narrow AI)**: Focada em tarefas específicas (ex: Siri, recomendadores).
- **IA Forte (General AI)**: IA humana-like, capaz de qualquer tarefa intelectual (ainda teórica).
- **IA Superinteligente**: Supera humanos em todas as áreas (hipotética).

## Machine Learning (ML)

Subcampo da IA onde sistemas aprendem padrões de dados **sem programação explícita**. Usa algoritmos para melhorar performance com experiência.

- **Aprendizado Supervisionado**: Dados rotulados (ex: classificação de imagens).
- **Não-Supervisionado**: Dados não rotulados (ex: clustering).
- **Reforço**: Aprende por recompensas/punições (ex: jogos).

## Deep Learning (DL)

Subcampo do ML usando **redes neurais profundas** (múltiplas camadas). Excelente para dados não-estruturados como imagens, áudio, texto.

- Vantagens: Feature engineering automático.
- Ex: CNNs (visão), RNNs/LSTMs (sequências), Transformers (NLP como GPT).

## Redes Neurais Artificiais (RNAs)

Modelo computacional inspirado no cérebro humano. Composto por:

- **Camadas**: Entrada → Ocultas → Saída.
- **Conexões**: Pesos ajustáveis.
- **Treinamento**: Backpropagation + Gradiente Descendente para minimizar erro (loss function).

### Neurônios Artificiais

Unidade básica:

```
Entrada → ∑(peso * entrada + bias) → Função Ativação → Saída
```

- **Peso (w)**: Força da conexão.
- **Bias (b)**: Ajuste de threshold.
- **Funções de Ativação**:
  | Função | Descrição |
  |--------|-----------|
  | ReLU | max(0, x) - Rápida, evita vanishing gradient. |
  | Sigmoid| 0 a 1 - Probabilidades (logística). |
  | Tanh | -1 a 1 - Centrado em 0. |
  | Softmax| Distribuição de probabilidade multiclasse. |

## Fluxo Rápido de Treinamento

1. **Forward Pass**: Dados → Predição.
2. **Loss**: Erro (ex: MSE, Cross-Entropy).
3. **Backward Pass**: Gradientes atualizam pesos.
4. Repetir épocas até convergência.

**Dica para Lembrar**: IA (guarda-chuva) > ML (aprende de dados) > DL (redes profundas). Neurônio = soma ponderada + ativação. Use para revisão rápida!

## Reinforcement Learning

1. Aprendizado por reforço: o algoritmo aprende tomar decisões por tentativa e erro e ganha por reconhecimento;
2. Desafios nesse modelo: balancear nesse algoritmo quando ele deve tentar coisas novas, movimentações diferentes ou repetição no que já funciona;

## Algoritmos Genéticos

1. Diferente do aprendizado por reforço (busca por recompensa) fazer busca por população de solução candidatas, avaliação por seleção/por mutação.
2. A cada geração é feito cruzamentos de dados, mutação para tentar produzir individuos segundo sua aptidão.

## Como funcionam as LLM's?

1. LLM - Large Language Model: é um modelo treinado com grande quantidade de texto, para entender e gerar linguagem humana;
2. Chatgpt, Gemini e etc: são chatbots de llm.
3. Conceitos de GPT (Generative Pre Trained Transformer)

- Generative (gerador): gera texto token por token
- Pre Trained: antes de virar assistente ele é treinando com uma quantidade enorme para aprender padrões gerais de linguagem
- Transformer: é arquitetura usada por dentro, famosa por conseguir "prestar atenção" em partes importantes do texto - attention

4. Como a LLM pensa?

- Tokenização: pedaços de palavras, isso porque o modelo não trabalha diretamente com palavras como humanos, mas como unidades númericas; Tokens (são unidades menores que palavras, são normalmente limitadores);
- Embeddings: representam palavras como vetores (númericos), e a posição desses vetores é moldada pelo contexto semântico: palavras que aparecem em contexto parecidos, ficam próximas;
- Transformer (processo o contexto): analise o token do contexto e calcula as partes mais importante para prever o proximo token. (Arquitetura de rede neural) feita para processar sequenciais de texto, usando um mecanismo de attention, para determinar quais partes do texto sao mais importantes. É o cerebro da LLM. Paralelo (multi-head attention) -> define pesos e comparações. De forma geral: pega os vetores (embeddings) e criam versões contextualizadas deles

```json
Texto -> Tokens -> Vetores (embeddings) -> Transformer (attention, combina o embeddings com algo representa a posição - contextualização) -> Sampling
```

- AI Multimodal

1. Pode receber vários formatos (texto, audio, imagem);

### Engenharia de Prompt

1. Você necessariamente precisa refinar o que você quer: detalhar ao máximo;
2. Template de um prompt modelo (vídeo da antropic):

- Contexto da tarefa: qual papel a IA deve assumir: Ex: Você é um programador
- Contexto de tom: Postura da linguagem da resposta (profissional, acessível)
- Dados de antecedentes, documentos e imagens (git, contexto do sistema)
- Instrução passo a passo (contrato operacional, senão sabe pedir para repetir)
- Uso de exemplos (padrão de código, template, entrada e saída, o que evitar)
- Delimitadores Estruturais
- Formatação de saída

```text

Aja como um Desenvolvedor Front-end Sênior especialista em JavaScript vanilla e APIs experimentais de navegadores. Sua tarefa é criar um arquivo  index.html  de página única que funcione como uma interface de chatbot interativa. O grande diferencial é que este chat não fará requisições para a internet; ele deve se integrar com a nova API nativa de inteligência artificial do Google Chrome (modelo Gemini Nano / Built-in AI) para rodar 100% offline no dispositivo do cliente.
Adote um tom técnico, didático e seguro. Como essa é uma tecnologia muito nova e experimental, sua resposta deve ser encorajadora e focar na construção de um código resiliente, que explique visualmente ao usuário final caso algo dê errado.
<documentos_de_fundo>
	•	A integração utiliza as APIs experimentais do Chrome (como  window.ai  ou  window.ai.assistant ).
	•	Como a tecnologia é nova, é fundamental que o sistema verifique a disponibilidade da API antes de tentar inicializar a sessão do modelo.
	•	O código deve ser contido inteiramente em um único arquivo (HTML, CSS e JS juntos) para facilitar o teste local do cliente.</documentos_de_fundo>
<instrucoes_passo_a_passo>
	1.	Pense silenciosamente sobre a arquitetura da interface: você precisará de um contêiner para as mensagens, um campo de texto e um botão de envio.
	2.	Crie o HTML semântico e adicione um CSS embutido moderno, limpo e responsivo (estilo dark mode é preferível).
	3.	Escreva o JavaScript criando uma função para verificar se a API de IA do Chrome está disponível ( window.ai ).
	4.	Desenvolva a lógica de envio de mensagem: capture o texto do usuário, exiba na tela, chame a API do modelo de forma assíncrona, aguarde a resposta e exiba o balão de resposta da IA.
	5.	Implemente tratamentos de erro caso a API não seja suportada pelo navegador atual (exibindo um aviso amigável na tela do chat).</instrucoes_passo_a_passo>
<exemplo_de_comportamento>
	•	O usuário abre o  index.html . O sistema verifica  if (!window.ai) .
	•	Se falhar: O chat exibe a mensagem “Sistema: O modelo de IA nativo não está ativado ou suportado neste navegador.”
	•	Se sucesso: O chat permite digitar. O usuário digita “Qual é a capital do Brasil?”.
	•	O chat exibe “Você: Qual é a capital do Brasil?” e chama  await session.prompt("Qual é a capital do Brasil?") .
	•	O chat recebe a resposta e exibe “IA: A capital do Brasil é Brasília.”</exemplo_de_comportamento>
<formato_de_saida>Primeiro, coloque a sua explicação e raciocínio sobre a implementação dentro da tag .Em seguida, forneça o código completo e consolidado exclusivamente dentro de um bloco de código Markdown padrão, envolto pela tag <codigo_final>. Não divida o código em múltiplos blocos.</formato_de_saida>

tokens aproximados: 821

```

3. JSON Prompt: economiza prompt no final (previsibilidade e automação);

- meta: nome/versao do prompt, idioma e objetivo;
- role: papel
- context: dados que o modelo precisa saber
- task: o que exatamente fazer
- constraint: limites e regras
- output: formato de saida

Json PROMPT

```json
{
  "meta": {
    "name": "Chatbot-Offline-Generator",
    "version": "1.0",
    "language": "pt-BR",
    "objective": "Gerar código front-end funcional de um chatbot local integrado com a API nativa do Google Chrome."
  },
  "role": {
    "title": "Desenvolvedor Front-end Sênior",
    "expertise": [
      "JavaScript Vanilla",
      "APIs experimentais de navegadores",
      "UX para Inteligência Artificial",
      "Resiliência e Feature Detection"
    ],
    "tone": "Técnico, seguro e encorajador"
  },
  "context": {
    "technology": "API LanguageModel (Gemini Nano) nativa do Google Chrome.",
    "architecture": "Single Page Application (SPA) em um único arquivo (index.html).",
    "environment": "Execução 100% offline, processada localmente pela CPU/GPU do usuário.",
    "ui_state_colors": {
      "init_or_error": "Vermelho (para checagem e falhas)",
      "downloading": "Amarelo (para alertar sobre download em segundo plano)",
      "ready": "Verde (para indicar que o modelo está conectado e pronto)"
    }
  },
  "task": {
    "description": "Criar um arquivo index.html completo e funcional que integre uma interface de chat semântica com a API LanguageModel do Chrome.",
    "steps": [
      "Criar o HTML semântico com input e container de mensagens.",
      "Criar CSS embutido em Dark Mode com responsividade e animações.",
      "Implementar função `getAIModelAPI()` para resolver `LanguageModel`",
      "Escrever lógica de inicialização verificando a disponibilidade (`readily`, `after-download` ou `no`).",
      "Mapear as cores de feedback do sistema para a UI conforme o contexto.",
      "Implementar envio de mensagens, gerenciando estado de input (disabled) enquanto a Promise assíncrona do modelo processa."
    ]
  },
  "constraint": {
    "code_rules": [
      "Todo o código (HTML, CSS, JS) deve estar no mesmo arquivo index.html.",
      "Não fazer nenhuma requisição HTTP/fetch para APIs externas da internet.",
      "A interface nunca deve quebrar silenciosamente; se a API falhar ou não existir, bloquear o input e mostrar na tela."
      "Não use window, para nada."
    ],
    "formatting_rules": [
      "Não dividir o código em múltiplos blocos na resposta.",
      "Não incluir marcações markdown fora do escopo da saída."
    ]
  },
  "output": {
    "format": "XML-Wrapped Markdown",
    "structure": {
      "raciocinio": "<raciocinio>Explicação técnica das decisões tomadas na arquitetura e tratamento de erros.</raciocinio>",
      "codigo": "<codigo_final>O bloco markdown único contendo o arquivo HTML completo.</codigo_final>"
    }
  }
}

tokens aproximados: 799

```

4. Padrão TOON (Token Oriented Object Notation): formato de serialização, pensado para representar o mesmo modelo mental do json, mas sem levar em consideração: aspas, colchetes, virgulas (que gastam muitos tokens) - visa resolver custos

```json

[
  {"id": 1, "nome": "Ana", "cargo": "Dev"},
  {"id": 2, "nome": "Carlos", "cargo": "Design"}
]

pra llm:

[2] {id, nome, cargo}
1, Ana, Dev
2, Carlos, Design

```

_Observação_: um JSON bem estruturado, sem repetição gera menos custo que um TOON, pensa muito bem antes de escolher

## Ambiente de Execução de IA

1. VSCode: base de tudo, ecossistema (há possibilidade de criar agents customizáveis - subprompts)

- 3 Agentes nativos:
  - Ask: perguntas rápidas, tirar dúvidas, explicar o código
  - Edit: mudanças controladas, seguir guias
  - Plan: reduzir caos em tarefas grandes, cria um plano e necessita de aprovação
  - Agent: modo autonomo, ele que executa

2. Cursor: fork do VSCode, AI first
3. Windsurf: fork do VSCode, AI first, concorrente do Cursor, concorrente do CODIUM, do copilot.

## Spec Driven Development

1. Define uma especificação clara com critérios de aceite;
2. Pra dev:

- contexto: onde isso roda, stack, constraint
- requisitos: o que deve existir;
- não requisitos: o que não faz parte;
- critérios de aceite: como validar que terminou
- contrato: shape de APi, formatos de resposta
- plano de teste: como validar;

## MCP

1. Model Context Protocol, lançado pela Anthropic
2. Objetivo: integrar assistentes de IA com fontes de dados externas (API, arquivos, banco de dados ou qualquer fontes de dados ou serviço);
3. Analogo a uma USB-C para app de IA, um padrão para plugar periféricos;
4. Um servidor MCP expoe 3 pontos importantes:

- Tools: ações que uma IA pode executar: ex: criar arquivo, executar consulta SQL;
- Resources: dados usados como contexto, como conteudo de arquivos, logs e etc;
- Prompts: templates e estruturas que ajudam a IA a formular comandos adequados para usar essas ferramentas;

## Preocupações

1. É fácil cair na ilusão que a LLM sabe tudo, entretanto os modelos não aprendem em tempo real;
2. Ele é treinado até um certa data, e o mundo continua mudando: API's, Contratos, Bibliotecas mudam;
3. Maior motivo de bug em vibecoding;

## Context7

1. Servidor mcp, focado em trazer as documentação atual e versionado direto da fonte;
2. Injeção automática no prompt;
3. Context7 indexa todas documentação;
4. Prompts imensos = mais token = mais custo;

## OpenWeights (OpenSource)

1. Baixar o peso dos modelos e rodar onde quiser;
2. Nem sempre tem acesso a base de treino ou a sua pipeline;
3. https://ollama.com/ (so funciona no macos 14+)
4. Sem custos por token, mas custos embutidos: cpu, energia, escalonamento, refrigeração, manutenção, engenheria de distruibuição e etc.
5. Não é porque é open que pode se utilizar como quiser;
6. Modelos tem normalmente censura (llama da meta, tem restrição por tamanho de organização e etc);
7. Modelos sem censura só em interessante para uso pessoal, na sua máquina. Pois podem trazer questões legais pros seus clientes;
8. Ollama não é recomendável para produção;
9. Nomenclatura:

- gpt-oss:20b-cloud - 20b significa 20 bilhões de parametros (peso do modelo o que ele realmente aprendeu, quanto maior mais inteligente o modelo/capacidade ou qualidade - pensar: quantidade de neurônios ou conexões esse modelo tem) - MOE (mixture-of-experts), mistura de especialistas, isso quer dizer que: eles não ativam todos os parametros em cada token.
- 128k - tamanho de contexto - memória a curto prazo, quantidade de token por contexto (entre prompt, respostas e etc)

10. Termo bastante utilizado "quantização": reduzir o tamanho do modelo, trocando a forma como os pesos são representados (reduzir de 16 bits - 8 bits);

## OpenRouter (Orquestrador de LLM) - Recomendação

1. É uma API unificada para acessar centenas de modelos de vários provedores por um unico endpoint;
2. Com compatbilidade da OpenAI;
3. Fallback automático (se o modelo falhar ele tenta outro modelo);
4. Roteamento por custo, latencia e etc;
5. NLP - Natural Language Process (Processamento de linguagem natural);

## RAG (Retrieval Augmented Generation)

1. É padrão de arquitetura onde antes da LLM responder o sistema busca informações externas relevantes;
2. Ex: banco de dados, pdf, wiki, código;
3. Injeta esses códigos no contexto;
4. Combinação de memórias

- paramétrica: o que o modelo já "sabe" nos parâmetros
- não-paramétrica: um índice externo pesquisável, tipicamente um índice vetorial

5. RAG serve para a LLM responder com dados atualizados e privado;
6. Assim há redução de alucinações;

## Fine-Tunning

1. Pega um modelo já treinado e faz um treinamento adicional nele;
2. Usar exemplo do dominio para ajustar os pesos do modelo;
3. Pegar um modelo de identificação de imagens e treina ele para refinar mais a classificação da imagem;

- Pega um modelo que identifica uma imagem como pipa e re-treina ele para identificar como pato;

## Busca por similaridade

1. Transformar cada pedaço em um vetor (embedding);
2. Texto com significado parecido viram vetores próximos;
3. Pergunta ao banco vetorial (ex: neo4j) ele te devolve o topK (filtro aplicado para escolhe de tokens) trechos mais próximos;