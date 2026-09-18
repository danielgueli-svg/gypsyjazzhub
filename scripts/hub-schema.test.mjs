import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

const migrationsDir = join(dirname(fileURLToPath(import.meta.url)), "..", "migrations");

function migrationFiles() {
  return readdirSync(migrationsDir)
    .filter((name) => name.endsWith(".sql"))
    .sort();
}

function allMigrationSql() {
  return migrationFiles()
    .map((name) => `-- ${name}\n${readFileSync(join(migrationsDir, name), "utf8")}`)
    .join("\n");
}

/** Same conversions HubDb SQLite uses in src/lib/do-sql.ts. */
function pgToSqlite(sql) {
  return sql
    .replace(/id\s+serial\s+primary\s+key/gi, "id integer primary key autoincrement")
    .replace(/\bserial\b/gi, "integer")
    .replace(/\bboolean\b/gi, "integer")
    .replace(/\btimestamptz\b/gi, "text")
    .replace(/\btimestamp\b/gi, "text")
    .replace(/\bdate\b/gi, "text")
    .replace(/default\s+now\(\)/gi, "default (datetime('now'))")
    .replace(/\bnow\(\)/gi, "datetime('now')")
    .replace(/\btrue\b/gi, "1")
    .replace(/\bfalse\b/gi, "0")
    .replace(/add column if not exists/gi, "add column");
}

test("hub_artist_bios and hub_concerts.source_id are in numbered migrations", () => {
  const files = migrationFiles();
  assert.ok(files.includes("0031_artist_bios.sql"), "0031_artist_bios.sql missing");
  const text = allMigrationSql();
  assert.match(text, /create table if not exists hub_artist_bios/i);
  assert.match(text, /alter table hub_concerts add column if not exists source_id/i);
  assert.doesNotMatch(
    readFileSync(join(migrationsDir, "0031_artist_bios.sql"), "utf8"),
    /timestamptz[^\n]*default ''/i,
  );
});

test("Workers SQLite rewrite of 0031 keeps a now() default, not empty string", () => {
  const text = readFileSync(join(migrationsDir, "0031_artist_bios.sql"), "utf8");
  const sqlite = pgToSqlite(text);
  assert.match(sqlite, /create table if not exists hub_artist_bios/i);
  assert.match(sqlite, /updated_at text not null default \(datetime\('now'\)\)/i);
  assert.match(sqlite, /alter table hub_concerts add column source_id text not null default ''/i);
});
