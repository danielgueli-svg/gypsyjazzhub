import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/alhambra")({
  beforeLoad: () => {
    throw redirect({ to: "/stichting-alhambra" });
  },
  component: () => null,
});
