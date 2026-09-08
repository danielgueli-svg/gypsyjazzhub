/**
 * Deployed (Nitro) counterpart of the Vite htmlNavPlugin.
 * Safari / WebKit often:
 *  - send Accept without text/html → TanStack Start returns JSON 500
 *  - abort SSR mid-flight → {"error":true,"status":500,"unhandled":true}
 *  - cache that JSON and keep showing it
 * Force HTML Accept on document GETs and never paint the raw error object.
 */
const FALLBACK = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="1"><title>Gypsy Jazz Hub</title><style>html,body{margin:0;min-height:100%;background:#100c0a;color:#faf6ef;font-family:Georgia,serif}body{display:grid;place-items:center;padding:2rem;text-align:center}</style></head><body><p>Gypsy Jazz Hub</p></body></html>`;

function isPageGet(method: string, path: string) {
  const m = method.toUpperCase();
  if (m !== "GET" && m !== "HEAD") return false;
  if (
    path.startsWith("/api/") ||
    path.startsWith("/__") ||
    path.startsWith("/auth/") ||
    path.startsWith("/@")
  ) {
    return false;
  }
  if (/\.[a-zA-Z0-9]+$/.test(path)) return false;
  return true;
}

function looksLikeErrorJson(body: string) {
  const start = body.trimStart();
  if (!start.startsWith("{")) return false;
  return (
    start.includes('"unhandled"') ||
    start.includes("Only HTML requests") ||
    start.includes('"error":true') ||
    start.includes('"error": true') ||
    start.includes('"status":500')
  );
}

function isAbort(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  const name = err instanceof Error ? err.name : "";
  return (
    name === "AbortError" ||
    /aborted|ECONNRESET|EPIPE|undici/i.test(msg)
  );
}

function htmlOk() {
  return new Response(FALLBACK, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
      pragma: "no-cache",
    },
  });
}

interface NavEvent {
  url: URL;
  req: { method: string; headers: Headers };
}

export default async function htmlNavMiddleware(
  event: NavEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const method = event.req.method ?? "GET";
  const path = event.url.pathname;
  const page = isPageGet(method, path);

  if (page) {
    event.req.headers.set("accept", "text/html,application/xhtml+xml,*/*;q=0.8");
  }

  try {
    const result = await next();
    if (!page || !(result instanceof Response)) return result;

    const ct = String(result.headers.get("content-type") ?? "");
    if (result.status < 400 && !ct.includes("json")) return result;

    let text = "";
    try {
      text = await result.clone().text();
    } catch {
      if (result.status >= 500) return htmlOk();
      return result;
    }
    if (looksLikeErrorJson(text) || result.status >= 500) return htmlOk();
    return result;
  } catch (err) {
    if (isAbort(err)) {
      return new Response(null, { status: 204 });
    }
    if (page) return htmlOk();
    throw err;
  }
}
