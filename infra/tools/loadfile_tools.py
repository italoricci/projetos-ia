from crewai.tools import tool
import json

@tool('load_file')
def load_file(file_path: str) -> str:
    """Load a file into a string"""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()


@tool('load_json')
def load_json(file_path: str) -> str:
    """Load a file in format json"""
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)
