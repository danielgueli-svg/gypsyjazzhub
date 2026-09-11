#!/usr/bin/env node
/**
 * Build public/sitemap.xml from catalog sources (no DB required).
 *
 *   node scripts/build-sitemap.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "https://www.gypsyjazzhub.com";

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function slugsFrom(rel, key = "slug") {
  const text = read(rel);
  const re = new RegExp(`${key}:\\s*"([^"]+)"`, "g");
  const out = new Set();
  for (const match of text.matchAll(re)) out.add(match[1]);
  return [...out];
}

function countrySlug(name) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function artistPath(slug) {
  if (slug === "django-reinhardt") return "/django";
  if (slug === "stephane-grappelli") return "/grappelli";
  if (slug === "tata-mirando") return "/tata-mirando";
  if (slug === "denis-chang") return "/denis-chang";
  return `/musicians/${slug}`;
}

const staticPaths = [
  "/",
  "/jams",
  "/concerts",
  "/festivals",
  "/musicians",
  "/legends",
  "/learn",
  "/learn/teachers",
  "/news",
  "/join",
  "/board",
  "/history",
  "/archive",
  "/venues",
  "/groups",
  "/luthiers",
  "/luthiers/bass",
  "/luthiers/violin",
  "/shops",
  "/instruments",
  "/instruments/guitars",
  "/instruments/violins",
  "/instruments/double-bass",
  "/instruments/other",
  "/instruments/luthiers",
  "/youtube",
  "/django",
  "/grappelli",
  "/tata-mirando",
  "/denis-chang",
  "/world",
  "/add",
];

const paths = new Set(staticPaths);

for (const slug of slugsFrom("src/lib/circle-artists.ts")) {
  paths.add(artistPath(slug));
}
for (const slug of slugsFrom("src/lib/seed-data.ts")) {
  // seed-data also has legend_slug — artistPath still fine for musician pages
  if (slug.includes("-") || /^[a-z0-9]+$/.test(slug)) paths.add(artistPath(slug));
}
for (const slug of slugsFrom("src/lib/jams.ts")) {
  paths.add(`/jams/${slug}`);
}
for (const slug of slugsFrom("src/lib/festivals.ts")) {
  paths.add(`/festivals/${slug}`);
}
for (const slug of slugsFrom("src/lib/families.ts")) {
  paths.add(`/families/${slug}`);
}
function newsSlugs() {
  const text = read("src/lib/music.ts");
  const block = text.match(/export const NEWS(?:: [^=]+)? = \[([\s\S]*?)\n\];/);
  if (!block) return [];
  return [...block[1].matchAll(/^\s*slug:\s*"([^"]+)"/gm)].map((m) => m[1]);
}
for (const slug of newsSlugs()) {
  paths.add(`/news/${slug}`);
}

const shops = slugsFrom("public/sitemap.xml").filter((s) => false);
// Keep known shop pages from the previous sitemap.
for (const shop of [
  "tfoa",
  "django-guitars",
  "galerie-casanova",
  "castelluccia-shop",
  "gypsyguitar",
  "musik-heckmann",
  "london-guitar-studio",
  "the-guitar-bar",
]) {
  paths.add(`/shops/${shop}`);
}

const geo = read("src/lib/geo.ts");
const countryBlock = geo.match(/export const COUNTRY_OPTIONS = \[([\s\S]*?)\];/);
if (countryBlock) {
  for (const match of countryBlock[1].matchAll(/"([^"]+)"/g)) {
    const slug = countrySlug(match[1]);
    paths.add(`/world/${slug}`);
    paths.add(`/archive/${slug}`);
    paths.add(`/instruments/luthiers/${slug}`);
  }
}

// Seed concert detail pages (stable s-{legend}-{starts_at} ids).
const seed = read("src/lib/seed-data.ts");
const concertBlocks = seed.matchAll(
  /\{\s*legend_slug:\s*"([^"]+)"[\s\S]*?starts_at:\s*"([^"]+)"/g,
);
for (const match of concertBlocks) {
  paths.add(`/concerts/s-${match[1]}-${match[2]}`);
}

const urls = [...paths]
  .filter((p) => p.startsWith("/"))
  .sort((a, b) => a.localeCompare(b));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((path) => `  <url><loc>${HOST}${path === "/" ? "/" : path}</loc></url>`).join("\n")}
</urlset>
`;

writeFileSync(join(root, "public/sitemap.xml"), xml);
console.log(`Wrote public/sitemap.xml with ${urls.length} URLs`);
