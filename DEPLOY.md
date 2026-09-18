# Deploy Gypsy Jazz Hub (Cloudflare Workers)

Production is **only** https://www.gypsyjazzhub.com on the Cloudflare Worker named **`gypsyjazzhub`**.

Do **not** treat `*.grok.me`, Vercel, or any other Worker name as live.

## What “deploy” means

1. Commit lands on `main` in `danielgueli-svg/gypsyjazzhub`.
2. Build a **Cloudflare** Worker bundle (`GROK_CF_WORKER=1`).
3. Run `scripts/cf-prep.mjs` (sets Worker name `gypsyjazzhub`, HubDb Durable Object, auth URL, crons, Workers Logs).
4. `npx wrangler deploy` from `.output/server` (or the path Wrangler prints after the Nitro CF build).
5. Confirm live: `npm run site-check:live`.

Until **Workers Builds** is connected in the Cloudflare dashboard (GitHub → Worker `gypsyjazzhub`), step 2–4 are done by hand / by the agent that publishes — **pushing `main` alone does not update the live site**.

## Local / agent publish commands

```bash
# Cloudflare Worker build (not the default Vercel/Grok preview preset)
GROK_CF_WORKER=1 npm run build
node scripts/cf-prep.mjs
npx wrangler deploy --config .output/server/wrangler.json
npm run site-check:live
```

Or: `npm run deploy:cf` (same steps; needs Wrangler auth).

## Wire automatic deploys (recommended once)

In the Cloudflare dashboard → Workers & Pages → **gypsyjazzhub** → Settings → Builds:

1. Connect the GitHub repo `danielgueli-svg/gypsyjazzhub`.
2. Branch: `main`.
3. Build command: `GROK_CF_WORKER=1 npm run build && node scripts/cf-prep.mjs`
4. Deploy command: `npx wrangler deploy --config .output/server/wrangler.json`
5. Keep existing production secrets (`RESEND_API_KEY`, `OWNER_PASSWORD`, etc.).

After that, a green push to `main` should refresh https://www.gypsyjazzhub.com.

## Cleanup

- Keep Worker **`gypsyjazzhub`** (custom domains `www` + apex).
- Delete leftover Worker **`danielgueli-svg-gypsyjazzhub`** if it still exists — it has no public hostname.

## Monitoring

- GitHub Action **Site check**: live probe hourly; full local PGLite + Playwright daily at 08:00 UTC and on every push.
- Cloudflare Workers Logs: enabled via `cf-prep` on the next publish (`observability.enabled`).

## Migrations note

SQL in `migrations/` must work for **both**:

- local / CI **PGLite** (Postgres-like), and
- production **HubDb SQLite** on a Durable Object.

Never use `timestamptz … default ''` — use a real timestamp constant or nullable column. Test with `npm run site-check` (local) before relying on CI alone.

## Not production

- `vercel.json` is a leftover from an older host. Cloudflare DNS + Worker custom domains handle HTTPS/www redirects.
- Worker cron (via `cf-prep`) hits:
  - daily `/api/alerts` + `/api/digest` (`15 6 * * *` UTC)
  - daily `/api/mail-queue` (`0 17` / `0 18` UTC)
  - weekly Mon `/api/facebook-import` (`0 7 * * 1` UTC) and `/api/djangobooks-import` (`20 7 * * 1` UTC)
  - Sinti Music + artist/venue/festival/camp sites `/api/artist-import` Mon 05:00 NL (`0 3` / `0 4 * * 1` UTC) and Fri 17:00 NL (`0 15` / `0 16 * * 5` UTC)
- Grok draft URLs and the `glow-shale-falcon-daisy` export are noindex drafts only.
