from crewai import Agent
from core.llm_config import nexus_llm


def get_architect(tools=None):
    return Agent(
        role='Arquiteto de Cloud Nexus',
        goal='Projetar infraestrutura seguindo normas e gerando codigo HCL.',
        backstory='Especialista em AWS/Terraform com foco em governanca',
        tools=tools or [],
        llm=nexus_llm,
        verbose=True
    )


def get_auditor(tools=None):
    return Agent(
        role='Engenheiro DevSecOps',
        goal='Garantir seguranca e conformidade total dos projetos.',
        backstory='Auditor rigoroso que utiliza ferramentas de scan e OPA',
        tools=tools or [],
        llm=nexus_llm,
        verbose=True
    )
