# Handoff for Cursor / Grok bot

This is **Gypsy Jazz Hub** (`https://www.gypsyjazzhub.com`).

GitHub: https://github.com/danielgueli-svg/gypsyjazzhub

## Do not

- Invent musicians, weekly jams, concert dates, or websites.
- Redesign the wood look, globe, or nav unless asked.
- Strip `https://grok.com/grok-app-builder/extensions.js` (platform injector).
- Change GoDaddy DNS.

## Stack

TanStack Start, React 19, Tailwind 4, PGLite or Postgres. Routes in `src/routes`. Catalogs in `src/lib`. Owner desk: `/studio/owner`.

## Local

nvm use
npm install
cp .env.example .env
npm run dev:local

Open http://localhost:3000

## Facts

Seed files are the source of truth (`src/lib/jams.ts`, concerts, musicians, history). Empty lists stay honest.
