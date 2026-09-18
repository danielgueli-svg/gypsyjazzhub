#!/usr/bin/env node
/**
 * After a Cloudflare Worker build, keep the production worker name, HubDb
 * Durable Object, and auth origin. Nitro's generated wrangler.json is the
 * base — we only fill in what production already uses.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const serverDir = join(root, ".output/server");
const wranglerPath = join(serverDir, "wrangler.json");
const indexPath = join(serverDir, "index.mjs");
const doSrc = join(root, "server/hub-db-do.mjs");
const doDest = join(serverDir, "hub-db-do.mjs");

if (!existsSync(wranglerPath)) {
  console.error("[cf-prep] missing", wranglerPath);
  process.exit(1);
}

if (existsSync(doSrc)) copyFileSync(doSrc, doDest);

if (existsSync(indexPath)) {
  let index = readFileSync(indexPath, "utf8");
  if (!index.includes("export { HubDb }")) {
    if (index.includes("export { cloudflare_module_default as default }")) {
      index = index.replace(
        "export { cloudflare_module_default as default }",
        'export { HubDb } from "./hub-db-do.mjs";\nexport { cloudflare_module_default as default }',
      );
    } else {
      index += '\nexport { HubDb } from "./hub-db-do.mjs";\n';
    }
    writeFileSync(indexPath, index);
    console.log("[cf-prep] exported HubDb from worker entry");
  }
}

function readVars(path) {
  if (!path || !existsSync(path)) return {};
  try {
    const parsed = JSON.parse(readFileSync(path, "utf8"));
    return parsed.vars && typeof parsed.vars === "object" ? parsed.vars : {};
  } catch {
    return {};
  }
}

const prevVars = readVars(process.env.CF_PREV_WRANGLER);
const cfg = JSON.parse(readFileSync(wranglerPath, "utf8"));
cfg.name = "gypsyjazzhub";
// Workers Logs / Query Builder — keep on so outages are debuggable.
cfg.observability = {
  enabled: true,
  head_sampling_rate: 1,
  logs: {
    enabled: true,
    invocation_logs: true,
    head_sampling_rate: 1,
  },
};
cfg.vars = {
  ...prevVars,
  ...(cfg.vars || {}),
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "https://www.gypsyjazzhub.com",
};
if (process.env.BETTER_AUTH_SECRET) {
  cfg.vars.BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;
}
if (process.env.RESEND_API_KEY) {
  cfg.vars.RESEND_API_KEY = process.env.RESEND_API_KEY;
}
// Prefer build-env MAIL_FROM; otherwise keep a previous Worker value; else
// default to the verified gypsyjazzhub.com sender.
if (process.env.MAIL_FROM) {
  cfg.vars.MAIL_FROM = process.env.MAIL_FROM;
} else if (!cfg.vars.MAIL_FROM) {
  cfg.vars.MAIL_FROM = "Gypsy Jazz Hub <noreply@gypsyjazzhub.com>";
}
cfg.durable_objects = {
  bindings: [{ name: "HUB_DB", class_name: "HubDb" }],
};
cfg.triggers = {
  ...(cfg.triggers || {}),
  // Daily: alerts+digest @ 06:15 UTC; mail-queue windows @ 17:00/18:00 UTC.
  // Weekly Mon: Facebook @ 07:00 UTC; DjangoBooks @ 07:20 UTC.
  // Artist/Sinti crawl: Mon 05:00 NL (03:00/04:00 UTC) and Fri 17:00 NL (15:00/16:00 UTC).
  crons: [
    ...new Set([
      ...(cfg.triggers?.crons || []),
      "15 6 * * *",
      "0 3 * * 1",
      "0 4 * * 1",
      "0 7 * * 1",
      "20 7 * * 1",
      "0 15 * * 5",
      "0 16 * * 5",
      "0 17 * * *",
      "0 18 * * *",
    ]),
  ],
};
cfg.migrations = cfg.migrations?.length
  ? cfg.migrations
  : [{ tag: "v1", new_sqlite_classes: ["HubDb"] }];

writeFileSync(wranglerPath, JSON.stringify(cfg, null, 2) + "\n");
console.log("[cf-prep] wrangler.json ready for gypsyjazzhub");

if (existsSync(indexPath)) {
  let index = readFileSync(indexPath, "utf8");
  if (!index.includes("gjhScheduled")) {
    index += `
async function gjhScheduled(event, env, ctx) {
  const secret = env.CRON_SECRET || env.DIGEST_SECRET || "";
  const q = secret ? "?secret=" + encodeURIComponent(secret) : "";
  const origin = "https://www.gypsyjazzhub.com";
  const cron = event && event.cron ? String(event.cron) : "";
  if (cron === "0 7 * * 1") {
    ctx.waitUntil(fetch(origin + "/api/facebook-import" + q));
    return;
  }
  if (cron === "20 7 * * 1") {
    ctx.waitUntil(fetch(origin + "/api/djangobooks-import" + q));
    return;
  }
  if (cron === "0 3 * * 1" || cron === "0 4 * * 1" || cron === "0 15 * * 5" || cron === "0 16 * * 5") {
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Amsterdam",
      weekday: "short",
      hour: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const weekday = (parts.find((p) => p.type === "weekday") || {}).value;
    const hour = Number((parts.find((p) => p.type === "hour") || {}).value);
    if ((weekday === "Mon" && hour === 5) || (weekday === "Fri" && hour === 17)) {
      ctx.waitUntil(fetch(origin + "/api/artist-import" + q));
    }
    return;
  }
  const hour = Number(new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Amsterdam",
    hour: "numeric",
    hour12: false,
  }).format(new Date()));
  if (hour === 19 || cron === "0 17 * * *" || cron === "0 18 * * *") {
    ctx.waitUntil(fetch(origin + "/api/mail-queue" + q));
    return;
  }
  ctx.waitUntil(fetch(origin + "/api/alerts" + q));
  ctx.waitUntil(fetch(origin + "/api/digest" + q));
}
const __gjhDefault = typeof cloudflare_module_default !== "undefined" ? cloudflare_module_default : null;
if (__gjhDefault && typeof __gjhDefault === "object") {
  __gjhDefault.scheduled = gjhScheduled;
}
`;
    writeFileSync(indexPath, index);
    console.log("[cf-prep] attached scheduled handler (digest, mail-queue, weekly imports, artist crawl)");
  }
}
