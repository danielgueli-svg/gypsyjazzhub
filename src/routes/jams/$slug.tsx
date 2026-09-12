import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { GoingRsvp } from "@/components/going-rsvp";
import { HubChat } from "@/components/hub-chat";
import { InvitePanel } from "@/components/invite-panel";
import { LegendCard } from "@/components/legend-card";
import { SaveButton } from "@/components/save-button";
import { SubscribeButton } from "@/components/subscribe-button";
import { ShareBox } from "@/components/share-page";
import { Badge } from "@/components/ui/badge";
import { listLegends } from "@/lib/api";
import { getJam, jamHours, jamMapsUrl, jamPlace, formatJamNext } from "@/lib/jams";
import { CountryLabel } from "@/components/country-label";
import { getHubJam, listHubChat } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";
import { settle } from "@/lib/settle";

export const Route = createFileRoute("/jams/$slug")({
  loader: async ({ params }) => {
    const jam = getJam(params.slug) ?? (await getHubJam({ data: params.slug }));
    if (!jam) throw notFound();
    const [legends, chat] = await Promise.all([
      listLegends(),
      settle("jam-chat", [], () => listHubChat({ data: { kind: "jam", slug: jam.slug } })),
    ]);
    const related = jam.relatedSlugs
      .map((slug) => legends.find((legend) => legend.slug === slug))
      .filter((legend) => Boolean(legend));
    return { jam, related, chat };
  },
  head: ({ loaderData, params }) => {
    const path = `/jams/${params.slug}`;
    const jam = loaderData?.jam;
    if (!jam) {
      return pageHead({ title: "Jam session", description: "Gypsy jazz jam session.", path });
    }
    return pageHead({
      title: `${jam.name} — gypsy jazz jam session`,
      description:
        jam.bio ||
        `${jam.name} is a gypsy jazz jam session in ${jam.city}, ${jam.country}.`,
      path,
    });
  },
  component: JamPage,
});

function JamPage() {
  const { jam, related, chat } = Route.useLoaderData();
  const { t } = useI18n();
  const place = jamPlace(jam);
  const hours = jamHours(jam);
  const maps = jamMapsUrl(jam);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
        {jam.kind === "meetup" ? t("jam.meetup") : t("jam.kicker")}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{jam.name}</h1>
      <p className="mt-3 text-muted">
        {jam.city} · <CountryLabel name={jam.country} />
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>{jam.kind === "meetup" ? t("jam.meetup") : jam.when}</Badge>
        {hours ? <Badge>{hours}</Badge> : null}
        <Badge>{jam.kind === "meetup" ? t("jam.oneNight") : t("jam.open")}</Badge>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <SaveButton kind="jam" slug={jam.slug} label="Save jam" />
        <SubscribeButton kind="jam" targetId={jam.slug} targetName={jam.name} label="Notify me" />
        <ShareBox
          compact
          url={`/jams/${jam.slug}`}
          title="Share this jam"
          text={`${jam.name}\n${jam.city}${jam.country ? ` · ${jam.country}` : ""}${hours ? `\n${hours}` : ""}\n${jam.bio || ""}`}
        />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("page.where")}</p>
          <p className="mt-2 font-display text-xl font-semibold leading-tight">{jam.venue || place}</p>
          {jam.address ? <p className="mt-2 text-sm leading-relaxed text-muted">{jam.address}</p> : null}
          {jam.city ? (
            <p className="mt-1 text-sm text-muted">
              {jam.city}
              {jam.country ? (
                <>
                  {" · "}
                  <CountryLabel name={jam.country} />
                </>
              ) : null}
            </p>
          ) : null}
          {maps ? (
            <a
              href={maps}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm hover:underline"
            >
              {t("jam.maps")}
            </a>
          ) : null}
        </div>
        <div className="rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("page.when")}</p>
          {hours ? (
            <p className="mt-2 font-display text-xl font-semibold">{hours}</p>
          ) : null}
          <p className={hours ? "mt-1 text-sm text-muted" : "mt-2 font-display text-xl font-semibold"}>
            {jam.when}
          </p>
          <p className="mt-4 text-[11px] tracking-[0.16em] text-faint uppercase">{t("page.next")}</p>
          <p className="mt-1 text-sm text-muted">{formatJamNext(jam)}</p>
          <GoingRsvp kind="jam" targetId={jam.slug} returnTo={`/jams/${jam.slug}`} />
        </div>
      </div>

      <p className="mt-10 max-w-2xl text-base leading-relaxed text-muted">{jam.bio}</p>

      <div className="mt-10">
        <InvitePanel
          jamSlug={jam.slug}
          jamName={jam.name}
          city={jam.city}
          country={jam.country}
          startsAt={jam.nextStartsAt}
        />
      </div>

      {jam.site ? (
        <p className="mt-6">
          <a
            href={jam.site}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-accent hover:underline"
          >
            {jam.site.includes("whatsapp")
              ? "WhatsApp community — updates and sessions"
              : jam.site.includes("djangobooks.com")
                ? "DjangoBooks thread"
                : "Follow / join"}
          </a>
        </p>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Players around this jam</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((legend) =>
              legend ? <LegendCard key={legend.slug} legend={legend} /> : null,
            )}
          </div>
        </section>
      ) : null}

      <HubChat kind="jam" slug={jam.slug} initial={chat} />

      <p className="mt-10 text-sm">
        <Link to="/jams" className="text-muted hover:text-fg">
          {t("jams.all")}
        </Link>
      </p>
    </main>
  );
}
