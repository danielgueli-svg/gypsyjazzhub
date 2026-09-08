import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { inviteToJam, listOpenInvitees, type FanRow } from "@/lib/fans";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { CountryLabel } from "@/components/country-label";

export function InvitePanel({
  jamSlug,
  jamName,
  city,
  country,
  startsAt,
}: {
  jamSlug: string;
  jamName: string;
  city?: string;
  country?: string;
  startsAt?: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const { t } = useI18n();
  const [people, setPeople] = useState<FanRow[]>([]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    void listOpenInvitees({ data: { country } })
      .then(setPeople)
      .catch(() => setPeople([]));
  }, [user, country]);

  if (isPending || !user) return null;

  async function send(all: boolean) {
    setBusy(true);
    setStatus(null);
    try {
      const ids = all ? people.map((row) => row.userId) : people.filter((row) => picked[row.userId]).map((row) => row.userId);
      const result = await inviteToJam({
        data: {
          jamSlug,
          jamName,
          city,
          country,
          startsAt,
          toUserIds: ids,
          allOpen: all,
        },
      });
      setStatus(t("invite.sent").replace("{n}", String(result.sent)));
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t("invite.fail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl bg-surface p-5 shadow-border sm:p-6">
      <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("invite.kicker")}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">{t("invite.title")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t("invite.lead")}</p>
      {people.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{t("invite.none")}</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {people.map((row) => (
            <li key={row.userId}>
              <label className="flex min-h-11 items-start gap-3 rounded-xl px-2 py-2 hover:bg-raised">
                <input
                  type="checkbox"
                  checked={Boolean(picked[row.userId])}
                  onChange={(e) => setPicked((cur) => ({ ...cur, [row.userId]: e.target.checked }))}
                  className="mt-1 size-4 accent-accent"
                />
                <span>
                  <Link
                    to={row.memberKind === "fan" ? "/fans/$slug" : "/musicians/$slug"}
                    params={{ slug: row.slug }}
                    className="font-medium hover:underline"
                  >
                    {row.displayName}
                  </Link>
                  <span className="mt-0.5 block text-xs text-muted">
                    {row.city ? `${row.city} · ` : ""}
                    {row.country ? <CountryLabel name={row.country} /> : null}
                  </span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" disabled={busy || people.length === 0} onClick={() => void send(false)}>
          {busy ? t("invite.sending") : t("invite.send")}
        </Button>
        <Button type="button" variant="outline" disabled={busy || people.length === 0} onClick={() => void send(true)}>
          {t("invite.all")}
        </Button>
      </div>
      {status ? <p className="mt-3 text-sm text-muted">{status}</p> : null}
    </section>
  );
}
