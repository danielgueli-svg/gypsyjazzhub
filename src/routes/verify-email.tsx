import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { confirmHubEmail, startHubEmailVerification } from "@/lib/hub-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/verify-email")({
  head: () =>
    pageHead({
      title: "Verify email",
      description: "Confirm your Gypsy Jazz Hub email before you post.",
      path: "/verify-email",
    }),
  validateSearch: (search: Record<string, unknown>): { token?: string } => ({
    token: typeof search.token === "string" ? search.token : undefined,
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const { t } = useI18n();
  const { token } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const [status, setStatus] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    void confirmHubEmail({ data: token })
      .then(() => setStatus(t("verify.ok")))
      .catch((err) => setStatus(err instanceof Error ? err.message : t("verify.fail")));
  }, [token, t]);

  async function sendAgain() {
    setStatus(null);
    try {
      const result = await startHubEmailVerification();
      if (result.already) {
        setStatus(t("verify.ok"));
        return;
      }
      const href = result.token ? `/verify-email?token=${encodeURIComponent(result.token)}` : null;
      setLink(href);
      setStatus(result.mailed ? t("verify.sent") : t("verify.noMail"));
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t("verify.startFail"));
    }
  }

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-12 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("verify.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">{t("verify.title")}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">{t("verify.lead")}</p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{t("verify.loginNow")}</p>
      {status ? <p className="mt-6 text-sm text-muted">{status}</p> : null}
      {link ? (
        <p className="mt-3 text-sm">
          <a href={link} className="text-accent hover:underline">
            {t("verify.confirm")}
          </a>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {user || isPending ? (
          <Button type="button" onClick={() => void sendAgain()}>
            {t("verify.send")}
          </Button>
        ) : (
          <Button asChild>
            <Link to="/login">{t("login.submitIn")}</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link to="/add">{t("verify.add")}</Link>
        </Button>
      </div>
    </main>
  );
}