import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";
import { withAbsoluteRequest } from "@/lib/runtime-env";

async function handleAuth(request: Request) {
  try {
    const res = await auth.handler(withAbsoluteRequest(request));
    if (res.status >= 500) {
      const clone = res.clone();
      const body = await clone.text();
      if (!body.trim()) {
        return Response.json(
          {
            message:
              "Could not join. Email sign-in failed on this host — try Google, or try again in a minute.",
            code: "AUTH_EMPTY",
          },
          { status: 500 },
        );
      }
    }
    return res;
  } catch (err) {
    console.error("[auth]", err);
    const message = err instanceof Error ? err.message : "Could not join.";
    return Response.json({ message, code: "AUTH_HANDLER" }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handleAuth(request),
      POST: ({ request }) => handleAuth(request),
    },
  },
});
