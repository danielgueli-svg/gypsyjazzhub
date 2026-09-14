import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/gradina-alhambra")({
  beforeLoad: () => {
    throw redirect({ to: "/venues/$slug", params: { slug: "gradina-alhambra" } });
  },
  component: () => null,
});
