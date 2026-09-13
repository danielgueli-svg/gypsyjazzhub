import { Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { updateHubJamNight } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { formatJamNight, upcomingJamNights, type Jam } from "@/lib/jams";

function toLocalInput(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function JamNights({ jam }: { jam: Jam }) {
  const { t, locale } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const nights = upcomingJamNights(jam);
  const [open, setOpen] = useState<1 | 2 | null>(null);
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  function startEdit(slot: 1 | 2) {
    setOpen(slot);
    setValue(toLocalInput(nights[slot - 1]));
    setStatus(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!open) return;
    setBusy(true);
    setStatus(null);
    try {
      const iso = value ? new Date(value).toISOString() : nights[open - 1];
      const result = await updateHubJamNight({ data: { slug: jam.slug, slot: open, startsAt: iso } });
      setStatus(result.pending ? t("jam.editPending") : t("jam.editSaved"));
      setOpen(null);
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t("jam.editFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4">
      <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("jam.nextDates")}</p>
      <ol className="mt-2 space-y-3">
        {nights.map((iso, index) => {
          const slot = (index + 1) as 1 | 2;
          return (
            <li key={`${slot}-${iso}`} className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[11px] tracking-[0.14em] text-faint uppercase">
                  {slot === 1 ? t("jam.night1") : t("jam.night2")}
                </p>
                <p className="mt-0.5 text-sm text-fg">{formatJamNight(jam, iso, locale)}</p>
              </div>
              {isPending ? (
                <div className="h-9 w-16 animate-pulse rounded-md bg-raised" />
              ) : user ? (
                <Button type="button" variant="outline" size="sm" onClick={() => startEdit(slot)}>
                  {t("jam.edit")}
                </Button>
              ) : (
                <Button asChild variant="outline" size="sm">
                  <Link to="/login" search={{ next: `/jams/${jam.slug}` }}>
                    {t("jam.edit")}
                  </Link>
                </Button>
              )}
              {open === slot ? (
                <form onSubmit={(event) => void onSubmit(event)} className="flex w-full flex-wrap items-end gap-2">
                  <Input
                    type="datetime-local"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="max-w-56"
                  />
                  <Button type="submit" size="sm" disabled={busy}>
                    {busy ? t("jam.editSaving") : t("jam.editSave")}
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(null)}>
                    {t("jam.editCancel")}
                  </Button>
                </form>
              ) : null}
            </li>
          );
        })}
      </ol>
      {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}
    </div>
  );
}
