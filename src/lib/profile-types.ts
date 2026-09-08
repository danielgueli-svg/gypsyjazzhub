export const PROFILE_TYPES = [
  { id: "musician", label: "Musician" },
  { id: "photographer", label: "Photographer" },
  { id: "fan", label: "Fan / listener" },
  { id: "teacher", label: "Teacher" },
  { id: "booker", label: "Booker" },
  { id: "organizer", label: "Organizer" },
  { id: "videographer", label: "Videographer" },
] as const;

export type ProfileTypeId = (typeof PROFILE_TYPES)[number]["id"];

export const INSTRUMENT_OPTIONS = [
  { id: "guitar", label: "Guitar" },
  { id: "violin", label: "Violin" },
  { id: "double-bass", label: "Double bass" },
  { id: "accordion", label: "Accordion" },
  { id: "clarinet", label: "Clarinet" },
  { id: "vocals", label: "Vocals" },
  { id: "other", label: "Other" },
] as const;

export type InstrumentId = (typeof INSTRUMENT_OPTIONS)[number]["id"];

const TYPE_IDS = new Set<string>(PROFILE_TYPES.map((row) => row.id));

export function parseProfileTypes(raw: string | undefined | null): ProfileTypeId[] {
  const found = (raw ?? "")
    .split(",")
    .map((part) => part.trim().toLowerCase())
    .filter((id): id is ProfileTypeId => TYPE_IDS.has(id));
  return [...new Set(found)];
}

export function typesFromMemberKind(
  types: ProfileTypeId[],
  memberKind?: string | null,
): ProfileTypeId[] {
  if (types.length) return types;
  return memberKind === "fan" ? ["fan"] : ["musician"];
}

export function isMusician(types: ProfileTypeId[]) {
  return types.includes("musician");
}

export function serializeTypes(types: ProfileTypeId[]) {
  return [...new Set(types)].join(",");
}

export function parseInstrumentIds(raw: string | undefined | null): InstrumentId[] {
  const text = (raw ?? "").toLowerCase();
  if (!text.trim()) return [];
  const found: InstrumentId[] = [];
  if (/\bguitar|selmer|la pompe|manouche guitar/.test(text)) found.push("guitar");
  if (/\bviolin|fiddle|\bviola\b/.test(text)) found.push("violin");
  if (/\bbass|contrebasse|upright/.test(text)) found.push("double-bass");
  if (/\baccordion|accordeon/.test(text)) found.push("accordion");
  if (/\bclarinet/.test(text)) found.push("clarinet");
  if (/\bvocal|voice|singer|chant/.test(text)) found.push("vocals");
  if (/\bother\b/.test(text)) found.push("other");
  if (!found.length && text.trim()) found.push("other");
  return [...new Set(found)];
}

export function serializeInstruments(ids: InstrumentId[]) {
  const labels = INSTRUMENT_OPTIONS.filter((row) => ids.includes(row.id)).map((row) => row.label);
  return labels.join(", ");
}

export function typeLabel(id: string) {
  return PROFILE_TYPES.find((row) => row.id === id)?.label ?? id;
}

export function instrumentLabel(id: string) {
  return INSTRUMENT_OPTIONS.find((row) => row.id === id)?.label ?? id;
}
