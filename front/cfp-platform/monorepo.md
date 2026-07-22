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
