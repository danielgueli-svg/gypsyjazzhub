import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  GROK_PROVIDERS,
  authClient,
  authEnabled,
  setBearerToken,
  signIn,
} from "@/lib/auth/client";
import { pathAfterLogin } from "@/lib/auth/after-login";
import { takeReturnTo } from "@/lib/auth/return-to";
import { startHubEmailVerification } from "@/lib/hub-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function alreadyMember(message: string) {
  return /already|exists|registered|USER_ALREADY/i.test(message);
}

function keepToken(result: { data?: { token?: string | null } | null }) {
  const token = result.data?.token;
  if (typeof token === "string" && token) setBearerToken(token);
}

export function JoinForm({ defaultMode = "up" }: { defaultMode?: "in" | "up" }) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function goAfterLogin(firstTime: boolean) {
    try {
      await authClient.getSession();
    } catch {
      /* session store will catch up */
    }
    const back = takeReturnTo();
    if (back) {
      window.location.assign(back);
      return;
    }
    const to = firstTime ? "/add" : await pathAfterLogin();
    await navigate({ to });
  }

  async function onEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const trap = event.currentTarget.querySelector<HTMLInputElement>('input[name="company_url"]')?.value?.trim();
    if (trap) {
      await navigate({ to: "/verify-email" });
      return;
    }
    setBusy(true);
    try {
      let firstTime = mode === "up";
      if (mode === "up") {
        const created = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || email.split("@")[0] || "Hub member",
        });
        keepToken(created);
        if (created.error) {
          const message = created.error.message ?? "";
          if (!alreadyMember(message)) throw new Error(message || "Could not join.");
          firstTime = false;
          const existing = await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
          });
          keepToken(existing);
          if (existing.error) {
            throw new Error(
              "This email is already in the hub. Sign in with the same password — or use Google / X if that is how you joined.",
            );
          }
        } else {
          try {
            const sent = await startHubEmailVerification();
            await navigate({ to: "/verify-email", search: { token: sent.token } });
            return;
          } catch {
            await navigate({ to: "/verify-email" });
            return;
          }
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
          rememberMe: true,
        });
        keepToken(result);
        if (result.error) {
          throw new Error(
            result.error.message?.includes("PASSWORD") || /invalid/i.test(result.error.message ?? "")
              ? "Email or password is wrong. If you joined with Google or X, use that button."
              : result.error.message || "Could not sign in.",
          );
        }
      }
      await goAfterLogin(firstTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setBusy(false);
    }
  }

  if (isPending) {
    return <div className="h-12 w-40 animate-pulse rounded-md bg-raised" />;
  }
  if (user) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">
          You are logged in as {user.displayName ?? user.primaryEmail}.
        </p>
        <Button asChild>
          <Link to="/studio">{t("nav.hubProfile")}</Link>
        </Button>
      </div>
    );
  }
  if (!authEnabled) {
    return <p className="text-sm text-muted">Sign-in is disabled.</p>;
  }

  return (
    <>
      <form onSubmit={(event) => void onEmail(event)} className="space-y-3">
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label>
            Company website
            <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        {mode === "up" ? (
          <div className="space-y-1.5">
            <Label htmlFor="join-name">Name</Label>
            <Input
              id="join-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="The name others will see"
              autoComplete="name"
            />
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="join-email">Email</Label>
          <Input
            id="join-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="join-password">Password</Label>
          <Input
            id="join-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "up" ? "new-password" : "current-password"}
          />
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Please wait…" : mode === "up" ? "Join the hub" : "Sign in with email"}
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-[11px] tracking-wide text-faint uppercase">
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-2">
        {GROK_PROVIDERS.map((provider) => (
          <Button
            key={provider.providerId}
            type="button"
            variant="outline"
            onClick={() =>
              void signIn(provider.providerId, {
                callbackURL: "/welcome",
                errorCallbackURL: "/login?error=signin",
              }).catch((err) =>
                setError(err instanceof Error ? err.message : "Could not sign in."),
              )
            }
          >
            Continue with {provider.label}
          </Button>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 text-sm text-muted hover:text-fg"
        onClick={() => {
          setMode(mode === "up" ? "in" : "up");
          setError(null);
        }}
      >
        {mode === "up" ? "Already in the hub? Sign in" : "New here? Join the hub"}
      </button>
    </>
  );
}
