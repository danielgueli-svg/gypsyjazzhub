import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/festivals/youtube")({
  beforeLoad: () => {
    throw redirect({ to: "/youtube" });
  },
});
