import { useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { updateHubFestival } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import type { Festival } from "@/lib/festivals";
import { toWallClockInput, wallClockIso } from "@/lib/utils";

export function FestivalEdit({ festival }: { festival: Festival }) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [city, setCity] = useState(festival.city);
  const [when, setWhen] = useState(festival.when);
  const [nextStartsAt, setNextStartsAt] = useState(toWallClockInput(festival.nextStartsAt));
  const [site, setSite] = useState(festival.site);
  const [bio, setBio] = useState(festival.bio);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending || !user) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const nextIso = nextStartsAt ? wallClockIso(nextStartsAt) : festival.nextStartsAt;
      const result = await updateHubFestival({
        data: {
          slug: festival.slug,
          name: festival.name,
          city,
          country: festival.country,
          when,
          nextStartsAt: nextIso,
          bio,
          site,
        },
      });
      if (result.pending) setStatus(t("jam.editPending"));
      else {
        setStatus(t("festival.editSaved"));
        setOpen(false);
      }
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t("jam.editFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <Button type="button" variant="outline" size="sm" onClick={() => setOpen((v) => !v)}>
        {t("jam.edit")}
      </Button>
      {open ? (
        <form
          onSubmit={(event) => void onSubmit(event)}
          className="mt-4 grid gap-4 rounded-2xl bg-surface p-5 shadow-border sm:grid-cols-2"
        >
          <p className="sm:col-span-2 text-sm leading-relaxed text-muted">{t("festival.editLead")}</p>
          <div className="space-y-1.5">
            <Label htmlFor="fest-edit-city">{t("jam.editCity")}</Label>
            <Input id="fest-edit-city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fest-edit-when">{t("jam.editWhen")}</Label>
            <Input id="fest-edit-when" value={when} onChange={(e) => setWhen(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fest-edit-next">{t("jam.editNext")}</Label>
            <Input
              id="fest-edit-next"
              type="datetime-local"
              required
              value={nextStartsAt}
              onChange={(e) => setNextStartsAt(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fest-edit-site">{t("festivals.site")}</Label>
            <Input
              id="fest-edit-site"
              value={site}
              onChange={(e) => setSite(e.target.value)}
              placeholder="https://"
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="fest-edit-bio">{t("jam.editBio")}</Label>
            <Textarea id="fest-edit-bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={5} />
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={busy}>
              {busy ? t("jam.editSaving") : t("jam.editSave")}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {t("jam.editCancel")}
            </Button>
            {status ? <p className="text-sm text-muted">{status}</p> : null}
          </div>
        </form>
      ) : status ? (
        <p className="mt-2 text-sm text-muted">{status}</p>
      ) : null}
    </div>
  );
}