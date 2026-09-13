import { useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { updateHubJam } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import type { Jam } from "@/lib/jams";

function toLocalInput(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function JamEdit({ jam, startOpen = false }: { jam: Jam; startOpen?: boolean }) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [open, setOpen] = useState(startOpen);
  const [venue, setVenue] = useState(jam.venue);
  const [address, setAddress] = useState(jam.address);
  const [city, setCity] = useState(jam.city);
  const [hours, setHours] = useState(jam.hours);
  const [when, setWhen] = useState(jam.when);
  const [nextStartsAt, setNextStartsAt] = useState(toLocalInput(jam.nextStartsAt));
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (isPending || !user) return null;

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const nextIso = nextStartsAt ? new Date(nextStartsAt).toISOString() : jam.nextStartsAt;
      const result = await updateHubJam({
        data: {
          slug: jam.slug,
          name: jam.name,
          city,
          country: jam.country,
          venue,
          address,
          hours,
          when,
          nextStartsAt: nextIso,
          bio: jam.bio,
        },
      });
      if (result.pending) {
        setStatus(t("jam.editPending"));
      } else {
        setStatus(t("jam.editSaved"));
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
          <p className="sm:col-span-2 text-sm leading-relaxed text-muted">{t("jam.editLead")}</p>
          <div className="space-y-1.5">
            <Label htmlFor="jam-edit-venue">{t("jam.editVenue")}</Label>
            <Input id="jam-edit-venue" required value={venue} onChange={(e) => setVenue(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jam-edit-address">{t("jam.editAddress")}</Label>
            <Input
              id="jam-edit-address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, number, postcode"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jam-edit-city">{t("jam.editCity")}</Label>
            <Input id="jam-edit-city" value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jam-edit-hours">{t("jam.editHours")}</Label>
            <Input
              id="jam-edit-hours"
              required
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="19:00–23:00"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jam-edit-when">{t("jam.editWhen")}</Label>
            <Input
              id="jam-edit-when"
              value={when}
              onChange={(e) => setWhen(e.target.value)}
              placeholder="Third Saturday of the month"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="jam-edit-next">{t("jam.editNext")}</Label>
            <Input
              id="jam-edit-next"
              type="datetime-local"
              required
              value={nextStartsAt}
              onChange={(e) => setNextStartsAt(e.target.value)}
            />
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
