import crewai

import core.agents
import tools.k8s_ops

# 1. Configurar Agentes
# O Arquiteto gera o YAML e o SRE "aplica" e analisa o sucesso
architect = core.agents.get_architect(tools=[tools.k8s_ops.generate_k8s_manifest])
sre = core.agents.get_sre_agent(tools=[tools.k8s_ops.apply_k8s_manifest, tools.k8s_ops.analyze_canary_metrics])

# 2. Definir Tarefas do Fluxo GitOps
task_design = crewai.Task(
    description="Desenhe o manifesto K8s para o app 'nexus-api' com 2 réplicas na porta 80. Use a imagem 'nginx:latest' e inclua readinessProbe.",
    expected_output="Arquivo YAML criado no disco com sintaxe Kubernetes V1 estrita.",
    agent=architect
)

task_sync = crewai.Task(
    description="Realize a reconciliação (Sync) do manifesto 'nexus-api-k8s.yaml' no cluster usando o apply_k8s_manifest.",
    expected_output="Confirmação de que o estado desejado foi enviado ao cluster.",
    agent=sre
)

task_monitor = crewai.Task(
    description="Após o deploy, analise estas métricas: 'error_rate: 1%, latency: 80ms'. Decida o sucesso do rollout.",
    expected_output="Decisão final sobre o estado do deploy (Healthy/Unhealthy).",
    agent=sre
)

# 3. Orquestração
nexus_k8s_pipeline = crewai.Crew(
    agents=[architect, sre],
    tasks=[task_design, task_sync, task_monitor],
    process=crewai.Process.sequential,
    verbose=True
)

if __name__ == "__main__":
    print("\n🚀 INICIANDO MÓDULO 3: K8S AI-OPS & GITOPS FLOW\n")
    nexus_k8s_pipeline.kickoff()