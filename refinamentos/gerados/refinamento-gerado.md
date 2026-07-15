## Análise de risco

O requisito descreve apenas o fluxo feliz e deixa de fora validações operacionais, feedbacks de erro e regras de exceção que impactam diretamente a experiência e a implementação da interface.

Pontos cegos principais:

- Não está definido o que acontece se o contato escolhido não tiver chave Pix válida, estiver inativo ou tiver dados incompletos.
- Não está definido se o limite diário de R\$ 5.000,00 considera apenas um agendamento por vez ou a soma dos agendamentos já existentes para a mesma data.
- Não está claro se a data permitida inclui amanhã apenas, dias úteis apenas, fins de semana e feriados, ou qualquer data futura.
- O requisito não informa o comportamento quando o agendamento falha após a confirmação, por instabilidade, timeout ou rejeição do backend.
- “Tem que ter um botão para cancelar o agendamento depois” não especifica onde esse agendamento será listado, em que status ele pode ser cancelado e até quando o cancelamento é permitido.

## Mapeamento de estados

A interface precisará de mais estados do que apenas formulário, confirmação e comprovante.

Estados de UI necessários:

- Loading inicial da tela de agendamento, enquanto carrega contatos e regras do produto.
- Empty state de contatos, caso o usuário não tenha destinatários salvos ou elegíveis para Pix agendado.
- Estado de seleção de contato, com erro para contato inválido ou indisponível.
- Estado de preenchimento do valor, com validação para campo vazio, valor zero, valor negativo, formato inválido e valor acima do limite.
- Estado de seleção de data, com erro para data de hoje, data passada, data inválida e data fora da janela permitida, caso exista.
- Loading ao confirmar o agendamento, com bloqueio de duplo clique para evitar envio duplicado.
- Estado de sucesso, exibindo comprovante com dados do agendamento criado.
- Estado de erro transacional, caso a criação do agendamento falhe no backend.
- Estado de listagem de agendamentos, necessário para suportar o cancelamento posterior citado no briefing.
- Empty state da listagem de agendamentos, caso o usuário não tenha nenhum Pix agendado.
- Loading no cancelamento do agendamento.
- Estado de sucesso no cancelamento.
- Estado de erro no cancelamento, inclusive quando o agendamento já tiver sido processado ou cancelado por outro canal.

## Cenários ocultos

Há vários cenários de uso que o PO não mencionou e que precisam ser tratados explicitamente no Front-End.[^2]

Cenários relevantes:

- Usuário tenta agendar para hoje; a regra diz que isso deve virar Pix normal, mas o requisito não define se a UI redireciona automaticamente, bloqueia a ação ou exibe sugestão de troca de fluxo.
- Usuário agenda exatamente R\$ 5.000,00; é necessário confirmar se o limite é inclusivo.
- Usuário já possui outros agendamentos para a mesma data e o novo valor ultrapassa o teto diário agregado.
- Usuário edita campos após erro de backend; deve haver reenvio simples sem perder dados preenchidos.
- Usuário sai da tela no meio do preenchimento; é preciso decidir se os dados digitados serão descartados ou preservados temporariamente.
- Usuário cancela um agendamento no mesmo instante em que ele entra em processamento; a UI precisa tratar conflito de status.
- Usuário abre diretamente um comprovante ou tela de cancelamento sem contexto prévio; a aplicação deve validar sessão e existência do agendamento.
- Backend retorna sucesso parcial ou dados incompletos para o comprovante; a interface precisa prever fallback de exibição.

## Regras conflitantes

A principal ambiguidade está na regra “não pode agendar para o mesmo dia (se for hoje, é Pix normal)”, porque isso mistura bloqueio com redirecionamento de fluxo sem dizer qual comportamento o produto espera.

Conflitos e inseguranças:

- A regra do mesmo dia conflita com o escopo da tela de agendamento: ou essa tela deve impedir hoje, ou deve encaminhar o usuário para outro fluxo; deixar isso implícito gera comportamento inconsistente.
- O limite diário está solto e pode ser interpretado de forma insegura se a validação existir apenas no Front-End; a regra precisa ser obrigatoriamente validada no backend também.
- O cancelamento posterior não define restrições de negócio, como prazo limite, status cancelável e necessidade de autenticação reforçada. Sem isso, há risco funcional e de segurança.

## Recomendações para o dev

Para transformar isso em implementação acionável, o ideal é quebrar o ticket em subfluxos e alinhar regras faltantes com o PO antes de codar.

Sugestões objetivas:

- Separar em 4 etapas: seleção de contato, valor e data, confirmação, comprovante.
- Criar contrato explícito de erros para criação e cancelamento de agendamento.
- Confirmar com o PO estas decisões: limite por transação ou por soma diária, comportamento ao escolher hoje, datas permitidas, origem da lista de contatos, e regras exatas de cancelamento.
- Incluir na especificação os status do agendamento, por exemplo: agendado, processando, concluído, cancelado, falho.
