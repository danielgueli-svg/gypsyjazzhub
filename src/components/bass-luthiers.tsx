import { Link, useRouter } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { LuthierName } from "@/components/luthier-name";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CountryLabel } from "@/components/country-label";
import { SignInGate } from "@/components/sign-in-gate";
import { addHubLuthier } from "@/lib/hub-api";
import { countrySlug } from "@/lib/geo";
import { bassLuthiersByCountry, siteHost, type Luthier } from "@/lib/luthiers";
import { useI18n } from "@/lib/i18n";

function matchesQuery(row: Luthier, query: string) {
  if (!query) return true;
  const hay = `${row.name} ${row.city} ${row.country} ${row.note} ${row.bio}`.toLowerCase();
  return hay.includes(query);
}

export function BassLuthierRows({ luthiers }: { luthiers: Luthier[] }) {
  return (
    <ul className="columns-1 gap-x-10 sm:columns-2">
      {luthiers.map((luthier) => (
        <li key={luthier.slug} className="break-inside-avoid py-2">
          <LuthierName luthier={luthier} />
          {luthier.city ? <span className="text-sm text-muted"> · {luthier.city}</span> : null}
          {luthier.site ? (
            <p className="text-sm">
              <a
                href={luthier.site}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-fg hover:underline"
              >
                {siteHost(luthier.site)}
              </a>
            </p>
          ) : null}
          {luthier.note ? <p className="text-sm text-muted">{luthier.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function BassLuthiersDirectory({ extra = [] }: { extra?: Luthier[] }) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const groups = useMemo(() => {
    return bassLuthiersByCountry(extra)
      .map((group) => ({
        ...group,
        luthiers: group.luthiers.filter((row) => matchesQuery(row, q)),
      }))
      .filter((group) => group.luthiers.length);
  }, [extra, q]);

  return (
    <div>
      <label className="block max-w-md">
        <span className="sr-only">{t("bass.search")}</span>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("bass.searchPh")}
        />
      </label>
      {groups.length === 0 ? (
        <p className="mt-6 text-sm text-muted">{t("bass.noMatch")}</p>
      ) : (
        <div className="mt-10 space-y-10">
          {groups.map((group) => (
            <section key={group.country}>
              <Link
                to="/world/$slug"
                params={{ slug: countrySlug(group.country) }}
                className="text-[11px] tracking-[0.18em] text-faint uppercase hover:text-fg"
              >
                <CountryLabel name={group.country} />
                <span className="ml-2 text-faint">({group.luthiers.length})</span>
              </Link>
              <div className="mt-3">
                <BassLuthierRows luthiers={group.luthiers} />
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export function CountryBassLuthiers({
  luthiers,
  countryName,
}: {
  luthiers: Luthier[];
  countryName: string;
}) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = luthiers.filter((row) => matchesQuery(row, q));

  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold">{t("bass.title")}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{t("bass.lead")}</p>
      <p className="mt-3">
        <Link to="/luthiers/bass" className="text-sm text-fg hover:underline">
          {t("bass.worldwide")}
        </Link>
      </p>

      {luthiers.length > 2 ? (
        <label className="mt-5 block max-w-md">
          <span className="sr-only">{t("bass.search")}</span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("bass.searchPh")}
          />
        </label>
      ) : null}

      {luthiers.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{t("bass.empty")}</p>
      ) : shown.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{t("bass.noMatch")}</p>
      ) : (
        <div className="mt-5">
          <BassLuthierRows luthiers={shown} />
        </div>
      )}

      <SuggestBassLuthier countryName={countryName} />
    </section>
  );
}

export function SuggestBassLuthier({ countryName = "" }: { countryName?: string }) {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState(countryName);
  const [site, setSite] = useState("");
  const [note, setNote] = useState("");
  const [correction, setCorrection] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const bio = [note.trim(), correction.trim()].filter(Boolean).join(" ");
      const result = await addHubLuthier({
        data: {
          name,
          city,
          country: (countryName || country).trim(),
          site,
          contact: "",
          bio,
          craft: "bass",
          note,
        },
      });
      setName("");
      setCity("");
      setSite("");
      setNote("");
      setCorrection("");
      setOpen(false);
      setStatus(t("bass.suggestOk"));
      void router.invalidate();
      await router.navigate({ to: "/luthiers/$slug", params: { slug: result.slug } });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t("bass.suggestFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      <SignInGate lead={t("bass.suggestSignin")}>
      {open ? (
        <form
          onSubmit={(event) => void onSubmit(event)}
          className="grid max-w-xl gap-4 rounded-2xl bg-surface p-5 shadow-border sm:grid-cols-2"
        >
          <p className="sm:col-span-2 text-sm text-muted">{t("bass.suggestLead")}</p>
          <div className="space-y-1.5">
            <Label htmlFor="bass-name">{t("bass.fieldName")}</Label>
            <Input id="bass-name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          {countryName ? null : (
            <div className="space-y-1.5">
              <Label htmlFor="bass-country">{t("bass.fieldCountry")}</Label>
              <Input
                id="bass-country"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="bass-city">{t("bass.fieldCity")}</Label>
            <Input id="bass-city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="bass-site">{t("bass.fieldSite")}</Label>
            <Input id="bass-site" value={site} onChange={(e) => setSite(e.target.value)} />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="bass-note">{t("bass.fieldNote")}</Label>
            <Input
              id="bass-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("bass.fieldNotePh")}
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="bass-fix">{t("bass.fieldFix")}</Label>
            <Textarea
              id="bass-fix"
              value={correction}
              onChange={(e) => setCorrection(e.target.value)}
              placeholder={t("bass.fieldFixPh")}
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? t("bass.suggesting") : t("bass.suggestSend")}
            </Button>
            <button
              type="button"
              className="text-sm text-muted hover:text-fg"
              onClick={() => setOpen(false)}
            >
              {t("nav.close")}
            </button>
            {status ? <p className="text-sm text-muted">{status}</p> : null}
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" onClick={() => setOpen(true)}>
            {t("bass.suggest")}
          </Button>
          {status ? <p className="text-sm text-muted">{status}</p> : null}
        </div>
      )}
      </SignInGate>
    </div>
  );
}
