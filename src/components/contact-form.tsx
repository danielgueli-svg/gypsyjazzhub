import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CONTACT_TOPICS, submitContact, type ContactTopic } from "@/lib/contact";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/hub-owner";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const { t } = useI18n();
  const { user } = useCurrentUserState();
  const [name, setName] = useState(user?.displayName ?? "");
  const [email, setEmail] = useState(user?.primaryEmail ?? "");
  const [topic, setTopic] = useState<ContactTopic>("festival");
  const [eventTitle, setEventTitle] = useState("");
  const [date, setDate] = useState("");
  const [place, setPlace] = useState("");
  const [message, setMessage] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await submitContact({
        data: { name, email, topic, eventTitle, date, place, message, photoUrl, company },
      });
      setSent(true);
    } catch (err) {
      const raw = err instanceof Error ? err.message : "";
      const broken = /syntaxerror|unexpected token|failed to fetch|networkerror|load failed/i.test(
        `${err} ${raw}`,
      );
      setError(broken || !raw ? t("footer.contactError") : raw);
    } finally {
      setBusy(false);
    }
  }

  function composeMailto() {
    const subject = [topic, eventTitle].filter(Boolean).join(": ");
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Topic: ${topic}`,
      eventTitle ? `Title: ${eventTitle}` : "",
      date ? `Date: ${date}` : "",
      place ? `Place: ${place}` : "",
      photoUrl ? `Photo: ${photoUrl}` : "",
      "",
      message,
    ]
      .filter((line, index, lines) => line !== "" || lines[index - 1] !== "")
      .join("\n")
      .trim();
    return `mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodeURIComponent(`Contact — ${subject}`)}&body=${encodeURIComponent(body)}`;
  }

  if (sent) {
    return <p className="text-sm leading-relaxed text-fg">{t("footer.contactSent")}</p>;
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="grid gap-4 sm:grid-cols-2">
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
        <Label htmlFor="contact-name">{t("footer.contactName")}</Label>
        <Input
          id="contact-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          required
          maxLength={80}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-email">{t("footer.contactEmail")}</Label>
        <Input
          id="contact-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
          maxLength={120}
        />
      </div>
      <div className="sm:col-span-2">
        <p className="mb-2 text-xs font-medium tracking-wide text-muted">{t("contact.topic")}</p>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTopic(item)}
              className={cn(
                "h-11 rounded-md px-4 text-sm",
                topic === item ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
              )}
            >
              {t(`contact.topic.${item}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="contact-title">{t("contact.eventTitle")}</Label>
        <Input
          id="contact-title"
          value={eventTitle}
          onChange={(event) => setEventTitle(event.target.value)}
          required
          maxLength={140}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-date">{t("contact.date")}</Label>
        <Input
          id="contact-date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="contact-place">{t("contact.place")}</Label>
        <Input
          id="contact-place"
          value={place}
          onChange={(event) => setPlace(event.target.value)}
          maxLength={140}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="contact-message">{t("footer.contactMessage")}</Label>
        <Textarea
          id="contact-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
          maxLength={4000}
          rows={6}
        />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="contact-photo">{t("contact.photo")}</Label>
        <Input
          id="contact-photo"
          type="url"
          inputMode="url"
          value={photoUrl}
          onChange={(event) => setPhotoUrl(event.target.value)}
          placeholder="https://"
          maxLength={500}
        />
        <p className="text-xs leading-snug text-faint">{t("contact.photoHint")}</p>
      </div>
      {error ? (
        <div className="space-y-1 sm:col-span-2">
          <p className="text-sm text-danger">{error}</p>
          <a href={composeMailto()} className="text-sm text-muted hover:underline">
            {PUBLIC_CONTACT_EMAIL}
          </a>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <Button type="submit" disabled={busy}>
          {busy ? t("footer.contactSending") : t("footer.contactSend")}
        </Button>
      </div>
    </form>
  );
}
