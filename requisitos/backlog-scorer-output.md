### 1. Tabela RICE

_Nota metodológica de Reach:_ A unidade de alcance adotada é a quantidade de veículos monitorados/impactados por mês na frota ativa da Conecta Cargas (base: 140 veículos). Para US05, considerou-se os 140 veículos refletidos no mapa (embora o número de operadores diretos seja ~5). Para US09, utilizou-se a frota total como teto hipotético dada a ausência de especificação da subfrota refrigerada.

| Item                                                  | Reach | Impact | Confidence | Effort (pm) | RICE Score |
| :---------------------------------------------------- | :---: | :----: | :--------: | :---------: | :--------: |
| **US01 — Alertas de Velocidade em Tempo Real**        |  140  |  3.00  |    80%     |     1.0     | **336.00** |
| **US03 — Score de Comportamento do Motorista**        |  140  |  2.00  |    50%     |     2.5     | **56.00**  |
| **US05 — Dashboard Base — Visão Operacional (HiPPO)** |  140  |  0.50  |    50%     |     1.5     | **23.33**  |
| **US04 — Sensor de Abertura de Baú**                  |  140  |  0.50  |    50%     |     2.0     | **17.50**  |
| **US09 — Sensor de Baú — Controle de Temperatura**    |  140  |  0.25  |    50%     |     2.0     |  **8.75**  |
| **US02 — Manutenção Preditiva por Telemetria**        |  140  |  0.50  |    50%     |     4.0     |  **8.75**  |

---

### 2. Tabela WSJF

| Item                                                  | BV  | TC  | RR  | CoD | Job Size |   WSJF   |
| :---------------------------------------------------- | :-: | :-: | :-: | :-: | :------: | :------: |
| **US01 — Alertas de Velocidade em Tempo Real**        | 10  |  9  |  7  | 26  |    3     | **8.67** |
| **US03 — Score de Comportamento do Motorista**        |  7  |  6  |  6  | 19  |    6     | **3.17** |
| **US09 — Sensor de Baú — Controle de Temperatura**    |  4  |  3  |  6  | 13  |    5     | **2.60** |
| **US04 — Sensor de Abertura de Baú**                  |  4  |  2  |  4  | 10  |    5     | **2.00** |
| **US05 — Dashboard Base — Visão Operacional (HiPPO)** |  3  |  3  |  2  |  8  |    4     | **2.00** |
| **US02 — Manutenção Preditiva por Telemetria**        |  3  |  2  |  3  |  8  |    10    | **0.80** |

_Critério de desempate:_ US04 e US05 empataram em WSJF (2.00). O desempate priorizou US04 devido ao maior Cost of Delay (CoD 10 vs. CoD 8).

---

### 3. Ranking Combinado

A combinação de ambos os métodos aponta para a seguinte ordem de execução recomendada para o MVP:

1. **1º lugar — US01: Alertas de Velocidade em Tempo Real** (Líder isolado em RICE e WSJF)
2. **2º lugar — US03: Score de Comportamento do Motorista** (2º em RICE e WSJF)
3. **3º lugar — US09: Sensor de Baú — Controle de Temperatura da Carga** (3º em WSJF; maior CoD de compliance)
4. **4º lugar — US04: Sensor de Abertura de Baú** (Supera US05 no WSJF pelo critério de desempate de CoD)
5. **5º lugar — US05: Dashboard Base — Visão Operacional da Frota (HiPPO)** (Valor operacional frágil, baixo CoD)
6. **6º lugar — US02: Manutenção Preditiva por Telemetria** (Último lugar em WSJF, esforço desproporcional)

---

### 4. Justificativas

#### US01 — Alertas de Velocidade em Tempo Real

- **Impact justificado (3.0 — Massivo):** É a única entrega com correlação direta e causal com o OKR estratégico do trimestre (reduzir sinistros por velocidade de 7 para 5 até setembro de 2026). A notificação em até 60s atua na causa raiz imediata do risco.
- **Confidence justificada (80% — Indicadores razoáveis):** O sistema utiliza infraestrutura de rastreamento já instalada (sem dependência de novo hardware), com parâmetros determinísticos de limite e canais estabelecidos (push/SMS). Não atinge 100% porque a eficácia na redução de sinistros depende do SLA de reação humana do gestor ao receber o SMS.

#### US02 — Manutenção Preditiva por Telemetria

- **Impact justificado (0.5 — Baixo):** Não contribui para o OKR de redução de sinistros por excesso de velocidade. Embora reduza custos mecânicos, a Conecta Cargas não possui meta trimestral formalizada para quebras de motor no contexto atual.
- **Confidence justificada (50% — Intuição / Sem dados históricos):** Sem referência disponível sobre a existência de base histórica de telemetria térmica para treinar modelos com 80% de acurácia. Há bloqueio físico por lead time de hardware (60 dias) e dependência de integração não especificada com oficinas terceiras.

#### US03 — Score de Comportamento do Motorista

- **Impact justificado (2.0 — Significativo):** Atua preventivamente sobre o hábito de condução. A telemetria comportamental (velocidade e aceleração) cria responsabilização do motorista e subsidia reciclagens, alinhando-se ao OKR de segurança viária.
- **Confidence justificada (50% — Intuição técnica):** O cálculo completo está bloqueado pelos 60 dias de lead time dos rastreadores v2 (acelerômetro). Faltam dados sobre viabilidade técnica da integração com o software de RH citado nos critérios. Para subir a confiança, é necessário fatiar o card em um MVP baseado exclusivamente em velocidade.

#### US04 — Sensor de Abertura de Baú

- **Impact justificado (0.5 — Baixo):** Resolve um problema de segurança patrimonial (desvio de carga), mas tem impacto nulo sobre o OKR de sinistros e excesso de velocidade.
- **Confidence justificada (50% — Sem referência de baseline):** Sem referência disponível no contexto sobre o volume atual de perdas/desvios de carga na Conecta Cargas. Além disso, depende totalmente do hardware IoT externo com 60 dias de lead time.

#### US05 — Dashboard Base — Visão Operacional da Frota (HiPPO)

- **Impact justificado (0.5 — Baixo):** Trata-se de funcionalidade passiva de visualização. Ver "carrinhos andando no mapa a cada 30s" não impede ativamente o excesso de velocidade nem reduz sinistros. Demanda classificada como pedido executivo sem tração operacional comprovada.
- **Confidence justificada (50% — Intuição):** A própria nota da história declara: "solicitado verbalmente por Carlos em reunião; sem evidência de uso operacional real. Priya (TI) é a usuária mais provável". Falta discovery com os operadores reais de tráfego para validar valor de uso.

#### US09 — Sensor de Baú — Controle de Temperatura da Carga

- **Impact justificado (0.25 — Mínimo para o OKR):** Impacto zero no OKR de sinistros por velocidade. O valor do item é puramente regulatório e de proteção de carga farmacêutica/perecível (ANVISA), fora do escopo principal de tráfego.
- **Confidence justificada (50% — Sem referência de frota):** Sem referência disponível sobre quantos dos 140 veículos possuem baú refrigerado e operam rotas reguladas por ANVISA. Depende integralmente do hardware de 60 dias de lead time.

---

### 5. Flags ⚠️

⚠️ **US02 — Manutenção Preditiva por Telemetria:** Dependência física de hardware externo com lead time de 60 dias E alta complexidade algorítmica (Machine Learning com exigência de 80% de acurácia em produção, integração com agenda de oficinas parceiras). Esforço de 4.0 pm compromete mais de uma sprint inteira do time de 6 devs (capacidade de ~3 pm/sprint). → **Necessário despriorizar do MVP inicial e refatorar a história:** isolar um MVP simples de manutenção _preventiva_ determinística baseada apenas em hodômetro acumulado antes de tentar modelos preditivos.

⚠️ **US03 — Score de Comportamento do Motorista:** Dependência de hardware v2 (acelerômetro) para capturar frenagem brusca e aceleração (lead time 60 dias), além de integração externa com sistema de RH não detalhada. → **Necessário antes de priorizar:** Fatiar a história formalmente em duas: (1) _US03-A: Score Simplificado por Excesso de Velocidade_ (software puro, destravado imediatamente no MVP e dependente de US01) e (2) _US03-B: Score Inercial Completo + RH_ (agendado para após a instalação dos sensores v2).

⚠️ **US04 e US09 — Sensores de Baú (Abertura e Temperatura):** Bloqueio físico incontornável de 60 dias de lead time de fornecimento de hardware. Desenvolver a camada de software agora gerará código ocioso em ambiente de homologação sem possibilidade de validação ponta a ponta com a frota. → **Necessário:** Adiar o início do desenvolvimento de software para a sprint correspondente a D-30 do recebimento dos lotes de sensores IoT.

⚠️ **US05 — Dashboard Base (HiPPO):** Risco clássico de desperdício de engenharia por viés executivo (_Highest Paid Person's Opinion_). A tela requer esforço moderado (1.5 pm / ~17 SP) para exibir mapas a cada 30 segundos e exportação de PDF, enquanto o usuário real de operação não foi consultado. → **Necessário:** Realizar discovery de 3 dias com operadores de despacho/tráfego e com a Priya (TI) para definir se este dashboard substitui alguma ferramenta legada ou se a telemetria de alertas (US01) já supre a necessidade imediata da central.
