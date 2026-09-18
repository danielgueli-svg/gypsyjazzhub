#!/usr/bin/env node
/**
 * Smoke-test that cf-prep writes observability onto wrangler.json.
 * Uses a temp dir so we never touch a real .output/.
 */
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));

test("cf-prep enables Workers observability", () => {
  const dir = mkdtempSync(join(tmpdir(), "cf-prep-"));
  const serverDir = join(dir, ".output", "server");
  mkdirSync(serverDir, { recursive: true });
  writeFileSync(
    join(serverDir, "wrangler.json"),
    JSON.stringify({ name: "tmp", vars: {} }, null, 2),
  );
  writeFileSync(join(serverDir, "index.mjs"), "export default {};\n");

  const prev = process.cwd();
  try {
    process.chdir(dir);
    // Copy script path still runs against workspace script via absolute path
    const script = join(root, "scripts/cf-prep.mjs");
    // cf-prep uses process.cwd() — run from temp project that mimics layout
    // Need hub-db-do optional; skip.
    const r = spawnSync(process.execPath, [script], {
      cwd: dir,
      encoding: "utf8",
      env: { ...process.env },
    });
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const cfg = JSON.parse(readFileSync(join(serverDir, "wrangler.json"), "utf8"));
    assert.equal(cfg.name, "gypsyjazzhub");
    assert.equal(cfg.observability?.enabled, true);
    assert.equal(cfg.observability?.logs?.invocation_logs, true);
    const crons = cfg.triggers?.crons || [];
    for (const needed of [
      "15 6 * * *",
      "0 3 * * 1",
      "0 4 * * 1",
      "0 7 * * 1",
      "20 7 * * 1",
      "0 15 * * 5",
      "0 16 * * 5",
      "0 17 * * *",
      "0 18 * * *",
    ]) {
      assert.ok(crons.includes(needed), `missing cron ${needed}`);
    }
    const index = readFileSync(join(serverDir, "index.mjs"), "utf8");
    assert.match(index, /\/api\/facebook-import/);
    assert.match(index, /\/api\/djangobooks-import/);
    assert.match(index, /\/api\/artist-import/);
    assert.match(index, /\/api\/mail-queue/);
  } finally {
    process.chdir(prev);
    rmSync(dir, { recursive: true, force: true });
  }
});
