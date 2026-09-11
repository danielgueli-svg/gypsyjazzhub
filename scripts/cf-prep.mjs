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
cfg.durable_objects = {
  bindings: [{ name: "HUB_DB", class_name: "HubDb" }],
};
cfg.migrations = cfg.migrations?.length
  ? cfg.migrations
  : [{ tag: "v1", new_sqlite_classes: ["HubDb"] }];

writeFileSync(wranglerPath, JSON.stringify(cfg, null, 2) + "\n");
console.log("[cf-prep] wrangler.json ready for gypsyjazzhub");
