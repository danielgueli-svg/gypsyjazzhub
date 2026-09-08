import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { BEGINNER_NIGHT, JAM_CHECKLIST } from "@/lib/resources";

export const Route = createFileRoute("/learn/start-jam")({
  component: StartJamPage,
});

function StartJamPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Link to="/learn" className="text-sm text-muted hover:text-fg">
        ← Learn gypsy jazz
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">How to</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Start a jam</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        A room, a night, a host, and the country page. That is the whole machine.
      </p>
      <section className="mt-10 max-w-2xl">
        <h2 className="font-display text-3xl font-semibold">Your first night</h2>
        <ul className="mt-5 space-y-3">
          {BEGINNER_NIGHT.map((line) => (
            <li key={line} className="rounded-2xl bg-surface px-5 py-4 text-sm leading-relaxed shadow-border">
              {line}
            </li>
          ))}
        </ul>
      </section>
      <ol className="mt-10 max-w-2xl space-y-4">
        {JAM_CHECKLIST.map((line, i) => (
          <li key={line} className="rounded-2xl bg-surface px-5 py-4 shadow-border">
            <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Step {i + 1}</p>
            <p className="mt-2 text-base leading-relaxed">{line}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/add" search={{ kind: "jam" }}>
            Announce a jam
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/board">Ask the board</Link>
        </Button>
      </div>
    </main>
  );
}
