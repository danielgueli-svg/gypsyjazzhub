import { createFileRoute, redirect } from "@tanstack/react-router";
import { ROMANI_MUSIC_SITE } from "@/lib/romani-music";

export const Route = createFileRoute("/romani-music/origins")({
  beforeLoad: () => {
    throw redirect({ href: ROMANI_MUSIC_SITE });
  },
});
