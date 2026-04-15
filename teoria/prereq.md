## Macos 13 (Apps usados)

# Docker - Colima (https://github.com/abiosoft/colima)

1. colima start
2. docker-compose -f DOCKER_COMPOSE up
3. colima stop

### Ollama

# Instação

```terminal
curl -L https://github.com/ollama/ollama/releases/download/v0.1.48/Ollama-darwin.zip -o ~/ollama.zip
unzip ~/ollama.zip -d ~/
mv ~/Ollama.app/Contents/Resources/ollama /usr/local/bin/ollama
chmod +x /usr/local/bin/ollama
```

1. ollama serve
2. ollama list
3. ollama pull modelo

```terminal
ollama list
ollama pull llama2-uncensored:7b

curl -s -X POST http://localhost:11434/api/generate -H "Content-Type: application/json" -d '{"model":"llama2-uncensored:7b","prompt":"Qual é o PIB do Brasil em 2023? O que é o PIB?","stream":false}' | jq -r '.response'

```

## Jan.ia (https://www.jan.ai/)

1. App já traz os modelos quantizados
