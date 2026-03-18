# FightHub

> Status: MVP em evolução

Plataforma para atletas, equipes, eventos e rankings de esportes de combate.

O **FightHub** foi pensado para centralizar a presença digital do lutador em um único lugar, conectando perfil, carreira, eventos e visibilidade competitiva em uma experiência moderna, simples e escalável.

## Preview

- Projeto online: [https://fight-hub.vercel.app/](https://fight-hub.vercel.app/)

## Funcionalidades atuais

- Autenticação com `Supabase Auth`
- Login e cadastro com e-mail, `Google` e `GitHub`
- Sessão persistente e rotas protegidas
- `Modo Demo` para explorar o fluxo sem criar conta
- Dashboard inicial do atleta
- Estrutura de dados para lutadores, equipes, eventos, lutas e rankings
- Migrações complementares para follows, showcase, vínculo com auth e ajustes de perfil

## Tecnologias utilizadas

- `React`
- `TypeScript`
- `Vite`
- `Supabase`
- `PostgreSQL`
- `Node.js`
- `Express`
- `Vercel`

## Estrutura do projeto

```text
fightHub/
├── frontend/            # Aplicação principal em React + Vite
├── backend/             # Backend auxiliar em Node + Express
├── scripts/             # Scripts utilitários
├── *.sql                # Migrações e ajustes do banco no Supabase
└── vercel.json          # Configuração de deploy
```

## Como rodar localmente

### 1. Frontend

```bash
cd frontend
npm install
```

Crie um arquivo `.env` dentro de `frontend/`:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

Inicie o projeto:

```bash
npm run dev
```

### 2. Backend

O backend atual é enxuto e serve como apoio para integrações e evolução da aplicação.

```bash
cd backend
npm install
node server.js
```

## Banco de dados

A base do banco está organizada em arquivos SQL na raiz do projeto.

### Migração principal

- `supabase-full-migration.sql`

### Migrações complementares

- `supabase-fighter-auth-link.sql`
- `supabase-fighter-follows.sql`
- `supabase-fighter-photo-settings.sql`
- `supabase-fighter-showcase.sql`
- `supabase-user-sync-trigger.sql`

## Objetivo do produto

O FightHub não é apenas um painel: ele é a base de uma plataforma para organizar a carreira do atleta, fortalecer sua presença digital e conectar lutadores, equipes e organizações em um único ecossistema.

## Roadmap

- Evoluir o perfil público de atletas e equipes
- Expandir a gestão de eventos e histórico de lutas
- Fortalecer rankings, followers e showcase
- Melhorar a experiência mobile
- Consolidar o produto como plataforma para o esporte de combate

## Autor

Desenvolvido por **Tauan Gramacho**.
