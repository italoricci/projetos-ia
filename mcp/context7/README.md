# Next.js + Better Auth + GitHub OAuth + SQLite Demo

Demo simples de autenticação com Next.js, Better Auth e GitHub OAuth.

## Requisitos

- Node.js 18+
- npm

## Instruções de Setup

### 1. Configurar Credenciais GitHub OAuth

1. Acesse https://github.com/settings/developers
2. Clique em "New OAuth App"
3. Preencha:
   - **Application name**: seu-nome-do-app
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copie o `Client ID` e `Client Secret`
5. Atualize `.env.local`:
   ```env
   GITHUB_CLIENT_ID=seu-client-id
   GITHUB_CLIENT_SECRET=seu-client-secret
   ```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Criar Schema do Banco (Migrate)

```bash
npx @better-auth/cli migrate
```

Isso criará o arquivo `better-auth.sqlite` com as tabelas necessárias.

### 4. Rodar o Dev Server

```bash
npm run dev
```

Acesse `http://localhost:3000`

## Fluxo da Aplicação

- **Sem login**: Mostra "Você não está logado" com botão "Entrar com GitHub"
- **Com login**: Mostra nome, email e foto do usuário com botão "Sair"
- **Clique em "Entrar"**: Redireciona para GitHub para autenticação
- **Clique em "Sair"**: Encerra a sessão e redireciona para home

## Arquivos Principais

- `lib/auth.ts` — Configuração do Better Auth (server)
- `lib/auth-client.ts` — Cliente da autenticação (browser)
- `app/api/auth/[...all]/route.ts` — Route handler da API de auth
- `app/page.tsx` — Página principal com UI
- `app/page.module.css` — Estilos da página
- `.env.local` — Variáveis de ambiente
- `better-auth.sqlite` — Banco de dados (criado após migrate)

## Scripts Disponíveis

```bash
npm run dev      # Rodar dev server
npm run build    # Build para produção
npm start        # Rodar servidor de produção
npm run lint     # Lint do código
```
