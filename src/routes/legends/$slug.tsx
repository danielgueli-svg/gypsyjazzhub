import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/legends/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug === "django-reinhardt") throw redirect({ to: "/django" });
    if (params.slug === "stephane-grappelli") throw redirect({ to: "/grappelli" });
    if (params.slug === "tata-mirando") throw redirect({ to: "/tata-mirando" });
    throw redirect({
      to: "/musicians/$slug",
      params: { slug: params.slug },
      statusCode: 301,
    });
  },
  component: () => null,
});
