import type { MailLocale } from "@/lib/welcome-mail";

const SITE = "https://www.gypsyjazzhub.com";
const MARK = `${SITE}/logo-mark.png`;

export const CONFIRM_BUTTON: Record<MailLocale, string> = {
  en: "Confirm your email",
  nl: "Bevestig je e-mail",
  fr: "Confirmer l’e-mail",
  de: "E-Mail bestätigen",
  es: "Confirmar el correo",
  it: "Conferma l’email",
  pt: "Confirmar o e-mail",
  ru: "Подтвердить почту",
  hu: "E-mail megerősítése",
  ro: "Confirmă e-mailul",
  pl: "Potwierdź e-mail",
  cs: "Potvrdit e-mail",
  sr: "Potvrdi e-poštu",
  hr: "Potvrdi e-poštu",
  ja: "メールを確認",
  ko: "이메일 확인",
  zh: "确认邮箱",
  "zh-tw": "確認信箱",
  id: "Konfirmasi email",
  th: "ยืนยันอีเมล",
  he: "אשר את האימייל",
};

export const RESET_BUTTON: Record<MailLocale, string> = {
  en: "Set your password",
  nl: "Zet je wachtwoord",
  fr: "Choisir le mot de passe",
  de: "Passwort setzen",
  es: "Elegir contraseña",
  it: "Scegli la password",
  pt: "Definir a palavra-passe",
  ru: "Задать пароль",
  hu: "Jelszó beállítása",
  ro: "Setează parola",
  pl: "Ustaw hasło",
  cs: "Nastavit heslo",
  sr: "Postavi lozinku",
  hr: "Postavi lozinku",
  ja: "パスワードを設定",
  ko: "비밀번호 설정",
  zh: "设置密码",
  "zh-tw": "設定密碼",
  id: "Atur kata sandi",
  th: "ตั้งรหัสผ่าน",
  he: "הגדר סיסמה",
};

export const SIGNIN_BUTTON: Record<MailLocale, string> = {
  en: "Sign in",
  nl: "Inloggen",
  fr: "Se connecter",
  de: "Anmelden",
  es: "Entrar",
  it: "Accedi",
  pt: "Entrar",
  ru: "Войти",
  hu: "Belépés",
  ro: "Autentificare",
  pl: "Zaloguj się",
  cs: "Přihlásit se",
  sr: "Prijavi se",
  hr: "Prijavi se",
  ja: "ログイン",
  ko: "로그인",
  zh: "登录",
  "zh-tw": "登入",
  id: "Masuk",
  th: "เข้าสู่ระบบ",
  he: "התחברות",
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "\u0026amp;")
    .replace(/</g, "\u0026lt;")
    .replace(/>/g, "\u0026gt;")
    .replace(/"/g, "\u0026quot;");
}

function autolink(escaped: string) {
  return escaped.replace(/https:\/\/[^\s&<]+/g, (url) => {
    return `<a href="${url}" style="color:#6b3e16;word-break:break-all;text-decoration:underline;">${url}</a>`;
  });
}

function bodyHtml(text: string) {
  const trimmed = text
    .replace(/\n*(Made by Daniel Gueli|Gypsy Jazz Hub)\s*$/g, "")
    .trim();
  const blocks = trimmed.split(/\n{2,}/);
  return blocks
    .map((block) => {
      const html = autolink(escapeHtml(block).replace(/\n/g, "<br>"));
      return `<p style="margin:0 0 14px;font-size:16px;line-height:1.55;">${html}</p>`;
    })
    .join("");
}

export function wrapHubMailHtml(input: {
  body: string;
  buttonLabel?: string;
  buttonHref?: string;
  locale?: MailLocale | string;
}) {
  const dir = input.locale === "he" ? "rtl" : "ltr";
  const button =
    input.buttonHref && input.buttonLabel
      ? `<p style="margin:22px 0 8px;text-align:center;">
<a href="${escapeHtml(input.buttonHref)}" style="display:inline-block;background:#1a120e;color:#f3e6cf;padding:12px 22px;text-decoration:none;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;border-radius:8px;border:1px solid #3a3126;">${escapeHtml(input.buttonLabel)}</a>
</p>`
      : "";

  return `<!doctype html>
<html lang="${escapeHtml(String(input.locale || "en"))}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Gypsy Jazz Hub</title>
</head>
<body style="margin:0;padding:0;background:#1a120e;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1a120e;">
<tr><td align="center" style="padding:28px 12px;">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;border:1px solid #5a4634;">
<tr>
<td style="background:#c39452;padding:16px 22px;">
<table role="presentation" cellpadding="0" cellspacing="0">
<tr>
<td style="vertical-align:middle;padding-right:12px;">
<img src="${MARK}" alt="" width="48" height="48" style="display:block;border-radius:8px;border:1px solid #8a6230;">
</td>
<td style="vertical-align:middle;">
<div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.15;color:#2a1c10;font-weight:700;">Gypsy Jazz Hub</div>
<div style="font-family:Georgia,'Times New Roman',serif;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#5a3a18;margin-top:4px;">The living room of gypsy jazz</div>
</td>
</tr>
</table>
</td>
</tr>
<tr>
<td dir="${dir}" style="background:#faf6ef;color:#2a1c10;padding:28px 26px 22px;font-family:Georgia,'Times New Roman',serif;">
${bodyHtml(input.body)}
${button}
</td>
</tr>
<tr>
<td style="background:#2a2118;color:#d4c7b4;padding:16px 22px;text-align:center;font-family:Georgia,'Times New Roman',serif;font-size:12px;line-height:1.5;">
<a href="${SITE}" style="color:#f3e6cf;text-decoration:none;">gypsyjazzhub.com</a>
&nbsp;·&nbsp;Made by Daniel Gueli
</td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
