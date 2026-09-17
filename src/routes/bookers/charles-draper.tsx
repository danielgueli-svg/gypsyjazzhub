import { createFileRoute, Link } from "@tanstack/react-router";
import { GoldMedal } from "@/components/gold-medal";
import { Flag } from "@/components/flag";
import { CHARLES_DRAPER } from "@/lib/gold-members";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/bookers/charles-draper")({
  head: () =>
    pageHead({
      title: "Charles Draper — Jazz Booker Asia, Hong Kong",
      description:
        "Charles Draper, Jazz Booker Asia, based in Hong Kong. Gold member of Gypsy Jazz Hub.",
      path: CHARLES_DRAPER.path,
    }),
  component: CharlesDraperPage,
});

function CharlesDraperPage() {
  const { locale } = useI18n();
  const nl = locale === "nl";

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
        {nl ? "Goudlid" : "Gold member"}
      </p>
      <h1 className="mt-3 inline-flex flex-wrap items-baseline gap-3 font-display text-4xl font-semibold sm:text-6xl">
        {CHARLES_DRAPER.name}
        <GoldMedal className="size-7" />
      </h1>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-muted">
        <Flag name="Hong Kong" />
        {CHARLES_DRAPER.role} · {CHARLES_DRAPER.city}
      </p>

      <article className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        {nl ? (
          <>
            <p>
              Charles Draper is Jazz Booker Asia, gevestigd in Hongkong. Hij boekt
              jazz in Azië — zalen, tours, avonden. Op de hub is hij goudlid: een
              gouden medaille achter zijn naam.
            </p>
            <p>
              Schrijf je in met je naam <strong>Charles Draper</strong>. Je bent
              meteen goudlid. De welkomstmail is in het Nederlands. Posts gaan
              live zonder wachtrij.
            </p>
          </>
        ) : (
          <>
            <p>
              Charles Draper is Jazz Booker Asia, based in Hong Kong. He books
              jazz across Asia — venues, tours, nights. On this hub he is a gold
              member: a gold medal by his name.
            </p>
            <p>
              Join with the name <strong>Charles Draper</strong>. Gold membership
              is immediate. The welcome mail is in Dutch. Posts go live without a
              wait.
            </p>
          </>
        )}
        <p>
          <Link to="/world/$slug" params={{ slug: "hong-kong" }} className="text-fg hover:underline">
            {nl ? "Hongkong op de hub" : "Hong Kong on the hub"}
          </Link>
          {" · "}
          <Link to="/join" className="text-fg hover:underline">
            {nl ? "Inschrijven" : "Join the hub"}
          </Link>
        </p>
      </article>
    </main>
  );
}
