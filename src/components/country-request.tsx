import { Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { requestCountry } from "@/lib/country-requests";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const KINDS = ["concert", "jam", "festival", "page"] as const;

export function CountryRequestForm({
  presetName,
  compact,
}: {
  presetName?: string;
  compact?: boolean;
}) {
  const { t } = useI18n();
  const [countryName, setCountryName] = useState(presetName ?? "");
  const [city, setCity] = useState("");
  const [kind, setKind] = useState<(typeof KINDS)[number]>("concert");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const res = await requestCountry({
        data: { countryName, city, kind, note },
      });
      setNote("");
      setStatus(res.already ? t("country.reqAlready") : t("country.reqSent"));
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t("country.reqFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={cn("rounded-2xl bg-surface p-6 shadow-border", !compact && "mt-12")}>
      <h2 className="font-display text-2xl font-semibold">{t("country.reqTitle")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t("country.reqLead")}</p>
      <SignedOut>
        <Button asChild className="mt-5">
          <Link to="/login">{t("country.reqSignin")}</Link>
        </Button>
      </SignedOut>
      <SignedIn>
        <form onSubmit={(event) => void onSubmit(event)} className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="new-country">{t("country.reqName")}</Label>
            <Input
              id="new-country"
              required
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              placeholder="Iceland"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-country-city">{t("country.reqCity")}</Label>
            <Input
              id="new-country-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Reykjavík"
            />
          </div>
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm text-muted">{t("country.reqKind")}</p>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setKind(item)}
                  className={cn(
                    "h-11 rounded-md px-4 text-sm",
                    kind === item ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
                  )}
                >
                  {t(`country.reqKind.${item}`)}
                </button>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="new-country-note">{t("country.reqNote")}</Label>
            <Textarea
              id="new-country-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("country.reqNotePh")}
              rows={3}
            />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? t("country.reqSending") : t("country.reqSend")}
            </Button>
            {status ? <p className="text-sm text-muted">{status}</p> : null}
          </div>
        </form>
      </SignedIn>
    </section>
  );
}
