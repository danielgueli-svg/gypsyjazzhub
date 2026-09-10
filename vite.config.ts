import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
// @ts-expect-error JS plugin alongside the TS vite config
import { grokPwaPlugin } from "./scripts/grok-pwa-plugin.mjs";

/**
 * Finish PGLite bootstrap during dev-server setup (before traffic). Vite awaits
 * async `configureServer` hooks. Production: `src/lib/db` kicks `ensureDbReady`
 * on import.
 */
function pgliteBootstrapPlugin(): Plugin {
  return {
    name: "app-builder:pglite-bootstrap",
    apply: "serve",
    async configureServer(server) {
      try {
        const mod = (await server.ssrLoadModule("/src/lib/db.ts")) as {
          ensureDbReady?: () => Promise<void>;
        };
        if (typeof mod.ensureDbReady === "function") {
          await mod.ensureDbReady();
        }
      } catch (err) {
        console.error("[app-builder] DB bootstrap failed:", err);
        throw err;
      }
    },
  };
}

/**
 * Live-preview OAuth popup — handled HERE so the agent never has to create a
 * `/auth/popup` route (and cannot break it by scaffolding a React page that
 * paints the full app shell in the popup).
 *
 * `signIn` (client.ts) opens `/auth/popup?providerId=…` in a top-level window.
 * This middleware runs before TanStack Start, calls `handleAuthPopupRequest`,
 * and returns the 302 / completion HTML. Deployed apps do not use the popup
 * (full-page OAuth redirect), so `apply: "serve"` is enough.
 */
function authPopupPlugin(): Plugin {
  return {
    name: "app-builder:auth-popup",
    apply: "serve",
    configureServer(server) {
      // Register immediately (not in a returned post-hook) so we run BEFORE
      // TanStack Start / the SPA HTML fallback. A model-authored
      // `src/routes/auth/popup.tsx` React page must never win this path.
      server.middlewares.use(async (req, res, next) => {
        try {
          const rawUrl = req.url ?? "";
          const pathOnly = rawUrl.split("?", 1)[0] ?? "";
          if (pathOnly !== "/auth/popup") {
            next();
            return;
          }
          if ((req.method ?? "GET").toUpperCase() !== "GET") {
            res.statusCode = 405;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("Method Not Allowed");
            return;
          }

          const host = String(
            req.headers["x-forwarded-host"] ?? req.headers.host ?? "localhost:8080",
          );
          const proto = String(
            req.headers["x-forwarded-proto"] ??
              ((req.socket as { encrypted?: boolean } | undefined)?.encrypted ? "https" : "http"),
          );
          const requestHeaders = new Headers();
          for (const [key, value] of Object.entries(req.headers)) {
            if (value === undefined) continue;
            if (Array.isArray(value)) {
              for (const v of value) requestHeaders.append(key, v);
            } else {
              requestHeaders.set(key, value);
            }
          }
          // Ensure Host is the public preview host so Better Auth's dynamic
          // baseURL / redirect_uri match the popup origin.
          if (!requestHeaders.has("host")) requestHeaders.set("host", host);

          const request = new Request(`${proto}://${host}${rawUrl}`, {
            method: "GET",
            headers: requestHeaders,
          });

          const mod = (await server.ssrLoadModule("/src/lib/auth/popup.server.ts")) as {
            handleAuthPopupRequest: (req: Request) => Promise<Response>;
          };
          const response = await mod.handleAuthPopupRequest(request);

          res.statusCode = response.status;
          // Preserve multiple Set-Cookie headers (OAuth state + session).
          const setCookies =
            typeof response.headers.getSetCookie === "function"
              ? response.headers.getSetCookie()
              : [];
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === "set-cookie") return;
            res.setHeader(key, value);
          });
          for (const cookie of setCookies) {
            res.appendHeader("set-cookie", cookie);
          }
          const body = Buffer.from(await response.arrayBuffer());
          res.end(body);
        } catch (err) {
          console.error("[app-builder] /auth/popup handler failed:", err);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader("content-type", "text/plain; charset=utf-8");
            res.end("auth popup failed");
          }
        }
      });
    },
  };
}

/**
 * Safari / WebKit in the live preview often:
 *  - sends Accept without text/html (TanStack Start then returns JSON 500)
 *  - caches that JSON error and keeps showing it
 *  - surfaces aborted SSR as {"error":true,"status":500,"unhandled":true}
 * Force HTML Accept on page GETs, never cache, and replace JSON 500s with a
 * tiny HTML reload so Safari never paints the raw error object.
 */
function htmlNavPlugin(): Plugin {
  const fallback = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="1"><title>Gypsy Jazz Hub</title><style>html,body{margin:0;min-height:100%;background:#100c0a;color:#faf6ef;font-family:Georgia,serif}body{display:grid;place-items:center;padding:2rem;text-align:center}</style></head><body><p>Gypsy Jazz Hub</p></body></html>`;

  function isPageGet(req: { method?: string; url?: string }) {
    const method = (req.method ?? "GET").toUpperCase();
    if (method !== "GET" && method !== "HEAD") return false;
    const pathOnly = (req.url ?? "").split("?", 1)[0] ?? "";
    if (
      pathOnly.startsWith("/@") ||
      pathOnly.startsWith("/src/") ||
      pathOnly.startsWith("/node_modules") ||
      pathOnly.startsWith("/api/") ||
      pathOnly.startsWith("/__") ||
      pathOnly.startsWith("/auth/")
    ) {
      return false;
    }
    if (/\.[a-zA-Z0-9]+$/.test(pathOnly)) return false;
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

  function toBuf(chunk: unknown, encoding: unknown): Buffer {
    if (Buffer.isBuffer(chunk)) return chunk;
    if (typeof chunk === "string") {
      return Buffer.from(chunk, typeof encoding === "string" ? (encoding as BufferEncoding) : "utf8");
    }
    if (chunk instanceof Uint8Array) return Buffer.from(chunk);
    return Buffer.from(String(chunk ?? ""), "utf8");
  }

  return {
    name: "app-builder:html-nav",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!isPageGet(req)) {
          next();
          return;
        }

        const accept = String(req.headers.accept ?? "");
        if (!/\btext\/html\b/i.test(accept)) {
          req.headers.accept = "text/html,application/xhtml+xml,*/*;q=0.8";
        }

        res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");

        let aborted = false;
        const markAborted = () => {
          aborted = true;
        };
        req.on("aborted", markAborted);
        req.on("close", () => {
          if (!res.writableEnded) markAborted();
        });

        const originalWrite = res.write.bind(res);
        const originalEnd = res.end.bind(res);
        const chunks: Buffer[] = [];
        let mode: "unknown" | "pass" | "buffer" = "unknown";

        const passWrite = (chunk: unknown, encoding: unknown, cb: unknown) => {
          if (mode === "unknown") {
            const text = toBuf(chunk, encoding).toString("utf8");
            const start = text.trimStart();
            if (start.startsWith("{") || res.statusCode >= 400) {
              mode = "buffer";
              chunks.push(toBuf(chunk, encoding));
              if (typeof encoding === "function") encoding();
              else if (typeof cb === "function") (cb as () => void)();
              return true;
            }
            mode = "pass";
          }
          if (mode === "buffer") {
            chunks.push(toBuf(chunk, encoding));
            if (typeof encoding === "function") encoding();
            else if (typeof cb === "function") (cb as () => void)();
            return true;
          }
          return originalWrite(chunk as never, encoding as never, cb as never);
        };

        // @ts-expect-error node overloads
        res.write = (chunk?: unknown, encoding?: unknown, cb?: unknown) => {
          if (chunk == null || typeof chunk === "function") {
            return originalWrite(chunk as never, encoding as never, cb as never);
          }
          return passWrite(chunk, encoding, cb);
        };

        // @ts-expect-error node overloads
        res.end = (chunk?: unknown, encoding?: unknown, cb?: unknown) => {
          try {
            if (aborted || req.aborted) {
              if (!res.headersSent) {
                res.statusCode = 204;
                res.setHeader("content-type", "text/plain");
              }
              return originalEnd();
            }
            if (chunk && typeof chunk !== "function") {
              passWrite(chunk, encoding, undefined);
            }
            if (mode === "buffer" || res.statusCode >= 400) {
              const text = Buffer.concat(chunks).toString("utf8");
              if (looksLikeErrorJson(text) || res.statusCode >= 500) {
                res.statusCode = 200;
                res.setHeader("content-type", "text/html; charset=utf-8");
                return originalEnd(fallback);
              }
              for (const part of chunks) originalWrite(part);
              return originalEnd();
            }
          } catch {
            if (aborted || req.aborted) {
              try {
                return originalEnd();
              } catch {
                return res;
              }
            }
          }
          return originalEnd(chunk as never, encoding as never, cb as never);
        };

        next();
      });
    },
  };
}

// `0.0.0.0:8080` is the live-preview contract — don't change host/port.
// The dev server starts once `src/router.tsx` and `src/routes/` exist — see
// AGENTS.md § "First scaffold".
export default defineConfig(({ command, isPreview }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    },
    warmup: {
      clientFiles: [
        "./src/routes/__root.tsx",
        "./src/routes/index.tsx",
        "./src/components/world-globe.tsx",
        "./src/styles.css",
      ],
      ssrFiles: ["./src/router.tsx", "./src/routes/__root.tsx", "./src/routes/index.tsx"],
    },
  },
  preview: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    pgliteBootstrapPlugin(),
    htmlNavPlugin(),
    // Before tanstackStart so /auth/popup never falls through to the SPA.
    authPopupPlugin(),
    // PWA head + ?install=1 tutorial page; runs before Start/Nitro.
    grokPwaPlugin(),
    tailwindcss(),
    tanstackStart(),
    ...(command === "build" || isPreview
      ? [
          nitro({
            // Default Vercel for Grok preview builds. Set GROK_CF_WORKER=1 to
            // emit a Cloudflare Worker for gypsyjazzhub.com.
            preset: process.env.GROK_CF_WORKER === "1" ? "cloudflare_module" : "vercel",
            // Auto-registers server/middleware/* (the PWA install page +
            // manifest + head-tag middleware). Nitro v3 defaults serverDir to
            // false, so removing this silently unwires /?install=1 on deploys.
            serverDir: "./server",
          }),
        ]
      : []),
    viteReact(),
  ],
}));
