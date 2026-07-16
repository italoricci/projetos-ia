# Backlog priorizado (extraído dos feedbacks sanitizados)

> Fonte: `gerados/sanitized-data.json`

- **TKT-101 (BUG_CRITICO | ALTA)** — _Tela branca ao fazer Pix e app reinicia_  
  **Ação:** Investigar crash ao iniciar fluxo Pix; adicionar testes de regressão e logs com correlação por sessão.

- **TKT-102 (UX_UI_IMPROVEMENT | ALTA)** — _Fluxo de agendamento quebra ao escolher dia inexistente (dia 31 em mês curto)_  
  **Ação:** Validar calendário no front e no backend; bloquear seleção de datas inválidas e cobrir com testes de datas (ex: meses com 30/28).

- **TKT-103 (UX_UI_IMPROVEMENT | ALTA)** — _Comprovante de transferência/“trocas” difícil de achar_  
  **Ação:** Melhorar localização do comprovante no fluxo pós-Pix (reduzir cliques); otimizar navegação e fallback quando estiver indisponível.

- **TKT-104 (BUG_CRITICO | ALTA)** — _TED: valor some / não cai na conta destino_  
  **Ação:** Verificar idempotência e estados do backend para transferência; revisar reconciliação e mensagens de status no front.

- **TKT-105 (BUG_CRITICO | ALTA)** — _Erro 500 ao consultar extrato; stacktrace visível_  
  **Ação:** Corrigir endpoint de extrato e sanitizar erros; garantir tratamento de falhas e logging seguro.

- **TKT-106 (UX_UI_IMPROVEMENT | ALTA)** — _Cartão bloqueia “sem motivo”_  
  **Ação:** Melhorar comunicação e rastreio de bloqueios (motivo/etapa); validar fluxos de consentimento e exibir orientação para desbloqueio.

- **TKT-107 (UX_UI_IMPROVEMENT | MEDIA)** — _Atraso no atendimento (chat) / experiência de suporte ruim_  
  **Ação:** Ajustar filas/SLAs e mensagens de progresso; adicionar estimativa de tempo e canal alternativo.

- **TKT-108 (UX_UI_IMPROVEMENT | ALTA)** — _Redefinição de senha com link expira imediatamente_  
  **Ação:** Revisar TTL de links e validação; adicionar reenvio com cooldown e feedback claro do motivo.

- **TKT-109 (BUG_CRITICO | ALTA)** — _App fecha sozinho ao entrar em investimentos (iPhone/Android)_  
  **Ação:** Reproduzir crash no módulo de investimentos; usar crash reporting e travar versões/feature flags até correção.

- **TKT-110 (NEW_FEATURE | MEDIA)** — _Estorno de transferência após usar chave errada_  
  **Ação:** Avaliar capacidade de reversão; se suportado, criar fluxo de solicitação de estorno; caso contrário, informar limitações com próximos passos.

- **TKT-111 (BUG_CRITICO | ALTA)** — _Saldo negativo “do nada”_  
  **Ação:** Investigar origem da movimentação e conciliação; melhorar visibilidade do extrato/estornos e explicar variações.

- **TKT-112 (BUG_CRITICO | ALTA)** — _Bug em seleção de 29/02 em ano não bissexto trava app_  
  **Ação:** Validar data no datepicker e backend; corrigir parsing/cálculo de calendário e adicionar testes de borda.

- **TKT-113 (UX_UI_IMPROVEMENT | MEDIA)** — _Encerramento de conta: solicitar/confirmar (indicador de fricção)_  
  **Ação:** Garantir fluxo claro de cancelamento/encerramento com autenticação e checklist de passos.

- **TKT-114 (UX_UI_IMPROVEMENT | ALTA)** — _Comprovante do Pix não aparece (fica carregando)_  
  **Ação:** Implementar retry/caching; tratar estados “sem comprovante” e orientar acesso alternativo ao comprovante.

- **TKT-115 (BUG_CRITICO | ALTA)** — _Sessão expira instantaneamente após login_  
  **Ação:** Revisar expiração/refresh tokens e sincronização; adicionar fallback de re-login e logs de autenticação.
