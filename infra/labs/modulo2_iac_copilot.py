import os
import sys
import crewai
import core.agents
import tools.security_scan
import tools.file_writer

# Ensure project root is in the Python path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Instantiate Agents with tools
architect = core.agents.get_architect(tools=[tools.file_writer.write_file])
auditor = core.agents.get_auditor(
    tools=[tools.security_scan.run_checkov_scan, tools.security_scan.validate_opa_policies])

task_gerar = crewai.Task(
    description="Gere um arquivo 'main.tf' para um bucket S3 seguro chamado 'nexus-apollo-data'. Região deve ser us-east-1.",
    expected_output="Arquivo main.tf gerado com sucesso.",
    agent=architect
)

task_auditar = crewai.Task(
    description="Valide o 'main.tf' usando o run_checkov_scan e o validate_opa_policies. Se houver erro, o arquiteto deve corrigir.",
    expected_output="Relatório de conformidade final.",
    agent=auditor
)

nexus_pipeline = crewai.Crew(
    agents=[architect, auditor],
    tasks=[task_gerar, task_auditar],
    process=crewai.Process.sequential,
    verbose=True
)

if __name__ == "__main__":
    print("\n🚀 EXECUTANDO PIPELINE MODULAR (MÓDULO 2)\n")
    nexus_pipeline.kickoff()
