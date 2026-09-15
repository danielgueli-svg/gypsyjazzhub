import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { authClient, authEnabled, setBearerToken } from "@/lib/auth/client";
import { takeReturnTo } from "@/lib/auth/return-to";
import { loginAccountHint } from "@/lib/hub-api";
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

function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  hint,
  show,
  onToggle,
  showLabel,
  hideLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  hint?: string;
  show: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        <button
          type="button"
          className="text-xs text-muted hover:text-fg"
          onClick={onToggle}
        >
          {show ? hideLabel : showLabel}
        </button>
      </div>
      <Input
        id={id}
        type={show ? "text" : "password"}
        required
        minLength={8}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
      />
      {hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function JoinForm({ defaultMode = "up" }: { defaultMode?: "in" | "up" }) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">(defaultMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    if (firstTime) {
      await navigate({ to: "/studio", search: { tab: "page" } });
      return;
    }
    await navigate({ to: "/studio" });
  }

  async function onEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const trap = event.currentTarget.querySelector<HTMLInputElement>('input[name="company_url"]')?.value?.trim();
    if (trap) {
      await navigate({ to: "/verify-email" });
      return;
    }
    if (mode === "up" && password !== passwordAgain) {
      setError(t("login.passwordMismatch"));
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
          // Auth hook already sends the welcome / confirm mail. Land on the
          // hub profile so they can fill it in; the mail is not the login.
          await goAfterLogin(true);
          return;
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
          if (/PASSWORD_TOO_SHORT|too short/i.test(raw)) {
            throw new Error(t("login.passHint"));
          }
          const hint = await loginAccountHint({ data: email }).catch(() => ({ hint: "generic" as const }));
          if (hint.hint === "no-password") throw new Error(t("login.noPass"));
          throw new Error(
            raw.includes("PASSWORD") || /invalid/i.test(raw) ? t("login.badPass") : raw || t("login.fail"),
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

  if (isPending) {
    return <div className="h-48 animate-pulse rounded-xl bg-raised" aria-hidden="true" />;
  }
  if (user) {
    return <Navigate to="/studio" search={defaultMode === "up" ? { tab: "page" } : {}} />;
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
          <p className="text-sm leading-relaxed text-muted">{t("login.formSteps")}</p>
        ) : null}
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
          <Label htmlFor="join-email">{mode === "up" ? t("login.emailStep") : t("login.email")}</Label>
          <Input
            id="join-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <PasswordField
          id="join-password"
          label={mode === "up" ? t("login.passwordChoose") : t("login.password")}
          value={password}
          onChange={setPassword}
          autoComplete={mode === "up" ? "new-password" : "current-password"}
          hint={mode === "up" ? t("login.passHint") : undefined}
          show={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
          showLabel={t("login.showPass")}
          hideLabel={t("login.hidePass")}
        />
        {mode === "up" ? (
          <PasswordField
            id="join-password-again"
            label={t("login.passwordAgain")}
            value={passwordAgain}
            onChange={setPasswordAgain}
            autoComplete="new-password"
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            showLabel={t("login.showPass")}
            hideLabel={t("login.hidePass")}
          />
        ) : null}
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? t("login.wait") : mode === "up" ? t("login.submitUp") : t("login.submitIn")}
        </Button>
        {mode === "up" ? <p className="text-xs leading-relaxed text-muted">{t("login.afterJoin")}</p> : null}
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
