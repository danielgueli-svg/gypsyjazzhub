import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import { HubChat } from "@/components/hub-chat";
import { Button } from "@/components/ui/button";
import { CountryLabel } from "@/components/country-label";
import { mapsHref, telHref } from "@/lib/contact";
import { countrySlug } from "@/lib/geo";
import { getHubLuthier, listHubChat } from "@/lib/hub-api";
import { getLuthier } from "@/lib/luthiers";
import { SHOPS } from "@/lib/shops";

export const Route = createFileRoute("/luthiers/$slug")({
  loader: async ({ params }) => {
    const luthier =
      getLuthier(params.slug) ?? (await getHubLuthier({ data: params.slug }));
    if (!luthier) throw notFound();
    const chat = await listHubChat({ data: { kind: "luthier", slug: luthier.slug } });
    return { luthier, chat };
  },
  component: LuthierPage,
});

function LuthierPage() {
  const { luthier, chat } = Route.useLoaderData();
  const shop = SHOPS.find((row) => row.luthierSlug === luthier.slug);
  const call = telHref(luthier.phone);
  const map = mapsHref(luthier.address);
  const hasContact = Boolean(
    luthier.address || luthier.phone || luthier.email || luthier.site || luthier.hours,
  );

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">
        {luthier.craft === "bass"
          ? "Double bass luthier"
          : luthier.craft === "violin"
            ? "Violin luthier"
            : "Luthier"}
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{luthier.name}</h1>
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

      <article className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">About</h2>
        {luthier.note ? <p className="text-fg">{luthier.note}</p> : null}
        <p>{luthier.bio}</p>
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
                    <dd className="mt-1 text-base text-fg">
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
                    <dd className="mt-1 text-base text-fg">
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
