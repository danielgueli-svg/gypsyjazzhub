import { mergePageLinks, pageLinkAttrs, type HubArtistLink } from "@/lib/artist-page";

export function PageLinks({
  catalog = [],
  extra = [],
}: {
  catalog?: { href: string; label: string }[];
  extra?: HubArtistLink[];
}) {
  const links = mergePageLinks(catalog, extra);
  if (!links.length) return null;
  return (
    <p className="mt-4 flex flex-col items-start gap-1 text-sm">
      {links.map((link) => (
        <a
          key={`${link.label}|${link.href}`}
          href={link.href}
          className="text-muted hover:text-fg hover:underline"
          {...pageLinkAttrs(link.href)}
        >
          {link.label}
        </a>
      ))}
    </p>
  );
}
