from crewai.tools import tool

@tool('load_file')
def load_file(file_path: str) -> str:
    """Load a file into a string"""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()
