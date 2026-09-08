import type { ReactNode } from "react";
import { LuthierName } from "@/components/luthier-name";
import { ShopName } from "@/components/shop-name";
import { siteHost, type Luthier } from "@/lib/luthiers";
import type { Shop } from "@/lib/shops";
import { useI18n } from "@/lib/i18n";

function shortNote(note?: string, bio?: string) {
  const n = (note ?? "").trim();
  if (n) return n;
  const b = (bio ?? "").trim();
  if (!b) return "";
  const parts = b.split(/(?<=\.)\s+/).filter(Boolean);
  const first = parts[0] ?? b;
  const two = parts.slice(0, 2).join(" ");
  if (two.length >= 28 && two.length <= 140) return two;
  if (first.length >= 20 && first.length <= 140) return first;
  if (b.length <= 140) return b;
  const cut = b.slice(0, 140);
  const at = cut.lastIndexOf(" ");
  return (at > 40 ? cut.slice(0, at) : cut).replace(/[.,;:]+$/, "");
}

export type MakerEntry = {
  key: string;
  title: ReactNode;
  city?: string;
  site?: string;
  note?: string;
};

export function luthierEntry(row: Luthier): MakerEntry {
  return {
    key: row.slug,
    title: <LuthierName luthier={row} />,
    city: row.city,
    site: row.site,
    note: shortNote(row.note, row.bio),
  };
}

export function shopEntry(row: Shop): MakerEntry {
  return {
    key: row.slug,
    title: <ShopName shop={row} />,
    city: row.city,
    site: row.site,
    note: shortNote("", row.bio),
  };
}

export function MakerRows({ entries }: { entries: MakerEntry[] }) {
  return (
    <ul className="columns-1 gap-x-10 sm:columns-2">
      {entries.map((row) => (
        <li key={row.key} className="break-inside-avoid py-2">
          {row.title}
          {row.city ? <span className="text-sm text-muted"> · {row.city}</span> : null}
          {row.site ? (
            <p className="text-sm">
              <a
                href={row.site}
                target="_blank"
                rel="noreferrer"
                className="text-muted hover:text-fg hover:underline"
              >
                {siteHost(row.site)}
              </a>
            </p>
          ) : null}
          {row.note ? <p className="text-sm text-muted">{row.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}

export function MakerSection({
  title,
  lead,
  entries,
}: {
  title: string;
  lead?: string;
  entries: MakerEntry[];
}) {
  const { t } = useI18n();
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold">{title}</h2>
      {lead ? <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{lead}</p> : null}
      {entries.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{t("country.makersMore")}</p>
      ) : (
        <div className="mt-5">
          <MakerRows entries={entries} />
        </div>
      )}
    </section>
  );
}
