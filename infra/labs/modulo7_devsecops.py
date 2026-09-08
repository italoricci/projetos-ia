import os
import sys
from tools.devsecops_tools import analyze_trivy_report
from crewai import Task, Crew
from core.agents import get_devsecops_agent


# Ensure project root is in the Python path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)


trivy_report_path = os.path.join(PROJECT_ROOT, "data", "trivy.json")

# --- AGENT & TASK CONFIGURATION ---
agent = get_devsecops_agent(tools=[analyze_trivy_report])

task_audit_security = Task(
    description=f"""
    Analise o relatório de segurança real em '{trivy_report_path}'. 
    Filtre o ruído e identifique se há alguma ameaça crítica de Backdoor (como a CVE-2024-3094). 
    Gere um relatório executivo explicando o risco e o plano de ação imediato.""",
    expected_output="Relatório priorizado com foco em ameaças reais e exploráveis.",
    agent=agent
)

if __name__ == "__main__":
    print("\n🛡️ INICIANDO MÓDULO 7: AUDITORIA DE SEGURANÇA AI\n")
    crew = Crew(agents=[agent], tasks=[task_audit_security])
    crew.kickoff()
