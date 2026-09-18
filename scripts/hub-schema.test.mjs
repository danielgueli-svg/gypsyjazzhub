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

test("0032 seeds Yorkshire Gypsy Swing Collective bios without inventing McGee or concerts", () => {
  const files = migrationFiles();
  assert.ok(files.includes("0032_ygsc_bios.sql"), "0032_ygsc_bios.sql missing");
  const text = readFileSync(join(migrationsDir, "0032_ygsc_bios.sql"), "utf8");
  assert.match(text, /yorkshire-gypsy-swing-collective/);
  assert.match(text, /lewis-kilvington/);
  assert.match(text, /martin-chung/);
  assert.match(text, /james-munroe/);
  assert.match(text, /derek-magee/);
  assert.match(text, /christine-pinkard/);
  assert.match(text, /Derek Magee/);
  assert.doesNotMatch(text, /McGee/);
  assert.doesNotMatch(text, /insert into hub_concerts/i);
  assert.doesNotMatch(text, /insert into legend_concerts/i);
  const sqlite = pgToSqlite(text);
  assert.match(sqlite, /updated_at = datetime\('now'\)/);
});

test("0033 adds labelled links and photo_url on hub_artist_bios without a new image host", () => {
  const files = migrationFiles();
  assert.ok(files.includes("0033_artist_page_extras.sql"), "0033_artist_page_extras.sql missing");
  const text = readFileSync(join(migrationsDir, "0033_artist_page_extras.sql"), "utf8");
  assert.match(text, /alter table hub_artist_bios add column if not exists links/i);
  assert.match(text, /alter table hub_artist_bios add column if not exists photo_url/i);
  assert.doesNotMatch(text, /timestamptz[^\n]*default ''/i);
  assert.doesNotMatch(text, /insert into hub_concerts/i);
  const sqlite = pgToSqlite(text);
  assert.match(sqlite, /alter table hub_artist_bios add column links text not null default '\[\]'/i);
  assert.match(sqlite, /alter table hub_artist_bios add column photo_url text not null default ''/i);
});
