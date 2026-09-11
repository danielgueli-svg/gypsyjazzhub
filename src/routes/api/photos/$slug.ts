import { createFileRoute } from "@tanstack/react-router";
import { readNamedPhoto } from "@/lib/profile-photos";
import { requestUrl } from "@/lib/runtime-env";

function photoSlug(request: Request, params: { slug?: string } | undefined) {
  const fromParams = (params?.slug ?? "").trim();
  if (fromParams) return decodeURIComponent(fromParams);
  const last = requestUrl(request).pathname.split("/").filter(Boolean).pop() ?? "";
  return decodeURIComponent(last);
}

function photoResponse(row: { mime: string; filename: string; bytes: string }) {
  const mime = row.mime === "image/jpg" ? "image/jpeg" : row.mime;
  if (mime !== "image/jpeg" && mime !== "image/png") {
    return new Response("Not found", { status: 404 });
  }
  const binary = Buffer.from(row.bytes, "base64");
  const name = (row.filename || "photo.jpg").replace(/"/g, "");
  return new Response(binary, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(binary.byteLength),
      "Cache-Control": "public, max-age=86400",
      "Content-Disposition": `inline; filename="${name}"`,
    },
  });
}

export const Route = createFileRoute("/api/photos/$slug")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const row = await readNamedPhoto(photoSlug(request, params));
        if (!row) return new Response("Not found", { status: 404 });
        return photoResponse(row);
      },
    },
  },
});
