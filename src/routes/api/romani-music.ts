import { createFileRoute } from "@tanstack/react-router";
import { romaniMusicExport } from "@/lib/romani-music";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=300",
};

export const Route = createFileRoute("/api/romani-music")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async () =>
        Response.json(romaniMusicExport(), {
          headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" },
        }),
    },
  },
});
