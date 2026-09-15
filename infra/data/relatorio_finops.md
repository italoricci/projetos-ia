# Relatório FinOps de Otimização Cloud

## 1. Objetivo

Identificar recursos órfãos e superdimensionados no inventário da conta `123456789012`, na região `us-east-1`, e estimar a economia mensal e anual potencial.

**Fonte analisada:** `/home/italoricci/Documents/dev/pos/projetos-ia/infra/data/inventario_cloud.json`

## 2. Resumo executivo

O inventário contém:

- **2 recursos zumbis:** um volume EBS disponível e não anexado, além de um Elastic IP sem associação.
- **1 instância superdimensionada:** `i-99887766`, do tipo `m5.4xlarge`, com utilização média de CPU de apenas **2,5%**.

A economia estimada é de:

- **US$ 225,00 por mês**
- **US$ 2.700,00 por ano**

A estimativa considera a liberação integral dos dois recursos zumbis e a redução conservadora da instância de `m5.4xlarge` para `m5.2xlarge`.

## 3. Recursos classificados como zumbis

| Recurso | Tipo | Evidência | Custo mensal | Ação recomendada | Economia mensal | Economia anual |
|---|---|---|---:|---|---:|---:|
| `vol-0a1b2c3d` | EBS Volume, 500 GB | Status `available`; não anexado a nenhuma instância | US$ 50,00 | Confirmar ausência de dependência e necessidade de recuperação; criar snapshot se houver dados relevantes; depois excluir o volume | US$ 50,00 | US$ 600,00 |
| `eipalloc-001122` | Elastic IP | Status `unassociated` | US$ 5,00 | Verificar dependências em balanceadores, NAT, instâncias e regras de segurança; liberar o endereço | US$ 5,00 | US$ 60,00 |
| **Total de cortes zumbis** |  |  | **US$ 55,00** |  | **US$ 55,00** | **US$ 660,00** |

## 4. Direito de dimensionamento — Rightsizing

### Recurso recomendado para alteração

| Campo | Valor atual | Recomendação |
|---|---|---|
| ID da instância | `i-99887766` | Redimensionar |
| Tipo atual | `m5.4xlarge` | 16 vCPUs e 64 GiB de memória |
| Utilização média de CPU | 2,5% | Indicador forte de superdimensionamento |
| Custo mensal atual | US$ 340,00 |  |
| Tipo recomendado | `m5.2xlarge` | 8 vCPUs e 32 GiB de memória |
| Custo mensal estimado | — | US$ 170,00 |
| Economia mensal estimada | — | **US$ 170,00** |
| Economia anual estimada | — | **US$ 2.040,00** |

### Cálculo da economia

A estimativa foi calculada proporcionalmente à redução de capacidade, preservando a proporção de custo informada no inventário:

text
Custo estimado do m5.2xlarge = US$ 340,00 × (8 vCPUs / 16 vCPUs)
                             = US$ 170,00 por mês

Economia da instância = US$ 340,00 - US$ 170,00
                       = US$ 170,00 por mês


Embora memória, pico de CPU, utilização de rede, IOPS e latência de disco não estejam disponíveis no inventário, a redução para `m5.2xlarge` é uma recomendação conservadora em comparação com opções menores. A validação operacional continua sendo obrigatória.

## 5. Economia total estimada

| Categoria | Economia mensal | Economia anual |
|---|---:|---:|
| Volume EBS órfão | US$ 50,00 | US$ 600,00 |
| Elastic IP solto | US$ 5,00 | US$ 60,00 |
| Rightsizing da instância | US$ 170,00 | US$ 2.040,00 |
| **Total estimado** | **US$ 225,00** | **US$ 2.700,00** |

**Fórmula da economia total mensal:**

text
US$ 50,00 + US$ 5,00 + US$ 170,00 = US$ 225,00 por mês


## 6. Plano de ação recomendado

### Prioridade alta

1. **Elastic IP `eipalloc-001122`**
   - Confirmar que não está associada a um balanceador de carga, instância EC2, gateway NAT ou outro recurso ativo.
   - Liberar o Elastic IP.
   - Economia estimada: **US$ 5,00/mês**.

2. **Volume `vol-0a1b2c3d`**
   - Consultar o proprietário da aplicação e verificar logs, inventário de dependências e políticas de retenção.
   - Criar snapshot se existir qualquer possibilidade de necessidade futura dos dados.
   - Aguardar o período definido pela política de retenção e somente então excluir o volume.
   - Economia estimada: **US$ 50,00/mês**.

3. **Instância `i-99887766`**
   - Migrar de `m5.4xlarge` para `m5.2xlarge`, preferencialmente por meio de imagem, Auto Scaling Group ou estratégia blue/green para reduzir risco de indisponibilidade.
   - Monitorar durante 7 a 14 dias: CPU, memória, rede, disco, erros da aplicação, latência e filas.
   - Reverter para `m5.4xlarge` se houver saturação sustentada ou impacto operacional.
   - Economia estimada: **US$ 170,00/mês**.

### Prioridade de acompanhamento

- Criar alertas para volumes não anexados por mais de 7 ou 14 dias.
- Criar alertas para Elastic IPs sem associação.
- Executar revisão mensal de utilização de EC2 com métricas de pico e percentis, não apenas média.
- Aplicar tags de proprietário, ambiente e política de descarte para tornar a governança financeira auditável.

## 7. Premissas e limitações

- Os custos mensais foram considerados fixos conforme registrados no inventário.
- O custo estimado do `m5.2xlarge` foi obtido pela proporção direta de vCPUs em relação ao `m5.4xlarge`.
- O relatório não considera desconto por compromisso, créditos, impostos ou variações de preço regionais.
- A utilização média de CPU não revela picos; por isso, o rightsizing deve ser validado antes de uma remoção definitiva da capacidade.
- A economia anual é uma projeção de 12 meses e só será realizada integralmente após a execução e confirmação das alterações.

## 8. Conclusão

A eliminação dos dois recursos órfãos e o rightsizing conservador da instância `i-99887766` permitem reduzir o custo mensal estimado de **US$ 340,00 para US$ 170,00**, gerando economia total estimada de **US$ 225,00 por mês**, equivalente a **US$ 2.700,00 ao ano**. A execução deve começar pelos recursos zumbis e continuar com o rightsizing acompanhado de monitoramento para proteger a disponibilidade da carga de trabalho.