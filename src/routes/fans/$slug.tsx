import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CountryLabel } from "@/components/country-label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFan } from "@/lib/fans";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/fans/$slug")({
  loader: async ({ params }) => {
    const fan = await getFan({ data: params.slug });
    if (!fan) throw notFound();
    return { fan };
  },
  component: FanPage,
});

function FanPage() {
  const { fan } = Route.useLoaderData();
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Link to="/fans" className="text-sm text-muted hover:text-fg">
        ← {t("nav.fans")}
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">{t("fans.kicker")}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl font-semibold sm:text-6xl">{fan.displayName}</h1>
        {fan.openForInvites ? <Badge>{t("fans.open")}</Badge> : null}
      </div>
      <p className="mt-3 text-muted">
        {fan.city ? `${fan.city} · ` : null}
        {fan.country ? <CountryLabel name={fan.country} /> : null}
      </p>
      {fan.bio ? (
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{fan.bio}</p>
      ) : null}
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted">{t("fans.pageLead")}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/add" search={{ kind: "jam" }}>
            {t("fans.organize")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/studio">{t("fans.desk")}</Link>
        </Button>
      </div>
    </main>
  );
}
