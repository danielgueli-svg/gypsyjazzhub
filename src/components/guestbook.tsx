import { Link, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { addGuestbook, listGuestbook, type GuestbookEntry } from "@/lib/guestbook";
import { useI18n } from "@/lib/i18n";

const MAX_BODY = 600;

function when(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return format(date, "d MMM yyyy");
}

export function Guestbook({
  slug,
  name,
  initial,
}: {
  slug: string;
  name: string;
  initial: GuestbookEntry[];
}) {
  const { t } = useI18n();
  const { user } = useCurrentUserState();
  const router = useRouter();
  const [entries, setEntries] = useState(initial);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setEntries(initial);
  }, [initial]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await addGuestbook({ data: { artistSlug: slug, body } });
      setBody("");
      const next = await listGuestbook({ data: slug });
      setEntries(next);
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not post.");
    } finally {
      setBusy(false);
    }
  }

  const signer = user?.displayName?.trim() || user?.primaryEmail?.split("@")[0] || "you";

  return (
    <section className="mt-12">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("guestbook.kicker")}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold">{t("guestbook.title")}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {t("guestbook.lead").replace("{name}", name)}
      </p>

      {entries.length === 0 ? (
        <p className="mt-5 text-sm text-faint">{t("guestbook.empty")}</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {entries.map((entry) => (
            <li key={entry.id} className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="font-display text-lg font-semibold">{entry.authorName}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{entry.body}</p>
              <p className="mt-3 text-[11px] tracking-[0.16em] text-faint uppercase">
                {when(entry.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {user ? (
        <form
          onSubmit={(event) => void onSubmit(event)}
          className="mt-6 space-y-3 rounded-2xl bg-surface p-5 shadow-border sm:p-6"
        >
          <p className="text-xs tracking-wide text-faint">
            {t("guestbook.as").replace("{name}", signer)}
          </p>
          <div className="space-y-1.5">
            <Label htmlFor={`guestbook-${slug}`}>{t("guestbook.title")}</Label>
            <Textarea
              id={`guestbook-${slug}`}
              required
              maxLength={MAX_BODY}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder={t("guestbook.placeholder")}
            />
            <p className="text-right text-[11px] text-faint">
              {body.length}/{MAX_BODY}
            </p>
          </div>
          {status ? <p className="text-sm text-danger">{status}</p> : null}
          <Button type="submit" disabled={busy || body.trim().length < 4}>
            {busy ? t("guestbook.posting") : t("guestbook.submit")}
          </Button>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl bg-surface p-5 shadow-border">
          <p className="text-sm leading-relaxed text-muted">{t("guestbook.signin")}</p>
          <Button asChild className="mt-4">
            <Link to="/join">{t("guestbook.signinCta")}</Link>
          </Button>
        </div>
      )}
    </section>
  );
}
