# Gypsy Jazz Hub

Community site for Gypsy jazz / jazz manouche: jams, concerts, festivals, musicians, groups, instruments, Learn, History, News, and a spinning globe.

This folder is ready to open in **Cursor**.

## Open in Cursor

1. Unzip this project (or clone it).
2. Cursor → **File → Open Folder** → this directory.
3. In the Cursor terminal:

```bash
nvm use        # Node 22 (see .nvmrc)
npm install
cp .env.example .env
npm run dev:local
```

4. Browser: [http://localhost:3000](http://localhost:3000)

`npm run dev` still binds `0.0.0.0:8080` (Grok live preview). Use `dev:local` on your machine.

## Stack

| | |
| --- | --- |
| App | TanStack Start (file routes in `src/routes`) |
| UI | React 19, Tailwind 4, Radix |
| Data | TypeScript catalogs in `src/lib/` + SQL in `migrations/` |
| DB | PGLite (local, no setup) or Postgres/Neon via `DATABASE_URL` |
| Auth | Better Auth (`src/lib/auth/`). Email/password is on. OAuth needs broker env vars. |

## Layout

```
src/routes/          pages (index, world, jams, concerts, musicians, history, news, learn, studio)
src/lib/             catalogs, geo, i18n, db, auth, hub API
src/components/      header, globe, country pages, UI
migrations/          Postgres / PGLite schema
public/              photos, og image, favicon
```

Owner tools: `/studio` and `/studio/owner`.

## Env

Copy `.env.example`. Empty file is enough for a first local run (PGLite). For a real database and login on the public site, set `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL`.

## Scripts

```bash
npm run dev          # preview on :8080
npm run dev:local    # Cursor on :3000
npm run build
npm run typecheck
npm run db:migrate
```

## Deploy

`vercel.json` is included. Set `DATABASE_URL` on the host. Cron paths: `/api/digest`, `/api/alerts`, `/api/facebook-import`, `/api/djangobooks-import`.

## Facts

Do not invent musicians, weekly jams, or concert dates. Seed and catalog files are the source of truth.
