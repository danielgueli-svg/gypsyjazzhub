import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AMP_PRODUCTS, AMP_TIPS, PIEZO_BRANDS } from "@/lib/amplification";

export const Route = createFileRoute("/learn/amplification")({
  component: AmplificationPage,
});

const KIND_LABEL = {
  amp: "Amp",
  pickup: "Pickup",
  mic: "Microphone",
  preamp: "Preamp",
} as const;

function AmplificationPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <Link to="/learn" className="text-sm text-muted hover:text-fg">
        ← Learn gypsy jazz
      </Link>
      <p className="mt-6 text-[11px] tracking-[0.2em] text-faint uppercase">On stage</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Amplification</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        How to hear a Selmer, a violin and a double bass in a room — without
        turning gypsy jazz into rock. Tips from the circuit, and links to the
        makers. I will keep adding what I use and what I hear on the festivals.
      </p>
      <p className="mt-2 text-sm text-faint">Daniel Gueli</p>

      <section className="mt-12 space-y-8">
        {AMP_TIPS.map((tip) => (
          <article key={tip.title} className="max-w-2xl">
            <h2 className="font-display text-2xl font-semibold">{tip.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{tip.body}</p>
          </article>
        ))}
      </section>

      <section id="piezo" className="mt-16 scroll-mt-24">
        <h2 className="font-display text-3xl font-semibold">Piezo</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Undersaddle, bridge-plate and contact pickups. Classic manouche is a
          magnetic Stimer — if the guitar already has a piezo, these are the
          brands, and a ToneDexter in front of the amp is how you make them
          sound like wood.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PIEZO_BRANDS.map((brand) => (
            <li key={brand.name} className="rounded-2xl bg-surface p-5 shadow-border">
              <h3 className="font-display text-xl font-semibold leading-tight">{brand.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{brand.note}</p>
              <a
                href={brand.site}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm hover:underline"
              >
                Maker website
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl font-semibold">Products</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Official maker pages — not a shop. Try them, talk to your luthier,
          then buy where you trust.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {AMP_PRODUCTS.map((item) => (
            <li key={`${item.maker}-${item.name}`} className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                {KIND_LABEL[item.kind]} · {item.for}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold leading-tight">
                {item.maker} {item.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.note}</p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <a href={item.site} target="_blank" rel="noreferrer">
                  Maker website
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
