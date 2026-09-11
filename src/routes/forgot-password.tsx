import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestHubPasswordReset } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/forgot-password")({
  head: () =>
    pageHead({
      title: "Reset password",
      description: "Send a Gypsy Jazz Hub password reset email.",
      path: "/forgot-password",
      noindex: true,
    }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await requestHubPasswordReset({ data: email });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("forgot.fail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-surface p-6 shadow-border sm:p-8">
        <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("join.kicker")}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">{t("forgot.title")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t("forgot.lead")}</p>
        {sent ? (
          <p className="mt-8 text-sm leading-relaxed text-muted">{t("forgot.sent")}</p>
        ) : (
          <form onSubmit={(event) => void onSubmit(event)} className="mt-8 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">{t("login.email")}</Label>
              <Input
                id="forgot-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? t("login.wait") : t("forgot.submit")}
            </Button>
          </form>
        )}
        <p className="mt-6 text-sm">
          <Link to="/login" className="text-fg hover:underline">
            {t("forgot.back")}
          </Link>
        </p>
      </div>
    </main>
  );
}
