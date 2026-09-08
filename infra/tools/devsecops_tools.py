# --- TOOL DEFINITION ---
import json

from crewai.tools import tool


@tool("analyze_trivy_report")
def analyze_trivy_report(file_path: str) -> dict:
    """Reads a Trivy security scan JSON report and returns its raw data."""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)
