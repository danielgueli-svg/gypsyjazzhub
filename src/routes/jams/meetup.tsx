import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Contribute } from "@/components/contribute";
import { CountryClicker } from "@/components/country-clicker";
import { COUNTRY_OPTIONS } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/jams/meetup")({
  component: MeetupJamPage,
});

function MeetupJamPage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const countries = [...COUNTRY_OPTIONS].sort((a, b) =>
    a.localeCompare(b, locale, { sensitivity: "base" }),
  );
  const steps = [
    { title: t("organize.1t"), body: t("organize.1b") },
    { title: t("organize.2t"), body: t("organize.2b") },
    { title: t("organize.3t"), body: t("organize.3b") },
    { title: t("organize.4t"), body: t("organize.4b") },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-10">
      <Link to="/jams" className="text-sm text-muted hover:text-fg">
        ← {t("nav.jams")}
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">
        {t("organize.kicker")}
      </p>
      <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold sm:text-5xl">
        {t("organize.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
        {t("organize.lead")}
      </p>

      <section className="mt-10 max-w-xl">
        <h2 className="font-display text-3xl font-semibold">{t("organize.countries")}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t("organize.countriesLead")}
        </p>
        <CountryClicker
          countries={countries}
          value={null}
          allowClear={false}
          layout="list"
          onChange={(slug) => {
            if (!slug) return;
            void navigate({ to: "/jams/in/$slug", params: { slug } });
          }}
        />
      </section>

      <ol className="mt-12 max-w-2xl space-y-6">
        {steps.map((step, index) => (
          <li key={step.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
            <span className="font-display text-2xl text-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display text-2xl font-semibold leading-tight">{step.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <Contribute heading={t("organize.announce")} defaultKind="jam" meetup />
    </main>
  );
}
