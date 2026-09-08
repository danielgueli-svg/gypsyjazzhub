import { createFileRoute, redirect } from "@tanstack/react-router";
import { romaniMusicCountryUrl } from "@/lib/romani-music";

export const Route = createFileRoute("/romani-music/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ href: romaniMusicCountryUrl(params.slug) });
  },
});
