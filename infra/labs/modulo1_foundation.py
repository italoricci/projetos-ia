import crewai

import core.agents
import core.agents
import tools.policy_rag
import tools.policy_rag

# Instantiate the Cloud Architect agent with the compliance checking tool
architect = core.agents.get_architect(tools=[tools.policy_rag.check_compliance_rules])

task_design_s3 = crewai.Task(
    description="Desenhe um bucket S3 para logs seguindo as normas da empresa Nexus.",
    expected_output="Plano detalhado com nome do bucket e região de compliance.",
    agent=architect
)

if __name__ == "__main__":
    print("\n🚀 INICIANDO MÓDULO 1: FOUNDATION\n")
    crew = crewai.Crew(agents=[architect], tasks=[task_design_s3])
    crew.kickoff()
