import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { addArchiveNote } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";

export function ArchiveSuggest({
  country,
  countrySlug,
}: {
  country: string;
  countrySlug: string;
}) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [year, setYear] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await addArchiveNote({
        data: { countrySlug, country, name, text, year, link },
      });
      setName("");
      setText("");
      setYear("");
      setLink("");
      setOpen(false);
      setStatus(t("archive.sent"));
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t("archive.suggestFail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-12 max-w-2xl rounded-2xl bg-surface p-5 shadow-border">
      <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{t("archive.fromCircle")}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">{t("archive.suggest")}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t("archive.suggestLead")}</p>
      {status ? <p className="mt-3 text-sm text-muted">{status}</p> : null}
      {isPending ? null : user ? (
        open ? (
          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="archive-name">{t("archive.suggestName")}</Label>
              <Input
                id="archive-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="archive-year">{t("archive.suggestYear")}</Label>
              <Input
                id="archive-year"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="1953"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="archive-text">{t("archive.suggestNote")}</Label>
              <Textarea
                id="archive-text"
                value={text}
                onChange={(event) => setText(event.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="archive-link">{t("archive.suggestLink")}</Label>
              <Input
                id="archive-link"
                type="url"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>
                {t("archive.suggestCta")}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                {t("archive.cancel")}
              </Button>
            </div>
          </form>
        ) : (
          <Button type="button" className="mt-4" onClick={() => setOpen(true)}>
            {t("archive.suggestCta")}
          </Button>
        )
      ) : (
        <p className="mt-3 text-sm text-muted">
          <Link to="/login" className="font-medium text-accent hover:underline">
            {t("nav.login")}
          </Link>
          {" — "}
          {t("archive.suggestSignin")}
        </p>
      )}
    </section>
  );
}
