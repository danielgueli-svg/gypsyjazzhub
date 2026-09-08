import { copyFileSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Production SSR barrel from Rolldown/Nitro is circular and mis-aliased:
 *   - ssr2.mjs imports __exportAll from ssr.mjs while ssr.mjs imports ssr2
 *   - ssr.mjs exports `ssr_exports as s`, but the renderer calls `mod.s.fetch`
 *     (`s` must be the server entry from ssr2, i.e. server_default)
 * PGLite wasm/data are emitted under hashed static/ assets; the function
 * bundle looks for _libs/pglite.{data,wasm} next to the module.
 */

const HELPER = `var __exportAll$1 = (all, no_symbols) => {
	let target = {};
	for (var name in all) Object.defineProperty(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) Object.defineProperty(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
`;

function walk(dir, out = []) {
  let entries = [];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (entry.name.endsWith(".mjs")) out.push(path);
  }
  return out;
}

function copyHashed(assetsDir, destDir, prefix, destName) {
  let names = [];
  try {
    names = readdirSync(assetsDir);
  } catch {
    return;
  }
  const hit = names.find((n) => n.startsWith(prefix) && (n.endsWith(".wasm") || n.endsWith(".data")));
  if (!hit) return;
  copyFileSync(join(assetsDir, hit), join(destDir, destName));
  console.log("[patch-ssr-exports] copied", hit, "->", destName);
}

const root = join(process.cwd(), ".vercel/output/functions");
let patched = 0;

for (const file of walk(root)) {
  let src = readFileSync(file, "utf8");
  let next = src;

  if (/import \{ c as __exportAll\$1 \} from ["']\.\/ssr\.mjs["'];/.test(next)) {
    next = next.replace(/import \{ c as __exportAll\$1 \} from ["']\.\/ssr\.mjs["'];\n?/, HELPER);
  }

  if (next.includes("ssr_exports as s")) {
    next = next.replace(/\bssr_exports as s\b/, "server_default as s");
    next = next.replace(/\nvar ssr_exports = \{\};\n/, "\n");
  }

  if (next !== src) {
    writeFileSync(file, next);
    patched += 1;
    console.log("[patch-ssr-exports] patched", file);
  }
}

const assets = join(process.cwd(), ".vercel/output/static/assets");
const libs = join(process.cwd(), ".vercel/output/functions/__server.func/_libs");
copyHashed(assets, libs, "pglite-", "pglite.data");
copyHashed(assets, libs, "pglite-", "pglite.wasm");
// pglite- prefix matches both .data and .wasm — copy specifically:
try {
  const names = readdirSync(assets);
  const data = names.find((n) => n.startsWith("pglite-") && n.endsWith(".data"));
  const wasm = names.find((n) => n.startsWith("pglite-") && n.endsWith(".wasm"));
  const initdb = names.find((n) => n.startsWith("initdb-") && n.endsWith(".wasm"));
  if (data) {
    copyFileSync(join(assets, data), join(libs, "pglite.data"));
    console.log("[patch-ssr-exports] pglite.data");
  }
  if (wasm) {
    copyFileSync(join(assets, wasm), join(libs, "pglite.wasm"));
    console.log("[patch-ssr-exports] pglite.wasm");
  }
  if (initdb) {
    copyFileSync(join(assets, initdb), join(libs, "initdb.wasm"));
    console.log("[patch-ssr-exports] initdb.wasm");
  }
} catch (err) {
  console.warn("[patch-ssr-exports] pglite copy skipped", err);
}

if (!patched) console.log("[patch-ssr-exports] no mjs patches (already applied?)");
