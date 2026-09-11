/**
 * Cloudflare Durable Object SQLite client + Kysely dialect for Better Auth.
 */
import {
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
  type DatabaseConnection,
  type DatabaseIntrospector,
  type Dialect,
  type Driver,
  type Kysely,
  type QueryCompiler,
  type QueryResult,
  type TransactionSettings,
  CompiledQuery,
} from "kysely";
import type { Sql } from "@/lib/db";

type DoNamespace = {
  idFromName: (name: string) => unknown;
  get: (id: unknown) => { fetch: (input: Request) => Promise<Response> };
};

function workerEnv(): { HUB_DB?: DoNamespace } | undefined {
  return (globalThis as { __env__?: { HUB_DB?: DoNamespace } }).__env__;
}

export function hubDbNamespace(): DoNamespace | undefined {
  return workerEnv()?.HUB_DB;
}

export function pgToSqlite(sql: string): string {
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

function sqlStatements(sql: string): string[] {
  return sql
    .split(/;\s*(?:\n|$)/)
    .map((part) =>
      part
        .split("\n")
        .filter((line) => {
          const trimmed = line.trim();
          return trimmed && !trimmed.startsWith("--");
        })
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
}

function placeholders(text: string, params: unknown[]): { sql: string; params: unknown[] } {
  if (!/\$\d+/.test(text)) return { sql: pgToSqlite(text), params };
  const used = [...text.matchAll(/\$(\d+)/g)].map((m) => Number(m[1]));
  return {
    sql: pgToSqlite(text).replace(/\$(\d+)/g, "?"),
    params: used.map((n) => params[n - 1]),
  };
}

async function callDo(
  stub: { fetch: (input: Request) => Promise<Response> },
  payload: unknown,
): Promise<{ rows: Record<string, unknown>[]; rowsWritten?: number; error?: string }> {
  const res = await stub.fetch(
    new Request("https://hub-db.internal/sql", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    }),
  );
  const data = (await res.json()) as {
    rows?: Record<string, unknown>[];
    rowsWritten?: number;
    results?: unknown;
    error?: string;
  };
  if (!res.ok || data.error) {
    throw new Error(data.error || `hub-db ${res.status}`);
  }
  return { rows: data.rows ?? [], rowsWritten: data.rowsWritten };
}

export function hubDbStub() {
  const ns = hubDbNamespace();
  if (!ns) return null;
  return ns.get(ns.idFromName("gypsy-jazz-hub"));
}

export async function runDoSql(
  text: string,
  params: unknown[] = [],
): Promise<Record<string, unknown>[]> {
  const stub = hubDbStub();
  if (!stub) throw new Error("HUB_DB binding missing");
  const q = placeholders(text, params);
  const result = await callDo(stub, { type: "query", sql: q.sql, params: q.params });
  return result.rows;
}

function toSqlFromDo(): Sql {
  const sql = (async <T = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): Promise<T[]> => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return (await runDoSql(text, values)) as T[];
  }) as unknown as Sql;
  sql.query = async <T = Record<string, unknown>>(text: string, params: unknown[] = []) =>
    (await runDoSql(text, params)) as T[];
  return sql;
}

const AUTH_TABLES_SQL = `
create table if not exists "user" (
  "id" text not null primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" integer not null,
  "image" text,
  "createdAt" text not null default (datetime('now')),
  "updatedAt" text not null default (datetime('now'))
);
create table if not exists "session" (
  "id" text not null primary key,
  "expiresAt" text not null,
  "token" text not null unique,
  "createdAt" text not null default (datetime('now')),
  "updatedAt" text not null,
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references "user" ("id") on delete cascade
);
create table if not exists "account" (
  "id" text not null primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references "user" ("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" text,
  "refreshTokenExpiresAt" text,
  "scope" text,
  "password" text,
  "createdAt" text not null default (datetime('now')),
  "updatedAt" text not null
);
create table if not exists "verification" (
  "id" text not null primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" text not null,
  "createdAt" text not null default (datetime('now')),
  "updatedAt" text not null default (datetime('now'))
);
create index if not exists "session_userId_idx" on "session" ("userId");
create index if not exists "account_userId_idx" on "account" ("userId");
create index if not exists "verification_identifier_idx" on "verification" ("identifier");
`;

export async function migrateDoSql(): Promise<void> {
  const stub = hubDbStub();
  if (!stub) return;
  await callDo(stub, {
    type: "query",
    sql: "create table if not exists _migrations (name text primary key, applied_at text not null default (datetime('now')))",
    params: [],
  });
  const doneRows = await runDoSql("select name from _migrations");
  const done = new Set(doneRows.map((row) => String(row.name)));
  const tables = await runDoSql(
    "select name from sqlite_master where type = 'table' and name = 'user'",
  );
  if (!tables.length) {
    done.delete("0001_auth.sql");
    await runDoSql("delete from _migrations where name = $1", ["0001_auth.sql"]);
  }
  const migrations = import.meta.glob("/migrations/*.sql", {
    query: "?raw",
    import: "default",
    eager: true,
  }) as Record<string, string>;
  for (const [path, text] of Object.entries(migrations).sort(([a], [b]) => a.localeCompare(b))) {
    const name = path.split("/").pop() as string;
    if (done.has(name)) continue;
    const parts = sqlStatements(pgToSqlite(text));
    await callDo(stub, {
      type: "batch",
      statements: [
        ...parts.map((sql) => ({ sql, params: [] as unknown[] })),
        { sql: "insert into _migrations (name) values (?)", params: [name] },
      ],
    });
  }
  const stillMissing = await runDoSql(
    "select name from sqlite_master where type = 'table' and name = 'user'",
  );
  if (!stillMissing.length) {
    await callDo(stub, {
      type: "batch",
      statements: sqlStatements(AUTH_TABLES_SQL).map((sql) => ({ sql, params: [] as unknown[] })),
    });
  }
}

export async function createDoSql(): Promise<Sql> {
  await migrateDoSql();
  return toSqlFromDo();
}

class DoConnection implements DatabaseConnection {
  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const stub = hubDbStub();
    if (!stub) throw new Error("HUB_DB binding missing");
    const result = await callDo(stub, {
      type: "query",
      sql: compiledQuery.sql,
      params: [...compiledQuery.parameters],
    });
    return {
      rows: result.rows as O[],
      numAffectedRows: BigInt(result.rowsWritten ?? result.rows.length),
    };
  }

  async *streamQuery<O>(
    compiledQuery: CompiledQuery,
    chunkSize: number,
  ): AsyncIterableIterator<QueryResult<O>> {
    const result = await this.executeQuery<O>(compiledQuery);
    const rows = result.rows;
    for (let i = 0; i < rows.length; i += chunkSize) {
      yield { rows: rows.slice(i, i + chunkSize) };
    }
  }
}

class DoDriver implements Driver {
  private connection: DoConnection | undefined;

  async init(): Promise<void> {
    await migrateDoSql();
  }
  async acquireConnection(): Promise<DatabaseConnection> {
    this.connection ??= new DoConnection();
    return this.connection;
  }
  async releaseConnection(): Promise<void> {}
  async beginTransaction(_conn: DatabaseConnection, _settings: TransactionSettings): Promise<void> {}
  async commitTransaction(_conn: DatabaseConnection): Promise<void> {}
  async rollbackTransaction(_conn: DatabaseConnection): Promise<void> {}
  async destroy(): Promise<void> {
    this.connection = undefined;
  }
}

export function doSqliteDialect(): Dialect {
  return {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DoDriver(),
    createQueryCompiler: (): QueryCompiler => new SqliteQueryCompiler(),
    createIntrospector: (db: Kysely<unknown>): DatabaseIntrospector => new SqliteIntrospector(db),
  };
}
