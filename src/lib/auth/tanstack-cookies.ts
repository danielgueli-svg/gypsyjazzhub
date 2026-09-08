/**
 * Safer stand-in for better-auth's `tanstackStartCookies()`.
 *
 * The stock plugin does `const { setCookie } = await import("@tanstack/react-start/server")`.
 * On this TanStack Start build that named export is sometimes missing, so every
 * get-session (and every hub-desk save) throws:
 *   Cannot destructure property 'setCookie' of '(intermediate value)' as it is undefined
 *
 * Cookie writes still happen when `setCookie` is actually there. If it is not,
 * we no-op — session still authenticates via the cookie / bearer already on the
 * request.
 */
import { createAuthMiddleware } from "better-auth/api";
import { parseSetCookieHeader, toCookieOptions } from "better-auth/cookies";

export function safeTanstackCookies() {
  return {
    id: "tanstack-start-cookies-safe",
    hooks: {
      after: [
        {
          matcher: () => true,
          handler: createAuthMiddleware(async (ctx) => {
            const returned = ctx.context.responseHeaders;
            if ("_flag" in ctx && ctx._flag === "router") return;
            if (!(returned instanceof Headers)) return;
            const raw = returned.get("set-cookie");
            if (!raw) return;
            let setCookie: ((name: string, value: string, opts?: object) => void) | undefined;
            try {
              const mod = (await import("@tanstack/start-server-core")) as {
                setCookie?: (name: string, value: string, opts?: object) => void;
              };
              setCookie = typeof mod.setCookie === "function" ? mod.setCookie : undefined;
            } catch {
              return;
            }
            if (!setCookie) return;
            parseSetCookieHeader(raw).forEach((value, key) => {
              if (!key) return;
              try {
                setCookie(key, value.value, toCookieOptions(value));
              } catch {
                /* no H3 event in this call — skip */
              }
            });
          }),
        },
      ],
    },
  };
}
