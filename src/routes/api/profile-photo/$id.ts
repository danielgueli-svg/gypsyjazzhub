import { createFileRoute } from "@tanstack/react-router";
import { readProfilePhoto } from "@/lib/profile-photos";
import { requestUrl } from "@/lib/runtime-env";

function photoUserId(request: Request, params: { id?: string } | undefined) {
  const fromParams = (params?.id ?? "").trim();
  if (fromParams) return decodeURIComponent(fromParams);
  const last = requestUrl(request).pathname.split("/").filter(Boolean).pop() ?? "";
  return decodeURIComponent(last);
}

export const Route = createFileRoute("/api/profile-photo/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const row = await readProfilePhoto(photoUserId(request, params));
        if (!row) return new Response("Not found", { status: 404 });
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
      },
    },
  },
});
