import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { CountryClicker } from "@/components/country-clicker";
import { Flag } from "@/components/flag";
import { ShopsDirectory } from "@/components/shops-directory";
import { countrySlug, displayCountry } from "@/lib/geo";
import { listHubLuthiers } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { luthierPageCopy } from "@/lib/luthier-copy";
import {
  communityLuthierOrder,
  mergeLuthiers,
  sortCountryLuthiers,
  type Luthier,
} from "@/lib/luthiers";
import { makerBio } from "@/lib/maker-copy";
import { luthierPhotoSrc } from "@/lib/photos";
import { pageHead, SEO } from "@/lib/seo";

type Search = { country?: string };

export const Route = createFileRoute("/luthiers/")({
  head: () => pageHead(SEO.luthiers),
  validateSearch: (search: Record<string, unknown>): Search => ({
    country: typeof search.country === "string" ? search.country : undefined,
  }),
  loaderDeps: ({ search }) => ({ country: search.country }),
  loader: async ({ deps }) => {
    const extra = await listHubLuthiers();
    const all = mergeLuthiers(extra);
    const countries = [...new Set(all.map((row) => row.country))].sort((a, b) =>
      a.localeCompare(b),
    );
    const selected = countries.find((name) => countrySlug(name) === deps.country) ?? null;
    const subset = selected ? all.filter((row) => row.country === selected) : all;
    const luthiers = selected
      ? sortCountryLuthiers(selected, subset)
      : communityLuthierOrder(subset);
    return { luthiers, countries, selected };
  },
  component: LuthiersPage,
});

function LuthiersPage() {
  const { luthiers, countries, selected } = Route.useLoaderData();
  const { t, locale } = useI18n();
  const copy = luthierPageCopy(locale);
  const navigate = useNavigate({ from: "/luthiers/" });

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{copy.kicker}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{copy.title}</h1>
      <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-muted">
        <p>{copy.lead}</p>
        <p>{copy.craft}</p>
        <p>{copy.invite}</p>
      </div>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        {copy.listLead}{" "}
        <Link to="/luthiers/bass" className="text-fg hover:underline">
          {t("bass.worldwide")}
        </Link>
        {" · "}
        <Link to="/luthiers/violin" className="text-fg hover:underline">
          {t("violin.worldwide")}
        </Link>
        {" · "}
        <Link to="/luthiers/accordion" className="text-fg hover:underline">
          {t("accordion.worldwide")}
        </Link>
        .
      </p>

      <CountryClicker
        countries={countries}
        value={selected ? countrySlug(selected) : null}
        onChange={(slug) => {
          void navigate({
            to: "/luthiers",
            search: { country: slug ?? undefined },
          });
        }}
      />

      <p className="mt-8 text-sm text-muted">
        {luthiers.length}
        {selected ? ` · ${displayCountry(selected, locale)}` : null}
      </p>

      <ol className="mt-6 divide-y divide-border overflow-hidden rounded-2xl bg-surface shadow-border">
        {luthiers.map((luthier) => (
          <LuthierIndexRow key={luthier.slug} luthier={luthier} />
        ))}
      </ol>

      <section className="mt-16">
        <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Retail</p>
        <h2 className="mt-3 font-display text-3xl font-semibold">{t("country.shops")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Shops that specialise in Selmer-Maccaferri style guitars — stock on
          the floor, not only a workshop. Open a name for address, phone and
          email. The full list is also on{" "}
          <Link to="/shops" className="text-fg hover:underline">
            guitar shops
          </Link>
          .
        </p>
        <div className="mt-8">
          <ShopsDirectory />
        </div>
      </section>

      <p className="mt-10 max-w-2xl text-sm leading-relaxed text-muted">{copy.contribute}</p>
      <Contribute heading="Add a luthier" />
    </main>
  );
}

function LuthierIndexRow({ luthier }: { luthier: Luthier }) {
  const { t, locale } = useI18n();
  const photo = luthierPhotoSrc(luthier.slug);
  const localized = makerBio(luthier.slug, locale);
  const bio = localized || luthier.bio;
  const craft =
    luthier.craft === "bass"
      ? t("luthiers.bass")
      : luthier.craft === "violin"
        ? t("luthiers.violin")
        : luthier.craft === "accordion"
          ? t("luthiers.accordion")
          : luthier.craft === "other"
            ? t("luthiers.other")
            : null;

  return (
    <li className="flex gap-4 px-4 py-5 sm:px-5">
      {photo ? (
        <Link
          to="/luthiers/$slug"
          params={{ slug: luthier.slug }}
          className="shrink-0"
        >
          <img
            src={photo}
            alt=""
            className="size-16 rounded-xl object-cover object-top shadow-border sm:size-20"
          />
        </Link>
      ) : (
        <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-raised shadow-border sm:size-20">
          <Flag name={luthier.country} className="h-5 w-8" />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <Link
            to="/luthiers/$slug"
            params={{ slug: luthier.slug }}
            className="font-display text-xl font-semibold hover:underline"
          >
            {luthier.name}
          </Link>
          {craft ? (
            <span className="text-[11px] tracking-[0.14em] text-faint uppercase">{craft}</span>
          ) : null}
        </div>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
          <Flag name={luthier.country} />
          <span>{displayCountry(luthier.country, locale)}</span>
          {luthier.city ? <span>· {luthier.city}</span> : null}
        </p>
        {bio ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted break-words">{bio}</p> : null}
      </div>
    </li>
  );
}
