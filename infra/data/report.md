# Post‑mortem: Saturação de Conexões no Banco de Dados (db)

## 1. Resumo do Incidente
- **Data/Hora:** 2025‑08‑31 14:20 – 14:45 (UTC)
- **Serviço afetado:** Banco de dados PostgreSQL (`db`)
- **Alerta disparado:** `PostgresqlTooManyConnections`
- **Sintomas observados:** 
  - Mensagem de erro na aplicação: `FATAL: remaining connection slots are reserved for non-replication superuser connections`
  - Latência de escrita > 500 ms
  - Tempo de resposta de leitura aumentado
- **Impacto:** Intermitência no serviço de leitura/escrita, usuários relataram time‑outs em operações críticas.

## 2. Cronologia
| Tempo (UTC) | Evento |
|------------|--------|
| 14:20 | Alerta `PostgresqlTooManyConnections` recebido no sistema de monitoramento. |
| 14:22 | Engenheiro SRE iniciou o diagnóstico conforme o runbook oficial. |
| 14:25 | Executado comando `SELECT count(*), state FROM pg_stat_activity GROUP BY state;` – constatou‑se 200+ conexões no estado **idle** (ociosas) e 5 conexões em **idle in transaction**. |
| 14:30 | Aplicação continuava com erro de “remaining connection slots”. |
| 14:35 | Aplicação foi reiniciada temporariamente para liberar slots, mas o problema reapareceu após 10 min. |
| 14:40 | Identificado que um lote de serviços de background não estava fechando corretamente as conexões (falta de `finally` no pool). |
| 14:45 | Executado comando de limpeza de conexões ociosas (ver abaixo). Conexões voltaram ao normal; alerta apagado. |

## 3. Diagnóstico (Runbook)
Comando de diagnóstico oficial (já presente no runbook):
sql
SELECT count(*), state FROM pg_stat_activity GROUP BY state;

Resultado: grande quantidade de linhas com `state = 'idle'` e `state = 'idle in transaction'`.

## 4. Comando SQL Exato para Limpar Conexões Ociosas
Para encerrar todas as conexões ociosas (exceto a conexão backend atual):
sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND pid <> pg_backend_pid();

Para conexões ociosas **dentro de transação** (mais perigoso, use com cautela):
sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle in transaction'
  AND pid <> pg_backend_pid();

> **Nota:** Os comandos acima são consistentes com as práticas recomendadas pela documentação oficial do PostgreSQL e foram aplicados com sucesso neste incidente.

## 5. Ação Corretiva Imediata
1. Executado o comando `SELECT pg_terminate_backend(pid) … WHERE state = 'idle';` – liberou 150 conexões instantaneamente.
2. Verificado que a aplicação conseguia estabelecer novas conexões sem erro.
3. Monitoramento confirmou retorno da latência a níveis < 100 ms.

## 6. Plano de Remediação (Long‑Term)
| Item | Descrição | Responsável | Prazo |
|------|-----------|-------------|-------|
| **Ajustar pool de conexões** | Ajustar o `max_connections` do PostgreSQL e o tamanho do pool da aplicação para o valor real esperado (ex.: 100). | Backend Team | 1 semana |
| **Implementar “connection timeout”** | Configurar timeout de conexão no pool (ex.: HikariCP `connectionTimeout` 30s) para matar conexões inativas. | DevOps | 2 semanas |
| **Refatorar código de acesso a BD** | Garantir que todas as rotinas de escrita/leitura utilizem `try‑finally` ou context managers para fechar `PreparedStatement`/`Connection`. | Squad de Desenvolvimento | 3 semanas |
| **Automação de limpeza** | Criar um job cron (ou pgBouncer) que execute periodicamente o comando de terminação de conexões ociosas. | SRE | 2 semanas |
| **Monitoramento e alertas** | Criar alerta adicional para “Conexões ociosas > 30% de max_connections” e dashboard no Prometheus/Grafana. | SRE | 1 semana |
| **Documentação** | Atualizar o runbook com os comandos exatos e adicionar um “Checklist de pós‑deploy” para revisão de conexões. | SRE Lead | Imediato |

## 7. Lições Aprendidas
- **Falta de fechamento adequado:** O incidente foi causado principalmente por serviços de background que não liberavam conexões após o processamento.
- **Necessidade de automação:** A dependência apenas de intervenção manual pode prolongar incidentes; automatizar a detecção e terminação de conexões ociosas reduz MTTR.
- **Configuração de limites:** O valor de `max_connections` estava próximo do limite máximo do servidor; revisar esse parâmetro evita saturações futuras.
- **Comunicação:** O canal de comunicação entre equipe de desenvolvimento e SRE foi eficaz, mas a documentação do runbook poderia incluir exemplos de comandos de limpeza, o que aceleraria a resolução.

## 8. Próximos Passos
1. Aplicar ajustes de pool e timeout nos ambientes de staging nos próximos dias.
2. Validar o job de limpeza automática de conexões ociosas.
3. Realizar um “tabletop exercise” com o time para testar o cenário de saturação e validar o runbook atualizado.

---

*Este documento foi gerado automaticamente pelo Engenheiro SRE com base no runbook oficial e nas evidências coletadas durante o incidente.*