import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient, authEnabled, setBearerToken } from "@/lib/auth/client";
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
  const { user } = useCurrentUserState();
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
          if (!alreadyMember(message)) {
            throw new Error(message.trim() || t("login.joinFail"));
          }
          firstTime = false;
          const existing = await authClient.signIn.email({
            email,
            password,
            rememberMe: true,
          });
          keepToken(existing);
          if (existing.error) {
            throw new Error(t("login.already"));
          }
        } else {
          try {
            const sent = await startHubEmailVerification();
            await navigate({ to: "/verify-email", search: { token: sent.token } });
            return;
          } catch {
            await goAfterLogin(true);
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
          const raw = result.error.message ?? "";
          throw new Error(
            /PASSWORD_TOO_SHORT|too short/i.test(raw)
              ? t("login.passHint")
              : raw.includes("PASSWORD") || /invalid/i.test(raw)
                ? t("login.badPass")
                : raw || t("login.fail"),
          );
        }
      }
      await goAfterLogin(firstTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.fail"));
    } finally {
      setBusy(false);
    }
  }

  if (user) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">
          {t("login.loggedInAs")} {user.displayName ?? user.primaryEmail}.
        </p>
        <Button asChild>
          <Link to="/studio">{t("nav.hubProfile")}</Link>
        </Button>
      </div>
    );
  }
  if (!authEnabled) {
    return <p className="text-sm text-muted">{t("login.disabled")}</p>;
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
            <Label htmlFor="join-name">{t("login.name")}</Label>
            <Input
              id="join-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("login.namePlaceholder")}
              autoComplete="name"
            />
          </div>
        ) : null}
        <div className="space-y-1.5">
          <Label htmlFor="join-email">{t("login.email")}</Label>
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
          <Label htmlFor="join-password">{t("login.password")}</Label>
          <Input
            id="join-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "up" ? "new-password" : "current-password"}
          />
          <p className="text-xs text-muted">{t("login.passHint")}</p>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? t("login.wait") : mode === "up" ? t("login.submitUp") : t("login.submitIn")}
        </Button>
      </form>
      {mode === "in" ? (
        <p className="mt-3 text-sm">
          <Link to="/forgot-password" className="text-muted hover:text-fg hover:underline">
            {t("login.forgot")}
          </Link>
        </p>
      ) : null}
      <button
        type="button"
        className="mt-4 text-sm text-muted hover:text-fg"
        onClick={() => {
          setMode(mode === "up" ? "in" : "up");
          setError(null);
        }}
      >
        {mode === "up" ? t("login.switchToIn") : t("login.switchToUp")}
      </button>
    </>
  );
}
