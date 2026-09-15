import os
from pathlib import Path

from tools.file_writer import write_file
from tools.loadfile_tools import load_json
from crewai import Task, Crew
from core.agents import get_finops_agent

PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
cloud_inventory_path = os.path.join(PROJECT_ROOT, "data", "inventario_cloud.json")
agent = get_finops_agent(tools=[load_json, write_file])

task_audit_finops = Task(
    description=f"""
    Analise o inventário em '{cloud_inventory_path}'. 
    Identifique: 
    1. Recursos 'Zumbis' (volumes disponíveis mas não usados, IPs soltos).
    2. Instâncias superdimensionadas (Rightsizing).
    Calcule a economia total estimada em dólares e gere um relatório de recomendações.""",
    agent=agent,
    expected_output="Relatório de FinOps com lista de cortes e economia total estimada."
                    f"Grave em formato markdown dentro da pasta '{PROJECT_ROOT}'/data' o relatorio completo"
)

if __name__ == "__main__":
    print("\n💰 INICIANDO MÓDULO 9: AUDITORIA FINOPS\n")
    crew = Crew(agents=[agent], tasks=[task_audit_finops])
    crew.kickoff()
