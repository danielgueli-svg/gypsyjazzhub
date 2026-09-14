import { useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Concert } from "@/lib/api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { updateHubConcert } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { toWallClockInput, wallClockIso } from "@/lib/utils";

export function ConcertEdit({ concert }: { concert: Concert }) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(concert.title);
  const [venue, setVenue] = useState(concert.venue);
  const [city, setCity] = useState(concert.city);
  const [country, setCountry] = useState(concert.country);
  const [startsAt, setStartsAt] = useState(toWallClockInput(concert.startsAt));
  const [note, setNote] = useState(concert.description ?? concert.ticketUrl ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending || !user) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const nextIso = startsAt ? wallClockIso(startsAt) : concert.startsAt;
      const result = await updateHubConcert({
        data: {
          id: concert.id,
          artistSlug: concert.artistSlug,
          artistName: concert.artistName,
          title,
          venue,
          city,
          country,
          startsAt: nextIso,
          note,
        },
      });
      if (result.pending) setStatus(t("jam.editPending"));
      else {
        setStatus(t("concert.editSaved"));
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
          <p className="sm:col-span-2 text-sm leading-relaxed text-muted">{t("concert.editLead")}</p>
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="concert-edit-title">{t("concerts.typeConcert")}</Label>
            <Input id="concert-edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="concert-edit-venue">{t("jam.editVenue")}</Label>
            <Input id="concert-edit-venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="concert-edit-city">{t("jam.editCity")}</Label>
            <Input id="concert-edit-city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="concert-edit-country">{t("festival.country")}</Label>
            <Input id="concert-edit-country" value={country} onChange={(e) => setCountry(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="concert-edit-next">{t("jam.editNext")}</Label>
            <Input
              id="concert-edit-next"
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2 space-y-1.5">
            <Label htmlFor="concert-edit-note">{t("jam.editBio")}</Label>
            <Textarea id="concert-edit-note" value={note} onChange={(e) => setNote(e.target.value)} rows={4} />
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