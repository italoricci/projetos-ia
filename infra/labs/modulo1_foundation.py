import os
import sys
import crewai
import core.agents
import tools.policy_rag


# Ensure project root is in the Python path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

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
