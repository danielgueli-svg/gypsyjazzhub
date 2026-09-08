import { X } from "lucide-react";
import { useEffect, useId, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { submitContact } from "@/lib/contact";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ContactBoardButton({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={onDark ? "outline" : "default"}
        className={cn(
          onDark &&
            "border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        {t("footer.contact")}
      </Button>
      {open ? <ContactBoardDialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}

function ContactBoardDialog({ onClose }: { onClose: () => void }) {
  const { t } = useI18n();
  const { user } = useCurrentUserState();
  const titleId = useId();
  const [name, setName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.primaryEmail ?? "");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await submitContact({
        data: { name, email, subject, message, company },
      });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("footer.contactError"));
    } finally {
      setBusy(false);
    }
  }

  const dialog = (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4 sm:pt-28" style={{ zIndex: 80 }}>
      <button
        type="button"
        className="absolute inset-0 bg-black/55"
        aria-label={t("footer.contactClose")}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-h-[92vh] overflow-y-auto rounded-t-2xl bg-surface p-5 shadow-border sm:max-w-md sm:rounded-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] tracking-[0.18em] text-faint uppercase">{t("nav.board")}</p>
            <h2 id={titleId} className="mt-1 font-display text-2xl font-semibold">
              {t("footer.contact")}
            </h2>
          </div>
          <button
            type="button"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted hover:bg-raised hover:text-fg"
            onClick={onClose}
            aria-label={t("footer.contactClose")}
          >
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t("footer.contactLead")}</p>

        {sent ? (
          <div className="mt-6">
            <p className="text-sm leading-relaxed text-fg">{t("footer.contactSent")}</p>
            <Button type="button" className="mt-5" onClick={onClose}>
              {t("footer.contactClose")}
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <p className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Company
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </label>
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="board-name">{t("footer.contactName")}</Label>
              <Input
                id="board-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
                maxLength={80}
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="board-email">{t("footer.contactEmail")}</Label>
              <Input
                id="board-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                maxLength={120}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="board-subject">{t("footer.contactSubject")}</Label>
              <Input
                id="board-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                required
                maxLength={140}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="board-message">{t("footer.contactMessage")}</Label>
              <Textarea
                id="board-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
                maxLength={4000}
                rows={5}
              />
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" className="w-full sm:w-auto" disabled={busy}>
              {busy ? t("footer.contactSending") : t("footer.contactSend")}
            </Button>
          </form>
        )}
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(dialog, document.body);
}
