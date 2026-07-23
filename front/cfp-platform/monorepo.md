# Anotações

## 1. Instalação do Nx

```bash
npm install -g nx@latest
```

## 2. Criação do workspace

```bash
npx create-nx-workspace@latest cfp-platform --preset=apps --nxCloud=skip
```

## 3. Instalação dos plugins

```bash
npm install -D @nx/angular @nx/nest @nx/js
```

## 4. Configuração do frontend

```bash
nx g @nx/angular:application front --routing=true --style=css --standalone=true --strict
```

## 5. Configuração do backend

```bash
nx g @nx/nest:application api --frontendProject=front --strict
```

## 6. Configuração da biblioteca compartilhada

```bash
nx g @nx/js:library shared-types --buildable
```

## 7. Rodar ambos projetos

```bash
nx run-many -t serve -p api front
```

## 8. Instalando o Open Spec

```bash
npm install -g @fission-ai/openspec@latest
```

## 9. Inicializando Open Spec

```bash
openspec init
```

## 10. Prompts Open Spec

```bash
modo explorer:

/openspec-explore leia a estruta atual do nosso nx monorpo. Verifique onde estao os apps api e front, e confirme a existencia da biblioterca shared-types com nosso speark. Apenas mapeie a topologia nao sugira codigos

adicao de feature:

/opsx-propose change-id: add-cpf-feature
Objetivo: Implementar o modulo de subimissao de palestras.
Regras Estritas de Arquitetura:
Frontend: Angular 21 em front. Uso obrigatorio de standalone components, signals para gestao de estado e WAI-ARIA para acessibildiade.
Backend: NestJS em api. Uso de @Body() com validacao estrita via class-validator;
Shared: Ambos devem consumir o contrato speaker exportado da lib shared-types
Qualidade (Testes Unitarios Obrigatorios): O plano DEVE prever a criacao de testes com Jest. O NestJS precisa de testes garantindo que payloads invalidos sejam rejeitados (400 bad request).
O angular precisa de testes validando o estado incial do signal e o bloqueio de envio
Gere os arquivis proposal.md, design.md e taks.md. Nao escreva nenhum codigo de aplicacao ou testes ainda.

```
