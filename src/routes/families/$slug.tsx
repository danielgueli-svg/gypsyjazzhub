import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArtistNameLink } from "@/components/artist-name-link";
import { ArchiveClips } from "@/components/archive-clips";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { Badge } from "@/components/ui/badge";
import { familyArchiveTerms, familyCard, getFamily, type Family } from "@/lib/families";
import { archiveVideosMatching } from "@/lib/archive-videos";
import { countrySlug } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/families/$slug")({
  beforeLoad: ({ params }) => {
    if (params.slug === "mirando") throw redirect({ to: "/tata-mirando" });
  },
  head: ({ params }) => {
    const family = getFamily(params.slug);
    return pageHead({
      title: family ? `${family.name} — gypsy jazz` : "Family",
      description: family?.summary ?? "Sinti and Manouche family houses on Gypsy Jazz Hub.",
      path: `/families/${params.slug}`,
    });
  },
  loader: ({ params }): { family: Family } => {
    const family = getFamily(params.slug);
    if (!family) throw notFound();
    return { family };
  },
  component: FamilyPage,
});

function FamilyPage() {
  const { family } = Route.useLoaderData() as { family: Family };
  const { locale } = useI18n();
  const card = familyCard(family, locale);
  const world = countrySlug(family.country);
  const clips = archiveVideosMatching(familyArchiveTerms(family.slug));

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{card.kicker}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{card.name}</h1>
      <p className="mt-3 max-w-2xl text-muted">{card.summary}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(family.countries ?? [family.country]).map((country) => (
          <Badge key={country}>{country}</Badge>
        ))}
        <Badge>Family</Badge>
      </div>

      <article className="mt-12 max-w-2xl space-y-10 text-base leading-relaxed text-muted">
        {family.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-3xl font-semibold text-fg">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 48)} className="mt-4">
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>

      {family.members.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-3xl font-semibold">Players</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {family.members.map((member) => (
              <li key={member.slug} className="rounded-2xl bg-surface p-5 shadow-border">
                <p className="font-display text-xl font-semibold">
                  <ArtistNameLink slug={member.slug} name={member.name} className="hover:underline" />
                </p>
                <p className="mt-1 text-sm text-muted">{member.role}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {family.clip ? (
        <section className="mt-12 max-w-2xl">
          <h2 className="font-display text-3xl font-semibold">Watch</h2>
          <div className="mt-5">
            <YouTubeEmbed url={family.clip.url} title={family.clip.title} />
            <p className="mt-2 text-sm text-muted">{family.clip.title}</p>
          </div>
        </section>
      ) : null}

      <ArchiveClips videos={clips} />

      <p className="mt-12 text-sm text-muted">
        <Link to="/world/$slug" params={{ slug: world }} className="text-fg hover:underline">
          {family.country}
        </Link>
        {" · "}
        <Link to="/archive/$slug" params={{ slug: world }} className="text-fg hover:underline">
          Archive
        </Link>
        {family.slug === "reinhardt" ? (
          <>
            {" · "}
            <Link to="/django" className="text-fg hover:underline">
              Django Reinhardt
            </Link>
          </>
        ) : null}
      </p>
    </main>
  );
}
