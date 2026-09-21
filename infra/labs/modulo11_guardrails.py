import os
from crewai.tools import tool
from pathlib import Path
from crewai import Task, Crew
from core.agents import get_safety_sre

PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)

# --- FERRAMENTA COM GUARDRAIL (SIMULAÇÃO) ---
@tool("executar_fix_k8s_com_seguranca")
def executar_fix_k8s_com_seguranca(manifesto_yaml: str) -> str:
    """Executa um dry-run do manifesto Kubernetes e solicita aprovação humana antes de aplicar em produção."""
    print("\n--- 🛡️ GUARDRAIL DE SEGURANÇA ATIVADO ---")
    print(f"🤖 IA sugere o seguinte manifesto:\n\n{manifesto_yaml}")
    print("\n--- ⚙️ EXECUTANDO SIMULAÇÃO (DRY-RUN) ---")
    # Aqui simulamos o comando: kubectl apply -f fix.yaml --dry-run=client
    print("✅ Dry-run realizado com sucesso: 'deployment.apps/checkout-api configured (dry run)'")

    # INTERAÇÃO HUMANA (Human-in-the-loop)
    confirmacao = input("\n🚨 VOCÊ APROVA A APLICAÇÃO DESTA CORREÇÃO EM PRODUÇÃO? (sim/nao): ")

    if confirmacao.strip().lower() == 'sim':
        return "🚀 SUCESSO: Alteração aplicada no cluster após aprovação humana."
    else:
        return "🛑 CANCELADO: O Engenheiro rejeitou a alteração sugerida pela IA."


# --- CONFIGURAÇÃO ---
agent = get_safety_sre(tools=[executar_fix_k8s_com_seguranca])

task = Task(
    description="""
    O serviço 'checkout-api' está falhando por causa de uma imagem inválida.
    1. Gere um manifesto de Deployment corrigido apontando para a imagem estável 'checkout-api:v2.0'.
    2. Use a ferramenta 'executar_fix_k8s_com_seguranca' para validar (dry-run) e submeter à aprovação humana.
    3. Nunca aplique nada sem passar pela ferramenta de guardrail.
    """,
    expected_output="O resultado da ferramenta de guardrail (aprovado ou cancelado pelo engenheiro).",
    agent=agent
)

if __name__ == "__main__":
    print("\n🚀 [NEXUS-BOT] Iniciando análise de remediação com guardrails...")
    crew = Crew(agents=[agent], tasks=[task], verbose=True)
    resultado = crew.kickoff()
    print(f"\n📋 RESULTADO FINAL:\n{resultado}")
