import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/instruments/violins")({
  beforeLoad: () => {
    throw redirect({ to: "/instruments/other" });
  },
});
