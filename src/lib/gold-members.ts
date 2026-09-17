/** Named gold invites — upgraded the moment they join. */

const GOLD_NAMES = new Set(["charles draper", "charles drapers"]);
const GOLD_EMAILS = new Set<string>([
  // Add his address here if he mails it before joining.
]);

export const CHARLES_DRAPER = {
  slug: "charles-draper",
  name: "Charles Draper",
  role: "Jazz Booker Asia",
  city: "Hong Kong",
  country: "Hong Kong",
  path: "/bookers/charles-draper",
};

export function isGoldInvite(name?: string | null, email?: string | null) {
  const n = (name ?? "").trim().toLowerCase().replace(/\s+/g, " ");
  const e = (email ?? "").trim().toLowerCase();
  if (e && GOLD_EMAILS.has(e)) return true;
  if (n && GOLD_NAMES.has(n)) return true;
  return false;
}

export function isCharlesDraperSlug(slug?: string | null) {
  return (slug ?? "").trim().toLowerCase() === CHARLES_DRAPER.slug;
}
