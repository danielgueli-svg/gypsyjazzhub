import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import { ArtistBioEdit } from "@/components/artist-bio-edit";
import { HubChat } from "@/components/hub-chat";
import { RelatedPages } from "@/components/related-pages";
import { PageLinks } from "@/components/page-links";
import { Portrait } from "@/components/portrait";
import { Button } from "@/components/ui/button";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { CountryLabel } from "@/components/country-label";
import { mapsHref, telHref } from "@/lib/contact";
import { countrySlug } from "@/lib/geo";
import { getHubLuthier, listHubChat, getHubArtistBio } from "@/lib/hub-api";
import { getLuthier } from "@/lib/luthiers";
import { artistSlugForLuthier } from "@/lib/related-pages";
import { catalogLegend, getMusician } from "@/lib/api";
import { settle } from "@/lib/settle";
import { makerBio } from "@/lib/maker-copy";
import { useI18n } from "@/lib/i18n";
import { luthierPhotoSrc } from "@/lib/photos";
import { SHOPS } from "@/lib/shops";

export const Route = createFileRoute("/luthiers/$slug")({
  loader: async ({ params }) => {
    const luthier =
      getLuthier(params.slug) ?? (await getHubLuthier({ data: params.slug }));
    if (!luthier) throw notFound();
    const [chat, hubPage] = await Promise.all([
      listHubChat({ data: { kind: "luthier", slug: luthier.slug } }),
      settle("luthier-hub-page", null, () => getHubArtistBio({ data: luthier.slug })),
    ]);
    const mapped = artistSlugForLuthier(luthier.slug);
    const same = catalogLegend(luthier.slug);
    let musicianSlug = mapped ?? same?.slug ?? null;
    if (!musicianSlug) {
      const member = await settle("luthier-musician", null, () => getMusician({ data: luthier.slug }));
      if (member && member.memberKind !== "fan") musicianSlug = member.slug;
    }
    return { luthier, chat, musicianSlug, hubPage };
  },
  component: LuthierPage,
});

function LuthierPage() {
  const { luthier, chat, musicianSlug, hubPage } = Route.useLoaderData();
  const { locale } = useI18n();
  const bio = hubPage?.bio.trim() || makerBio(luthier.slug, locale) || luthier.bio;
  const shop = SHOPS.find((row) => row.luthierSlug === luthier.slug);
  const call = telHref(luthier.phone);
  const map = mapsHref(luthier.address);
  const hasContact = Boolean(
    luthier.address || luthier.phone || luthier.email || luthier.site || luthier.hours,
  );
  const photo = hubPage?.photoUrl.trim() || luthierPhotoSrc(luthier.slug);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <div className="flex items-start gap-4 sm:gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
            {luthier.craft === "bass"
              ? "Double bass luthier"
              : luthier.craft === "violin"
                ? "Violin luthier"
                : luthier.craft === "accordion"
                  ? "Accordion atelier"
                  : luthier.craft === "other"
                    ? "Other maker"
                    : "Luthier"}
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-6xl">{luthier.name}</h1>
          <p className="mt-3 text-muted">
            {luthier.city ? `${luthier.city} · ` : null}
            <Link
              to="/world/$slug"
              params={{ slug: countrySlug(luthier.country) }}
              className="hover:text-fg"
            >
              <CountryLabel name={luthier.country} />
            </Link>
          </p>
          <RelatedPages
            current="luthier"
            musicianSlug={musicianSlug}
            luthierSlug={luthier.slug}
          />
        </div>
        {photo ? (
          <Portrait
            src={photo}
            alt={`${luthier.name} in the workshop`}
            className="h-auto w-28 max-h-80 shrink-0 rounded-2xl object-contain object-top shadow-border sm:w-40 sm:max-h-[22rem] lg:w-64"
          />
        ) : null}
      </div>
      <article className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">About</h2>
        {luthier.note ? <p className="text-fg">{luthier.note}</p> : null}
        <p>{bio}</p>
        {luthier.craft === "bass" ? (
          <p>
            <Link to="/luthiers/bass" className="text-fg hover:underline">
              All double bass luthiers
            </Link>
          </p>
        ) : null}
        {luthier.craft === "violin" ? (
          <p>
            <Link to="/luthiers/violin" className="text-fg hover:underline">
              All violin luthiers
            </Link>
          </p>
        ) : null}
        {luthier.craft === "accordion" ? (
          <p>
            <Link to="/luthiers/accordion" className="text-fg hover:underline">
              All accordion ateliers
            </Link>
          </p>
        ) : null}
        {shop ? (
          <p>
            Also a retail shop —{" "}
            <Link
              to="/shops/$slug"
              params={{ slug: shop.slug }}
              className="text-fg hover:underline"
            >
              address, phone and hours
            </Link>
            .
          </p>
        ) : null}
      </article>

      <div className="max-w-2xl">
        <PageLinks
          catalog={luthier.site ? [{ href: luthier.site, label: "Website" }] : []}
          extra={hubPage?.links ?? []}
        />
        <ArtistBioEdit
          slug={luthier.slug}
          bio={hubPage?.bio.trim() || luthier.bio}
          links={hubPage?.links ?? []}
          photoUrl={hubPage?.photoUrl ?? ""}
          returnTo={`/luthiers/${luthier.slug}`}
        />
      </div>

      {luthier.youtubeUrl ? (
        <section className="mt-10 max-w-2xl">
          <h2 className="font-display text-3xl font-semibold">Hear it</h2>
          <p className="mt-3 mb-4 text-sm leading-relaxed text-muted">
            {luthier.youtubeTitle ?? "On YouTube"}
          </p>
          <YouTubeEmbed
            url={luthier.youtubeUrl}
            title={luthier.youtubeTitle ?? luthier.name}
          />
        </section>
      ) : null}

      {hasContact ? (
        <section className="mt-10 max-w-2xl">
          <h2 className="font-display text-3xl font-semibold">Contact</h2>
          <div className="mt-4 rounded-2xl bg-surface p-5 shadow-border sm:p-6">
            <dl className="space-y-4 text-sm">
              {luthier.address ? (
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                  <div>
                    <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Address</dt>
                    <dd className="mt-1 text-base text-fg">
                      {map ? (
                        <a href={map} target="_blank" rel="noreferrer" className="hover:underline">
                          {luthier.address}
                        </a>
                      ) : (
                        luthier.address
                      )}
                    </dd>
                  </div>
                </div>
              ) : null}
              {luthier.phone ? (
                <div className="flex gap-3">
                  <Phone className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                  <div>
                    <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Phone</dt>
                    <dd className="mt-1 text-base text-fg">
                      {call ? (
                        <a href={call} className="hover:underline">
                          {luthier.phone}
                        </a>
                      ) : (
                        luthier.phone
                      )}
                    </dd>
                  </div>
                </div>
              ) : null}
              {luthier.email ? (
                <div className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                  <div>
                    <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Email</dt>
                    <dd className="mt-1 break-all text-base text-fg">
                      <a href={`mailto:${luthier.email}`} className="hover:underline">
                        {luthier.email}
                      </a>
                    </dd>
                  </div>
                </div>
              ) : null}
              {luthier.site ? (
                <div className="flex gap-3">
                  <Globe className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                  <div>
                    <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Website</dt>
                    <dd className="mt-1 break-all text-base text-fg">
                      <a href={luthier.site} target="_blank" rel="noreferrer" className="hover:underline">
                        {luthier.site.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                      </a>
                    </dd>
                  </div>
                </div>
              ) : null}
              {luthier.hours ? (
                <div className="flex gap-3">
                  <Clock className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                  <div>
                    <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Hours</dt>
                    <dd className="mt-1 text-base text-fg">{luthier.hours}</dd>
                  </div>
                </div>
              ) : null}
            </dl>
          </div>
        </section>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        {luthier.site ? (
          <Button asChild>
            <a href={luthier.site} target="_blank" rel="noreferrer">
              Workshop site
            </a>
          </Button>
        ) : null}
        {luthier.email || luthier.contact ? (
          <Button asChild variant="outline">
            <a href={luthier.email ? `mailto:${luthier.email}` : luthier.contact} target="_blank" rel="noreferrer">
              Email
            </a>
          </Button>
        ) : null}
        {call ? (
          <Button asChild variant="outline">
            <a href={call}>Call</a>
          </Button>
        ) : null}
        {map ? (
          <Button asChild variant="outline">
            <a href={map} target="_blank" rel="noreferrer">
              Map
            </a>
          </Button>
        ) : null}
      </div>

      <HubChat kind="luthier" slug={luthier.slug} initial={chat} />
    </main>
  );
}
