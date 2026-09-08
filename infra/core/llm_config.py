import os
from dotenv import load_dotenv
from crewai import LLM

load_dotenv()

chave = os.getenv("OPEN_ROUTER_KEY")
print(f"Chave carregada: {chave[:10]}..." if chave else "Chave NÃO encontrada!")

# Centraliza a inteligência do projeto
nexus_llm = LLM(
    model="openrouter/openrouter/free",
    base_url="https://openrouter.ai/api/v1",
    api_key=chave,
    temperature=0.2
)
