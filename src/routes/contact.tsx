import { createFileRoute } from "@tanstack/react-router";
import { ContactForm } from "@/components/contact-form";
import { PUBLIC_CONTACT_EMAIL } from "@/lib/hub-owner";
import { useI18n } from "@/lib/i18n";
import { pageHead, SEO } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => pageHead(SEO.contact),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("contact.kicker")}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{t("contact.title")}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">{t("contact.lead")}</p>
      <p className="mt-3 text-sm text-muted">
        <a href={`mailto:${PUBLIC_CONTACT_EMAIL}`} className="hover:underline">
          {PUBLIC_CONTACT_EMAIL}
        </a>
      </p>

      <section className="mt-10 max-w-2xl rounded-2xl bg-surface p-6 shadow-border">
        <ContactForm />
      </section>
    </main>
  );
}
