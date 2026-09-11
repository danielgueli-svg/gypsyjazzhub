import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { confirmHubEmail, startHubEmailVerification } from "@/lib/hub-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
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
  const { token } = Route.useSearch();
  const { user, isPending } = useCurrentUserState();
  const [status, setStatus] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    void confirmHubEmail({ data: token })
      .then(() => setStatus("Email confirmed. You can add a concert, jam or teacher."))
      .catch((err) => setStatus(err instanceof Error ? err.message : "Could not verify."));
  }, [token]);

  async function sendAgain() {
    setStatus(null);
    try {
      const result = await startHubEmailVerification();
      const href = `/verify-email?token=${encodeURIComponent(result.token)}`;
      setLink(href);
      setStatus("Open the link we made for this account. Mail sending is on when the site is live on gypsyjazzhub.com.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not start verification.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-4 py-12 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Account</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">Verify your email</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        New email accounts confirm before they can post a concert, jam, festival, musician page or teacher.
      </p>
      {status ? <p className="mt-6 text-sm text-muted">{status}</p> : null}
      {link ? (
        <p className="mt-3 text-sm">
          <a href={link} className="text-accent hover:underline">
            Confirm this email
          </a>
        </p>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-3">
        {user || isPending ? (
          <Button type="button" onClick={() => void sendAgain()}>
            Send confirmation link
          </Button>
        ) : (
          <Button asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link to="/add">Add something</Link>
        </Button>
      </div>
    </main>
  );
}
