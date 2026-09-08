import { createFileRoute, Link } from "@tanstack/react-router";
import { BACKING, BOOKS, CHARTS } from "@/lib/resources";

export const Route = createFileRoute("/learn/charts")({
  component: ChartsPage,
});

function ChartsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Link to="/learn" className="text-sm text-muted hover:text-fg">
        ← Learn gypsy jazz
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">Practice</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Charts & backing</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        A short shelf. Free charts on DjangoBooks, paid apps for the pocket, and
        a pompe you can play along with.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Charts</h2>
        <ul className="mt-5 space-y-3">
          {CHARTS.map((chart) => (
            <li key={chart.name} className="rounded-2xl bg-surface px-5 py-4 shadow-border">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{chart.level}</p>
              <a href={chart.href} target="_blank" rel="noreferrer" className="mt-1 block font-display text-2xl font-semibold hover:underline">
                {chart.name}
              </a>
              <p className="mt-2 text-sm text-muted">{chart.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Books</h2>
        <ul className="mt-5 space-y-3">
          {BOOKS.map((book) => (
            <li key={book.name} className="rounded-2xl bg-surface px-5 py-4 shadow-border">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{book.maker}</p>
              <a href={book.href} target="_blank" rel="noreferrer" className="mt-1 block font-display text-2xl font-semibold hover:underline">
                {book.name}
              </a>
              <p className="mt-2 text-sm text-muted">{book.note}</p>
              {"buy" in book && book.buy ? (
                <a href={book.buy} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm hover:underline">
                  Buy / download
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-3xl font-semibold">Backing tracks</h2>
        <ul className="mt-5 space-y-3">
          {BACKING.map((row) => (
            <li key={row.name} className="rounded-2xl bg-surface px-5 py-4 shadow-border">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{row.maker}</p>
              <a href={row.href} className="mt-1 block font-display text-2xl font-semibold hover:underline">
                {row.name}
              </a>
              <p className="mt-2 text-sm text-muted">{row.note}</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-12 text-sm text-muted">
        Apps in more detail:{" "}
        <Link to="/learn/apps" className="hover:underline">
          Learn / apps
        </Link>
        .
      </p>
    </main>
  );
}
