import { createFileRoute } from "@tanstack/react-router";
import { runMailQueueDigest } from "@/lib/mail-queue";
import { requestUrl } from "@/lib/runtime-env";

export const Route = createFileRoute("/api/mail-queue")({
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
        const result = await runMailQueueDigest();
        return Response.json(result);
      },
    },
  },
});
