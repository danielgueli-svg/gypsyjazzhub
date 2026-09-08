import { createFileRoute, Link } from "@tanstack/react-router";
import { upcomingJams } from "@/lib/jams";
import { SCHOOLS, YOUTUBE_CHANNELS } from "@/lib/scene-guide";
import { CountryLabel } from "@/components/country-label";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/scene")({
  component: ScenePage,
});

function ScenePage() {
  const { t } = useI18n();
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Amateur & online</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">The scene</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Gypsy jazz is decentralized and community-driven. Many excellent
        players remain semi-professional or local. Festivals mix professionals
        and amateurs; YouTube, Facebook Hot Club pages and online schools keep
        the rest of us in time. The style evolves while staying rooted in
        acoustic swing, virtuosic guitar, and Romani traditions.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Venues</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Rooms worldwide where you can try to get a concert, a jam, a festival
          night. Gypsy jazz stages first, then jazz and world houses — by country.
        </p>
        <Link
          to="/venues"
          className="mt-4 inline-block font-display text-xl font-semibold hover:underline"
        >
          Open the venue list
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Festivals & camps</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Major dates draw both billed names and amateurs in the workshops and
          late jams — Festival Django Reinhardt at Samois, DjangoFest Northwest,
          Django in June, Django à Gogo, London Gypsy Jazz Festival, Taipei
          Gypsy Jazz Festival, OzManouche, Midwest Gypsy Swing Fest, and the
          European camps in the Netherlands, Germany and Italy.
        </p>
        <Link
          to="/learn"
          className="mt-4 inline-block text-sm text-muted hover:text-fg"
        >
          Learn gypsy jazz — Gypsy camps
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">YouTube</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Search those names, or “gypsy jazz jam” and “Django style”. Amateurs
          upload covers, original takes and lessons.
        </p>
        <ul className="mt-5 space-y-3">
          {YOUTUBE_CHANNELS.map((channel) => (
            <li key={channel.name} className="rounded-2xl bg-surface p-5 shadow-border">
              <a
                href={channel.url}
                target="_blank"
                rel="noreferrer"
                className="font-display text-xl font-semibold hover:underline"
              >
                {channel.name}
              </a>
              <p className="mt-1 text-sm text-muted">{channel.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Schools</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Online rooms that support learners worldwide.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {SCHOOLS.filter((school) => !school.artistOnly).map((school) => (
            <a
              key={school.name}
              href={school.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
            >
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                {school.place}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{school.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{school.bio}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Jams, Facebook & amateurs</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Facebook groups, local Hot Club pages and event listings connect
          amateurs. Upcoming chairs live on{" "}
          <Link to="/jams" className="text-fg hover:underline">
            {t("home.jams")}
          </Link>
          . For the latest: festival lineups, artist sites, Spotify, YouTube, or{" "}
          <a
            href="https://www.djangobooks.com/forum/"
            target="_blank"
            rel="noreferrer"
            className="text-fg hover:underline"
          >
            DjangoBooks
          </a>
          .
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {upcomingJams()
            .slice(0, 4)
            .map((jam) => (
              <Link
                key={jam.slug}
                to="/jams/$slug"
                params={{ slug: jam.slug }}
                className="block rounded-2xl bg-surface p-5 shadow-border hover:bg-raised"
              >
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                  {jam.city} · <CountryLabel name={jam.country} />
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold">{jam.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{jam.bio}</p>
              </Link>
            ))}
        </div>
        <Link to="/jams" className="mt-4 inline-block text-sm text-muted hover:text-fg">
          {t("jams.all")}
        </Link>
      </section>
    </main>
  );
}
