import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { applyHubPasswordReset } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/reset-password")({
  head: () =>
    pageHead({
      title: "New password",
      description: "Choose a new Gypsy Jazz Hub password.",
      path: "/reset-password",
      noindex: true,
    }),
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const { token } = Route.useSearch();
  const { t } = useI18n();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!token) {
      setError(t("reset.bad"));
      return;
    }
    setBusy(true);
    try {
      await applyHubPasswordReset({ data: { token, password } });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("reset.bad"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-surface p-6 shadow-border sm:p-8">
        <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("join.kicker")}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">{t("reset.title")}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t("reset.lead")}</p>
        {!token ? (
          <p className="mt-8 text-sm text-danger">{t("reset.bad")}</p>
        ) : done ? (
          <p className="mt-8 text-sm leading-relaxed text-muted">{t("reset.done")}</p>
        ) : (
          <form onSubmit={(event) => void onSubmit(event)} className="mt-8 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="reset-password">{t("login.password")}</Label>
              <Input
                id="reset-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? t("login.wait") : t("reset.submit")}
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
