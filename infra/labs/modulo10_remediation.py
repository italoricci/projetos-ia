import os
from pathlib import Path

from crewai import Task, Crew
from crewai.tools import tool

from core.agents import get_sre_knowledge_agent
from tools.file_writer import write_file

PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
runbook_path = os.path.join(PROJECT_ROOT, "data", "runbook.md")


@tool('read_runbook')
def read_runbook():
    """Read a runbook file."""
    with open(runbook_path, 'r', encoding='utf-8') as file:
        return file.read()


agent = get_sre_knowledge_agent(tools=[read_runbook, write_file])

task_remediate_incident = Task(
    description="""
    Recebemos um alerta de 'Saturação de Conexões' no banco de dados (db). 
    1. Consulte o runbook oficial para o serviço 'db'.
    2. Identifique o comando SQL exato para limpar conexões ociosas.
    3. Escreva um rascunho de 'Post-mortem' resumindo o incidente e a solução aplicada.""",
    agent=agent,
    expected_output="Plano de remediação baseado no runbook e rascunho de Post-mortem."
                    f"Grave em formato markdown dentro da pasta '{PROJECT_ROOT}'/data' o relatorio completo"
)

if __name__ == "__main__":
    print("\n📚 INICIANDO MÓDULO 10: RAG & AUTO-REMEDIAÇÃO\n")
    crew = Crew(agents=[agent], tasks=[task_remediate_incident])
    crew.kickoff()
