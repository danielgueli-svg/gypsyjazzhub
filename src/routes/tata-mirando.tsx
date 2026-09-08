import { createFileRoute, Link } from "@tanstack/react-router";
import { ArtistMusic } from "@/components/artist-music";
import { ArchiveClips } from "@/components/archive-clips";
import { ArtistNameLink } from "@/components/artist-name-link";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";
import { tataCopy } from "@/lib/tata-mirando-copy";
import { archiveVideosMatching } from "@/lib/archive-videos";
import { familyArchiveTerms } from "@/lib/families";

export const Route = createFileRoute("/tata-mirando")({
  head: () =>
    pageHead({
      title: "Tata Mirando — Dutch Sinti orchestra",
      description:
        "Joseph Weiss, Tata Mirando, and the Weiss family orchestra in the Netherlands: history, later houses, and where to listen.",
    }),
  component: TataMirandoPage,
});

function TataMirandoPage() {
  const { locale } = useI18n();
  const copy = tataCopy(locale);
  const clips = archiveVideosMatching(familyArchiveTerms("mirando"));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{copy.kicker}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{copy.title}</h1>
      <p className="mt-3 text-muted">{copy.subtitle}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        <Badge>Weiss family</Badge>
        <Badge>Netherlands</Badge>
        <Badge>Sinti orchestra</Badge>
      </div>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{copy.lead}</p>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {[copy.born, copy.instrument, copy.settled].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-surface p-5 shadow-border">
            <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{label}</p>
            <p className="mt-2 font-display text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      <article className="mt-12 max-w-2xl space-y-10 text-base leading-relaxed text-muted">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-3xl font-semibold text-fg">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4">
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{copy.documentary.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{copy.documentary.note}</p>
        <div className="mt-5 max-w-2xl">
          <YouTubeEmbed url={copy.documentary.url} title={copy.documentary.title} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{copy.chairsTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{copy.chairsLead}</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {copy.chairs.map((row) => (
            <li key={row.slug} className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="font-display text-xl font-semibold">
                <ArtistNameLink slug={row.slug} name={row.name} className="hover:underline" />
              </p>
              <p className="mt-1 text-sm text-muted">{row.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{copy.filmGroupsTitle}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">{copy.filmGroupsLead}</p>
        <div className="mt-5 grid gap-6">
          {copy.filmGroups.map((block) => (
            <div key={block.countrySlug} className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="font-display text-xl font-semibold">
                <Link
                  to="/world/$slug"
                  params={{ slug: block.countrySlug }}
                  className="hover:underline"
                >
                  {block.country}
                </Link>
              </p>
              {block.note ? <p className="mt-2 text-sm text-muted">{block.note}</p> : null}
              <ul className="mt-3 space-y-3">
                {block.groups.map((group) => (
                  <li key={group.slug}>
                    <Link
                      to="/groups/$slug"
                      params={{ slug: group.slug }}
                      className="font-medium text-fg hover:underline"
                    >
                      {group.name}
                    </Link>
                    <p className="mt-0.5 text-sm text-muted">{group.note}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{copy.laterTitle}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {copy.later.map((row) => (
            <li key={row.name} className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="font-display text-xl font-semibold">{row.name}</p>
              <p className="mt-1 text-sm text-muted">{row.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">{copy.listenTitle}</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {copy.clips.map((clip) => (
            <figure key={clip.url} className="space-y-2">
              <YouTubeEmbed url={clip.url} title={clip.title} />
              <figcaption className="text-sm text-muted">{clip.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <ArtistMusic slug="tata-mirando" name="Tata Mirando" />

      <section className="mt-12 max-w-2xl rounded-2xl bg-surface p-5 shadow-border">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">YouTube</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{copy.archiveTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{copy.archiveLead}</p>
        <p className="mt-3">
          <a
            href={copy.archiveUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-accent hover:underline"
          >
            {copy.archiveHandle} →
          </a>
        </p>
      </section>

      <ArchiveClips videos={clips} />

      <p className="mt-12 text-sm text-muted">
        <Link to="/world/$slug" params={{ slug: "netherlands" }} className="text-fg hover:underline">
          {copy.netherlands}
        </Link>
        {" · "}
        <Link to="/groups" className="text-fg hover:underline">
          Groups
        </Link>
      </p>
    </main>
  );
}
