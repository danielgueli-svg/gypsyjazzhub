import { Link } from "@tanstack/react-router";
import { CountryLabel } from "@/components/country-label";
import { ShopName } from "@/components/shop-name";
import { countrySlug } from "@/lib/geo";
import { shopsByCountry, type Shop } from "@/lib/shops";

export function ShopsDirectory({
  shops,
}: {
  shops?: Shop[];
}) {
  const groups = shops
    ? [
        {
          country: shops[0]?.country ?? "",
          shops,
        },
      ].filter((group) => group.country && group.shops.length)
    : shopsByCountry();

  if (groups.length === 0) return null;

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.country}>
          <Link
            to="/world/$slug"
            params={{ slug: countrySlug(group.country) }}
            className="inline-flex flex-wrap items-center gap-x-2 text-[11px] tracking-[0.18em] text-faint uppercase hover:text-fg"
          >
            <CountryLabel name={group.country} />
            <span className="ml-2 text-faint">({group.shops.length})</span>
          </Link>
          <ul className="mt-3 columns-1 gap-x-10 sm:columns-2">
            {group.shops.map((shop) => (
              <li key={shop.slug} className="break-inside-avoid py-1.5">
                <ShopName shop={shop} />
                {shop.city ? <span className="text-sm text-muted"> · {shop.city}</span> : null}
                {shop.hours ? <p className="text-sm text-muted">{shop.hours}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
