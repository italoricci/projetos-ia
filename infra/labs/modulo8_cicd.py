import os
from pathlib import Path
from crewai import Task, Crew
from core.agents import get_cicd_agent
from tools.file_writer import write_file
from tools.loadfile_tools import load_file

PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
yaml_workflow_path = os.path.join(PROJECT_ROOT, "data", "workflow.yaml")

agent = get_cicd_agent(tools=[load_file, write_file])

task_optimize_cicd = Task(
    description=f"""
    Analise o workflow em '{yaml_workflow_path}'. 
    Identifique por que ele está lento e custando caro (dica: falta de cache). 
    Reescreva o trecho do YAML aplicando as melhores práticas de cache para Node.js 
    e explique quanto tempo estimamos economizar.""",
    agent=agent,
    expected_output=f"Sugestão de YAML otimizado com explicação técnica das melhorias. "
                    f"Escrevendo esse yaml na pasta '{PROJECT_ROOT}/data',"
                    f"Mantendo o arquivo original e criando uma nova versao com comentarios da explicacoes tecnicas. ",
)

if __name__ == "__main__":
    print("\n⚡ INICIANDO MÓDULO 8: OTIMIZAÇÃO DE CI/CD\n")
    crew = Crew(agents=[agent], tasks=[task_optimize_cicd])
    crew.kickoff()
