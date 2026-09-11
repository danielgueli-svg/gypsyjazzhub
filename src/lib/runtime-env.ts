/** Public production origin — used when a Worker request has no absolute URL. */
export const PUBLIC_SITE_ORIGIN = "https://www.gypsyjazzhub.com";

/** Read an env var, treating empty/whitespace as unset. */
export function readEnv(key: string): string | undefined {
  const fromProcess =
    typeof process !== "undefined" ? process.env[key]?.trim() : undefined;
  if (fromProcess) return fromProcess;
  try {
    const env = (globalThis as { __env__?: Record<string, unknown> }).__env__;
    const value = env?.[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  } catch {
    /* Worker bindings may be missing at module load. */
  }
  return undefined;
}

/**
 * Cloudflare's workerd (Workers / Pages SSR). Detected from globals that exist
 * at isolate start — do not use this to guess Vercel/Node.
 */
export function isCloudflareWorker(): boolean {
  if (typeof window !== "undefined") return false;
  const g = globalThis as {
    WebSocketPair?: unknown;
    HTMLRewriter?: unknown;
    navigator?: { userAgent?: string };
  };
  if (typeof g.WebSocketPair === "function") return true;
  if (typeof g.HTMLRewriter === "function") return true;
  return g.navigator?.userAgent === "Cloudflare-Workers";
}

export function isAbsoluteHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function originFromHeaders(headers: Headers): string {
  const forwardedHost = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || headers.get("host")?.trim();
  if (!host || /[\s\0<>]/.test(host)) return PUBLIC_SITE_ORIGIN;
  const forwardedProto = headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto =
    forwardedProto === "http" || forwardedProto === "https"
      ? forwardedProto
      : host.includes("localhost") || host.startsWith("127.") || host.startsWith("[::1]")
        ? "http"
        : "https";
  return `${proto}://${host}`;
}

/** Build an absolute href workerd's `new URL` / `new Request` will accept. */
export function resolveRequestHref(rawUrl: string, headers?: Headers): string {
  if (isAbsoluteHttpUrl(rawUrl)) return rawUrl;
  const origin = headers ? originFromHeaders(headers) : PUBLIC_SITE_ORIGIN;
  const path = !rawUrl || rawUrl === "null" || rawUrl === "undefined" ? "/" : rawUrl;
  try {
    return new URL(path.startsWith("/") ? path : `/${path}`, origin).href;
  } catch {
    return `${PUBLIC_SITE_ORIGIN}/`;
  }
}

/** Parse a Fetch request URL without throwing `Invalid URL string` on Workers. */
export function requestUrl(request: Request): URL {
  return new URL(resolveRequestHref(request.url, request.headers));
}

/** Clone a request so its `.url` is an absolute http(s) href. */
export function withAbsoluteRequest(request: Request): Request {
  const href = resolveRequestHref(request.url, request.headers);
  if (href === request.url) return request;
  try {
    return new Request(href, request);
  } catch {
    return request;
  }
}
