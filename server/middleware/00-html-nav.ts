/**
 * Deployed (Nitro) counterpart of the Vite htmlNavPlugin.
 * Safari / WebKit often:
 *  - send Accept without text/html → TanStack Start returns JSON 500
 *  - abort SSR mid-flight → {"error":true,"status":500,"unhandled":true}
 *  - cache that JSON and keep showing it
 * Force HTML Accept on document GETs and never paint the raw error object.
 *
 * Cloudflare Workers: request headers are immutable, and `event.req.url` can be
 * a relative path. Mutating headers or calling `new URL("")` throws
 * `Invalid URL string.` — clone a Request with an absolute href instead.
 */
const FALLBACK = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gypsy Jazz Hub</title><style>html,body{margin:0;min-height:100%;background:#100c0a;color:#faf6ef;font-family:Georgia,serif}body{display:grid;place-items:center;gap:1rem;padding:2rem;text-align:center}a{color:#e8c9a0}</style></head><body><p>Gypsy Jazz Hub</p><p><a href="/">Home</a></p><script>(function(){try{var k="gjh-retry:"+location.pathname;if(!sessionStorage.getItem(k)){sessionStorage.setItem(k,"1");location.reload();}}catch(e){}})();</script></body></html>`;
const PUBLIC_ORIGIN = "https://www.gypsyjazzhub.com";
const APEX_HOST = "gypsyjazzhub.com";
const WWW_ORIGIN = "https://www.gypsyjazzhub.com";
const PRIVATE_PAGE = /^\/(login|studio|join|welcome|verify-email|add|board|agenda|forgot-password|reset-password)(\/|$)/;
const HTML_CACHE_CONTROL = "public, s-maxage=120, stale-while-revalidate=600";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob: https:",
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  "connect-src 'self' https:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

function applySecurityHeaders(headers: Headers) {
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "SAMEORIGIN");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  headers.set("Content-Security-Policy", CSP);
}

function withSecurityHeaders(result: Response): Response {
  const headers = new Headers(result.headers);
  applySecurityHeaders(headers);
  return new Response(result.body, {
    status: result.status,
    statusText: result.statusText,
    headers,
  });
}

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
  const headers = new Headers({
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store, no-cache, must-revalidate, max-age=0",
    pragma: "no-cache",
  });
  applySecurityHeaders(headers);
  return new Response(FALLBACK, { status: 200, headers });
}

interface NavEvent {
  url: URL;
  req: { method: string; headers: Headers; url?: string };
}

function requestHost(event: NavEvent): string {
  const raw =
    event.req.headers.get("x-forwarded-host") ||
    event.req.headers.get("host") ||
    "";
  return raw.split(",")[0]!.trim().toLowerCase().split(":")[0]!;
}

function pagePathAndSearch(event: NavEvent): { path: string; search: string } {
  const raw = event.req.url || event.url?.href || "";
  try {
    const parsed = new URL(raw, WWW_ORIGIN);
    return { path: parsed.pathname || "/", search: parsed.search || "" };
  } catch {
    return {
      path: event.url?.pathname || "/",
      search: event.url?.search || "",
    };
  }
}

function stripTrailingSlash(path: string): string {
  if (path.length > 1 && path.endsWith("/")) {
    return path.replace(/\/+$/, "") || "/";
  }
  return path;
}

function redirect301(location: string): Response {
  const headers = new Headers({
    location,
    "cache-control": "public, max-age=86400",
  });
  applySecurityHeaders(headers);
  return new Response(null, { status: 301, headers });
}

/** One 301 to https://www… without a trailing slash (Google indexes that URL). */
function canonicalRedirect(event: NavEvent): Response | null {
  const method = (event.req.method ?? "GET").toUpperCase();
  if (method !== "GET" && method !== "HEAD") return null;
  const host = requestHost(event);
  const onHub = host === APEX_HOST || host === "www.gypsyjazzhub.com";
  if (!onHub) return null;
  const { path, search } = pagePathAndSearch(event);
  const skipSlash =
    path.startsWith("/api/") ||
    path.startsWith("/__") ||
    path.startsWith("/auth/") ||
    /\.[a-zA-Z0-9]+$/.test(path);
  const clean = skipSlash ? path : stripTrailingSlash(path);
  const needWww = host === APEX_HOST;
  const needSlash = clean !== path;
  if (!needWww && !needSlash) return null;
  return redirect301(`${WWW_ORIGIN}${clean}${search}`);
}

function requestHref(event: NavEvent): string {
  const raw = event.req.url || event.url?.href || "";
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") return parsed.href;
  } catch {
    /* relative or empty */
  }
  const host = event.req.headers.get("x-forwarded-host") || event.req.headers.get("host");
  const origin = host ? `https://${host.split(",")[0]!.trim()}` : PUBLIC_ORIGIN;
  const path = event.url?.pathname || (raw.startsWith("/") ? raw : "/") || "/";
  try {
    return new URL(path, origin).href;
  } catch {
    return `${PUBLIC_ORIGIN}/`;
  }
}

function cachesDefault(): Cache | null {
  try {
    const store = (globalThis as { caches?: { default?: Cache } }).caches?.default;
    return store ?? null;
  } catch {
    return null;
  }
}

function cacheableHtml(method: string, path: string) {
  return method.toUpperCase() === "GET" && isPageGet(method, path) && !PRIVATE_PAGE.test(path);
}

async function lookupHtml(href: string, method: string, path: string): Promise<Response | null> {
  if (!cacheableHtml(method, path)) return null;
  const cache = cachesDefault();
  if (!cache) return null;
  try {
    return (await cache.match(new Request(href, { method: "GET" }))) ?? null;
  } catch {
    return null;
  }
}

async function rememberHtml(
  href: string,
  method: string,
  path: string,
  result: Response,
): Promise<Response> {
  if (!cacheableHtml(method, path) || result.status !== 200) return withSecurityHeaders(result);
  if (result.headers.get("set-cookie")) return withSecurityHeaders(result);
  const ct = String(result.headers.get("content-type") ?? "");
  if (!ct.includes("text/html")) return withSecurityHeaders(result);

  const headers = new Headers(result.headers);
  headers.set("cache-control", HTML_CACHE_CONTROL);
  applySecurityHeaders(headers);
  const body = await result.arrayBuffer();
  const out = new Response(body, { status: 200, headers });
  const cache = cachesDefault();
  if (cache) {
    try {
      await cache.put(new Request(href, { method: "GET" }), out.clone());
    } catch {
      /* Cache API is optional — headers still help the browser. */
    }
  }
  return out;
}

function withHtmlAccept(event: NavEvent) {
  const href = requestHref(event);
  if (event.url) {
    try {
      event.url.href = href;
    } catch {
      /* URL may be frozen */
    }
  }
  try {
    const headers = new Headers(event.req.headers);
    headers.set("accept", "text/html,application/xhtml+xml,*/*;q=0.8");
    (event as unknown as { req: Request }).req = new Request(href, {
      method: event.req.method ?? "GET",
      headers,
    });
  } catch {
    try {
      event.req.headers.set("accept", "text/html,application/xhtml+xml,*/*;q=0.8");
    } catch {
      // Cloudflare Workers: request headers are immutable.
    }
  }
}

export default async function htmlNavMiddleware(
  event: NavEvent,
  next: () => unknown | Promise<unknown>,
): Promise<unknown> {
  const bounced = canonicalRedirect(event);
  if (bounced) return bounced;

  const method = event.req.method ?? "GET";
  const path = event.url?.pathname || "/";
  const page = isPageGet(method, path);

  if (page) withHtmlAccept(event);

  const href = requestHref(event);
  const cached = await lookupHtml(href, method, path);
  if (cached) return withSecurityHeaders(cached);

  try {
    const result = await next();
    if (!page || !(result instanceof Response)) return result;

    const ct = String(result.headers.get("content-type") ?? "");
    if (result.status < 400 && !ct.includes("json")) {
      return rememberHtml(href, method, path, result);
    }

    let text = "";
    try {
      text = await result.clone().text();
    } catch {
      if (result.status >= 500) return htmlOk();
      return withSecurityHeaders(result);
    }
    if (looksLikeErrorJson(text) || result.status >= 500) return htmlOk();
    return withSecurityHeaders(result);
  } catch (err) {
    if (isAbort(err)) {
      return new Response(null, { status: 204 });
    }
    if (page) return htmlOk();
    throw err;
  }
}
