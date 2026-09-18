import { createFileRoute } from "@tanstack/react-router";
import { runArtistImport } from "@/lib/artist-import";
import { requestUrl } from "@/lib/runtime-env";

export const Route = createFileRoute("/api/artist-import")({
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
        try {
          const result = await runArtistImport();
          return Response.json({
            ok: true,
            fetched: result.fetched,
            parsed: result.parsed,
            ingested: result.ingested,
            sites: result.sites,
          });
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          console.error("[artist-import]", error);
          return Response.json(
            { ok: false, error: error.message, name: error.name },
            { status: 500 },
          );
        }
      },
    },
  },
});
