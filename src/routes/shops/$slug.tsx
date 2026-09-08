import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, Globe, Mail, MapPin, Phone } from "lucide-react";
import { HubChat } from "@/components/hub-chat";
import { Button } from "@/components/ui/button";
import { CountryLabel } from "@/components/country-label";
import { countrySlug } from "@/lib/geo";
import { listHubChat } from "@/lib/hub-api";
import { getShop } from "@/lib/shops";
import { mapsHref, telHref } from "@/lib/contact";

export const Route = createFileRoute("/shops/$slug")({
  loader: async ({ params }) => {
    const shop = getShop(params.slug);
    if (!shop) throw notFound();
    const chat = await listHubChat({ data: { kind: "shop", slug: shop.slug } });
    return { shop, chat };
  },
  component: ShopPage,
});

function ShopPage() {
  const { shop, chat } = Route.useLoaderData();
  const call = telHref(shop.phone);
  const map = mapsHref(shop.address);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Guitar shop</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">{shop.name}</h1>
      <p className="mt-3 text-muted">
        {shop.city ? `${shop.city} · ` : null}
        <Link
          to="/world/$slug"
          params={{ slug: countrySlug(shop.country) }}
          className="hover:text-fg"
        >
          <CountryLabel name={shop.country} />
        </Link>
      </p>

      <article className="mt-10 max-w-2xl space-y-5 text-base leading-relaxed text-muted">
        <h2 className="font-display text-3xl font-semibold text-fg">About</h2>
        <p>{shop.bio}</p>
        {shop.luthierSlug ? (
          <p>
            Also listed among{" "}
            <Link
              to="/luthiers/$slug"
              params={{ slug: shop.luthierSlug }}
              className="text-fg hover:underline"
            >
              luthiers
            </Link>
            .
          </p>
        ) : null}
      </article>

      <section className="mt-10 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">Contact</h2>
        <div className="mt-4 rounded-2xl bg-surface p-5 shadow-border sm:p-6">
          <dl className="space-y-4 text-sm">
            {shop.address ? (
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                <div>
                  <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Address</dt>
                  <dd className="mt-1 text-base text-fg">
                    {map ? (
                      <a href={map} target="_blank" rel="noreferrer" className="hover:underline">
                        {shop.address}
                      </a>
                    ) : (
                      shop.address
                    )}
                  </dd>
                </div>
              </div>
            ) : null}
            {shop.phone ? (
              <div className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                <div>
                  <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Phone</dt>
                  <dd className="mt-1 text-base text-fg">
                    {call ? (
                      <a href={call} className="hover:underline">
                        {shop.phone}
                      </a>
                    ) : (
                      shop.phone
                    )}
                  </dd>
                </div>
              </div>
            ) : null}
            {shop.email ? (
              <div className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                <div>
                  <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Email</dt>
                  <dd className="mt-1 text-base text-fg">
                    <a href={`mailto:${shop.email}`} className="hover:underline">
                      {shop.email}
                    </a>
                  </dd>
                </div>
              </div>
            ) : null}
            {shop.site ? (
              <div className="flex gap-3">
                <Globe className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                <div>
                  <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Website</dt>
                  <dd className="mt-1 text-base text-fg">
                    <a href={shop.site} target="_blank" rel="noreferrer" className="hover:underline">
                      {shop.site.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                    </a>
                  </dd>
                </div>
              </div>
            ) : null}
            {shop.hours ? (
              <div className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-faint" aria-hidden />
                <div>
                  <dt className="text-[11px] tracking-[0.16em] text-faint uppercase">Hours</dt>
                  <dd className="mt-1 text-base text-fg">{shop.hours}</dd>
                </div>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        {shop.site ? (
          <Button asChild>
            <a href={shop.site} target="_blank" rel="noreferrer">
              Shop site
            </a>
          </Button>
        ) : null}
        {shop.email ? (
          <Button asChild variant="outline">
            <a href={`mailto:${shop.email}`}>Email</a>
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

      <p className="mt-10">
        <Link to="/shops" className="text-sm text-muted hover:text-fg">
          All guitar shops
        </Link>
      </p>

      <HubChat kind="shop" slug={shop.slug} initial={chat} />
    </main>
  );
}
