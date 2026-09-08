import { createFileRoute, Link } from "@tanstack/react-router";
import { CountryLabel } from "@/components/country-label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { listFans } from "@/lib/fans";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/fans/")({
  loader: async () => ({ fans: await listFans() }),
  component: FansPage,
});

function FansPage() {
  const { fans } = Route.useLoaderData();
  const { t } = useI18n();
  const open = fans.filter((row) => row.openForInvites).length;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("fans.kicker")}</p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-6xl">
        {t("fans.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {t("fans.lead")}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to="/join">{t("fans.join")}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/studio">{t("fans.desk")}</Link>
        </Button>
      </div>
      <p className="mt-8 text-sm text-muted">
        {fans.length} {t("fans.count")}
        {open ? ` · ${open} ${t("fans.openCount")}` : ""}
      </p>

      {fans.length === 0 ? (
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted">{t("fans.empty")}</p>
      ) : (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {fans.map((fan) => (
            <li key={fan.slug}>
              <Link
                to="/fans/$slug"
                params={{ slug: fan.slug }}
                className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-display text-xl font-semibold leading-tight">{fan.displayName}</p>
                  {fan.openForInvites ? <Badge>{t("fans.open")}</Badge> : null}
                </div>
                <p className="mt-1 text-sm text-muted">
                  {fan.city ? `${fan.city} · ` : null}
                  {fan.country ? <CountryLabel name={fan.country} /> : null}
                </p>
                {fan.bio ? (
                  <p className="mt-3 text-sm leading-relaxed text-muted">{fan.bio}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
