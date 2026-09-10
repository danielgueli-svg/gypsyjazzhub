import { createFileRoute } from "@tanstack/react-router";
import { runDjangoBooksImport } from "@/lib/djangobooks-import";
import { requestUrl } from "@/lib/runtime-env";

export const Route = createFileRoute("/api/djangobooks-import")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET || process.env.DIGEST_SECRET;
        const header = request.headers.get("authorization") ?? "";
        const query = requestUrl(request).searchParams.get("secret");
        const allowed =
          Boolean(secret) &&
          (header === `Bearer ${secret}` || (query !== null && query === secret));
        if (!allowed) {
          return new Response("Unauthorized", { status: 401 });
        }
        const result = await runDjangoBooksImport();
        return Response.json({
          ok: true,
          fetched: result.fetched,
          parsed: result.parsed,
          ingested: result.ingested,
          boards: result.boards,
        });
      },
    },
  },
});
