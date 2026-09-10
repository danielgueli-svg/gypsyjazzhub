import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/camps")({
  beforeLoad: () => {
    throw redirect({ to: "/learn", hash: "camps", statusCode: 301 });
  },
  component: () => null,
});
