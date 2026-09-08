# Gypsy Jazz Hub — project rules (Cursor)

Gypsy jazz community site: jams, concerts, musicians, groups, instruments, Learn, History, News, globe.

## Stack

TanStack Start (file routes in `src/routes`) · React 19 · Vite · Tailwind 4 · Better Auth · Kysely/SQL · PGLite locally, Neon when `DATABASE_URL` is set.

## Do

- Keep the wood look, globe, and existing nav. Do not redesign unless asked.
- Use only real, publicly checkable names, dates, venues, and URLs. Do not invent makers, concerts, or weekly jams.
- Living players: `/musicians/<slug>`. Deceased legends: `/legends/<slug>` except Django → `/django` and Grappelli → `/grappelli`.
- Seed data lives in `src/lib/` (`seed-data.ts`, `circle-artists.ts`, `jams.ts`, `festivals.ts`, `venues.ts`, `camps.ts`, `news-copy.ts`, `music.ts`). SQL schema in `migrations/`.
- Country pages: `/world/<slug>`. Globe picker is a name-only A–Z list under the globe.

## Don’t

- Don’t add fake RSVPs, fake board notes, or copy biographies from other sites.
- Don’t commit `.env`, `node_modules`, `screenshots/`, or `artifacts/`.
- Don’t bind production to PGLite. Set `DATABASE_URL` on deploy.

## Run

```bash
npm install
cp .env.example .env
npm run dev          # 0.0.0.0:8080 (Grok preview)
npm run dev:local    # 127.0.0.1:3000 (Cursor)
npm run typecheck
```
