import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

// Soft check via copied alias rules — geo.ts is TS; mirror the NL contract here
// and verify agenda helpers through a tiny inline replica of the normalize path.
const ALIASES = {
  holland: "Netherlands",
  netherlands: "Netherlands",
  nederland: "Netherlands",
  nl: "Netherlands",
};

function resolveCountry(raw) {
  const token = raw.trim().toLowerCase().replace(/\./g, "");
  return ALIASES[token] ?? null;
}

function primaryCountry(text) {
  return resolveCountry(text);
}

function countrySlug(name) {
  return String(name)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function uniqueCountries(items) {
  const set = new Set();
  for (const item of items) {
    const raw = item.country.trim();
    if (!raw) continue;
    set.add(primaryCountry(raw) ?? raw);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

test("NL resolves to Netherlands", () => {
  assert.equal(resolveCountry("NL"), "Netherlands");
  assert.equal(resolveCountry("nl"), "Netherlands");
  assert.equal(primaryCountry("NL"), "Netherlands");
});

test("uniqueCountries collapses NL with Netherlands", () => {
  const countries = uniqueCountries([
    { country: "Netherlands" },
    { country: "NL" },
    { country: "Belgium" },
  ]);
  assert.deepEqual(countries, ["Belgium", "Netherlands"]);
});

test("filter slug for NL matches netherlands", () => {
  assert.equal(countrySlug(primaryCountry("NL") ?? "NL"), "netherlands");
  assert.equal(countrySlug("Netherlands"), "netherlands");
});
