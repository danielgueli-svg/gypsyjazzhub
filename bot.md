# Handoff for Cursor / Grok bot

You maintain **Gypsy Jazz Hub**.

## Production (only this is live for the public and for Google)

- Domain: https://www.gypsyjazzhub.com/
- Repo: https://github.com/danielgueli-svg/gypsyjazzhub (`main`)
- Host: Cloudflare Workers. DNS stays on Cloudflare. Domain registrar is GoDaddy — do not buy GoDaddy hosting.
- Canonical host is www. Apex `gypsyjazzhub.com` must 301 to `https://www.gypsyjazzhub.com/`. HTTP must 301 to HTTPS.
- Sitemap: https://www.gypsyjazzhub.com/sitemap.xml
- robots: Allow Google on `/`. Disallow only `/api/`, `/login`, `/studio`. Meta: `index, follow`. Canonical always `https://www.gypsyjazzhub.com/...`

## Not production

- `glow-shale-falcon-daisy.grok.me` is a draft sandbox. It is noindex.
- Private repo `danielgueli-svg/glow-shale-falcon-daisy` is the Grok export copy. Do not treat it as the live site.
- Never attach `gypsyjazzhub.com` DNS back to grok.me / Vercel as the public host.

## When asked to change the site

1. Edit `danielgueli-svg/gypsyjazzhub` on branch `main`.
2. Push there (wrangler-publish if Cloudflare Git auto-deploy is not wired).
3. Report the commit URL and that **https://www.gypsyjazzhub.com** is the live URL.
4. If you also export to `glow-shale-falcon-daisy`, say so — that copy is draft only.

Command: when I say **deploy [change]**, apply it on `danielgueli-svg/gypsyjazzhub`, push `main`, and reply with live URL + commit.

## Cloudflare rules

- Workers cannot boot PGLite/Postgres. Do not add `DATABASE_URL`/PGLite startup that crashes SSR.
- Public pages must keep rendering from catalog/seed/live rows if the DB extras fail.
- Login persistence is HubDb SQLite on a Cloudflare Durable Object, not Neon.
- Do not hang `/jams` with a bad `NITRO_PRESET`.

## Known bugs (fix if you touch those areas)

- `/musicians` currently must not show 0 musicians. Restore the directory without breaking Workers.
- `/favicon.ico` is 404. Add a favicon.
- Artist/concert links must not 404 or serve a refresh stub.

## Do not

- Invent musicians, weekly jams, concert dates, or websites.
- Redesign the wood look, globe, or nav unless asked.
- Strip `https://grok.com/grok-app-builder/extensions.js` (platform injector).
- Change GoDaddy DNS, suggest GoDaddy hosting, keep production only on grok.me, or index the grok.me URL.

## Stack

TanStack Start, React 19, Tailwind 4. Routes in `src/routes`. Catalogs in `src/lib`. Owner desk: `/studio/owner`. Production login: HubDb Durable Object.

## Local

```bash
nvm use
npm install
cp .env.example .env
npm run dev:local
```

Open http://localhost:3000

## Facts

Seed files are the source of truth (`src/lib/jams.ts`, concerts, musicians, history). Empty lists stay honest.
