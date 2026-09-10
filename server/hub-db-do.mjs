/**
 * Production SQLite for gypsyjazzhub.com (Cloudflare Durable Object).
 * Neon/Postgres is used when DATABASE_URL is set; this is the Worker fallback
 * so login, alerts, and the desk persist without a Neon URL.
 */
export class HubDb {
  constructor(state, _env) {
    this.state = state;
  }

  async fetch(request) {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "bad json" }, 400);
    }
    const sql = this.state.storage.sql;
    try {
      if (body.type === "batch" && Array.isArray(body.statements)) {
        const out = [];
        this.state.storage.transactionSync(() => {
          for (const statement of body.statements) {
            out.push(run(sql, statement.sql, statement.params));
          }
        });
        return json({ results: out });
      }
      const result = run(sql, body.sql, body.params);
      return json(result);
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : String(err) }, 500);
    }
  }
}

function run(sql, text, params) {
  const bindings = Array.isArray(params) ? params.map(bind) : [];
  try {
    const cursor = bindings.length ? sql.exec(String(text), ...bindings) : sql.exec(String(text));
    const rows = typeof cursor.toArray === "function" ? cursor.toArray() : [...cursor];
    const rowsWritten = typeof cursor.rowsWritten === "number" ? cursor.rowsWritten : 0;
    return { rows: rows ?? [], rowsWritten };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (/duplicate column|already exists/i.test(message)) {
      return { rows: [], rowsWritten: 0 };
    }
    throw err;
  }
}

function bind(value) {
  if (value === true) return 1;
  if (value === false) return 0;
  if (value instanceof Date) return value.toISOString();
  if (value === undefined) return null;
  return value;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
