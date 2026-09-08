import { createFileRoute } from "@tanstack/react-router";
import { readConcertMedia } from "@/lib/concert-reviews";

function mediaId(request: Request, params: { id?: string } | undefined) {
  const fromParams = Number(params?.id);
  if (Number.isFinite(fromParams) && fromParams > 0) return fromParams;
  const last = new URL(request.url).pathname.split("/").filter(Boolean).pop() ?? "";
  const fromPath = Number(last);
  return Number.isFinite(fromPath) ? fromPath : 0;
}

export const Route = createFileRoute("/api/concert-media/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const row = await readConcertMedia(mediaId(request, params));
        if (!row) return new Response("Not found", { status: 404 });
        const mime = row.mime === "image/jpg" ? "image/jpeg" : row.mime;
        const allowed = mime === "image/jpeg" || mime === "image/png" || mime === "video/mp4";
        if (!allowed) return new Response("Not found", { status: 404 });
        const binary = Buffer.from(row.bytes, "base64");
        return new Response(binary, {
          headers: {
            "Content-Type": mime,
            "Content-Length": String(binary.byteLength),
            "Cache-Control": "public, max-age=86400",
            "Content-Disposition": `inline; filename="${row.filename.replace(/"/g, "")}"`,
          },
        });
      },
    },
  },
});
