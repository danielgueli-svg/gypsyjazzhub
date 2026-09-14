# Gypsy Jazz Hub

Community site for Gypsy jazz / jazz manouche: jams, concerts, festivals, musicians, groups, instruments, Learn, History, News, and a spinning globe.

**Live site:** https://www.gypsyjazzhub.com (Cloudflare Worker `gypsyjazzhub`)

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
| DB (local) | PGLite (no setup) |
| DB (live) | HubDb SQLite on a Cloudflare Durable Object |
| Auth | Better Auth (`src/lib/auth/`). Email/password is on. OAuth needs broker env vars. |
| Host | Cloudflare Workers — see `DEPLOY.md` |

## Layout

```
src/routes/          pages (index, world, jams, concerts, musicians, history, news, learn, studio)
src/lib/             catalogs, geo, i18n, db, auth, hub API
src/components/      header, globe, country pages, UI
migrations/          PGLite (local/CI) + HubDb-compatible schema
public/              photos, og image, favicon
```

Owner tools: `/studio` and `/studio/owner`.

## Env

Copy `.env.example`. Empty file is enough for a first local run (PGLite). Production auth secrets live on the Cloudflare Worker (not Neon).

## Scripts

```bash
npm run dev          # preview on :8080
npm run dev:local    # Cursor on :3000
npm run build
npm run build:cf     # Cloudflare Worker bundle + cf-prep
npm run deploy:cf    # build:cf + wrangler deploy (needs auth)
npm run site-check:live
npm run typecheck
```

## Deploy

Production is **Cloudflare Workers**, not Vercel. Full checklist: **`DEPLOY.md`**.

`vercel.json` is leftover and unused for the public site. DNS redirects and Worker crons are configured on Cloudflare (`scripts/cf-prep.mjs`).

## Facts

Do not invent musicians, weekly jams, or concert dates. Seed and catalog files are the source of truth.
