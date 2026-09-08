import { createFileRoute, Link } from "@tanstack/react-router";
import { InstrumentCards } from "@/components/instrument-cards";
import { LearnJump } from "@/components/learn-jump";
import { instrumentChrome } from "@/lib/instruments-copy";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/learn/instruments/")({
  component: InstrumentsHubPage,
});

function InstrumentsHubPage() {
  const { locale } = useI18n();
  const chrome = instrumentChrome(locale);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <LearnJump />
      <Link to="/learn" className="text-sm text-muted hover:text-fg">
        {chrome.back}
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">{chrome.kicker}</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">{chrome.hub}</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{chrome.lead}</p>
      <InstrumentCards />
    </main>
  );
}
