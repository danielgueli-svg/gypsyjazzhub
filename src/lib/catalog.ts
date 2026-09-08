import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { slugify, youtubeVideoId } from "@/lib/utils";

export type CatalogArtist = {
  slug: string;
  name: string;
  kind: "legend" | "musician";
  created: boolean;
};

const STUB_BIO =
  "On the gypsy jazz circuit. This page opened from a date, jam or clip on the hub — a short bio will follow when we have a sourced line.";

export async function ensureCatalogColumns() {
  const sql = await getSql();
  await sql.query(`alter table legends add column if not exists photo_url text not null default ''`);
  await sql.query(`alter table legends add column if not exists photo_credit text not null default ''`);
  await sql.query(`alter table legends add column if not exists website_url text not null default ''`);
  await sql.query(`alter table legends add column if not exists instagram_url text not null default ''`);
  await sql.query(`alter table legends add column if not exists spotify_url text not null default ''`);
  await sql.query(`alter table legends add column if not exists catalog_source text not null default 'seed'`);
  await sql.query(`alter table legends add column if not exists bio_status text not null default 'ok'`);
}

function prettyName(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/\s/.test(trimmed)) return trimmed.replace(/\s+/g, " ");
  return trimmed
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function ensureCatalogArtist(input: {
  name?: string;
  slug?: string;
  instruments?: string;
  origin?: string;
  youtubeUrl?: string;
  notable?: string;
}): Promise<CatalogArtist | null> {
  await ensureCatalogColumns();
  const sql = await getSql();
  const wantSlug = slugify(input.slug || input.name || "");
  const wantName = prettyName(input.name || input.slug || "");
  if (!wantSlug && !wantName) return null;

  if (wantSlug) {
    const bySlug = await sql<{ slug: string; name: string }>`
      select slug, name from legends where slug = ${wantSlug} limit 1
    `;
    if (bySlug[0]) return { slug: bySlug[0].slug, name: bySlug[0].name, kind: "legend", created: false };
    const profile = await sql<{ slug: string; display_name: string }>`
      select slug, display_name from profiles where slug = ${wantSlug} limit 1
    `;
    if (profile[0]) {
      return {
        slug: profile[0].slug,
        name: profile[0].display_name,
        kind: "musician",
        created: false,
      };
    }
  }

  if (wantName) {
    const byName = await sql<{ slug: string; name: string }>`
      select slug, name from legends where lower(name) = ${wantName.toLowerCase()} limit 1
    `;
    if (byName[0]) return { slug: byName[0].slug, name: byName[0].name, kind: "legend", created: false };
    const profile = await sql<{ slug: string; display_name: string }>`
      select slug, display_name from profiles
      where lower(display_name) = ${wantName.toLowerCase()} limit 1
    `;
    if (profile[0]) {
      return {
        slug: profile[0].slug,
        name: profile[0].display_name,
        kind: "musician",
        created: false,
      };
    }
  }

  let slug = wantSlug || slugify(wantName);
  for (let i = 0; i < 20; i += 1) {
    const candidate = i === 0 ? slug : `${slug}-${i + 1}`;
    const taken = await sql<{ n: number }>`select 1 as n from legends where slug = ${candidate} limit 1`;
    if (!taken[0]) {
      slug = candidate;
      break;
    }
  }

  const youtube = input.youtubeUrl?.trim() ?? "";
  const videoId = youtubeVideoId(youtube);
  const photoUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
  const photoCredit = videoId ? "YouTube" : "";
  const origin = (input.origin ?? "").trim();
  const instruments = (input.instruments ?? "").trim();
  const notable = (input.notable ?? "Opened from the hub calendar").trim();

  await sql`
    insert into legends (
      slug, name, years, origin, instruments, era, bio, notable, youtube_url, sort_order, samois,
      photo_url, photo_credit, website_url, instagram_url, spotify_url, catalog_source, bio_status
    ) values (
      ${slug}, ${wantName || prettyName(slug)}, ${origin}, ${origin}, ${instruments},
      ${"The Circle"}, ${STUB_BIO}, ${notable}, ${youtube}, ${900}, ${false},
      ${photoUrl}, ${photoCredit}, ${""}, ${""}, ${""}, ${"auto"}, ${"stub"}
    )
    on conflict (slug) do nothing
  `;
  return { slug, name: wantName || prettyName(slug), kind: "legend", created: true };
}

async function requireOwner(userId: string) {
  const sql = await getSql();
  const rows = await sql<{ user_id: string }>`select user_id from hub_owners where user_id = ${userId} limit 1`;
  if (!rows[0]) throw new Error("Owner desk is only for the hub owner.");
}

export type CatalogStub = {
  slug: string;
  name: string;
  origin: string;
  instruments: string;
  bio: string;
  photoUrl: string;
  youtubeUrl: string;
  bioStatus: string;
};

export const listCatalogStubs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await requireOwner(context.userId);
    await ensureCatalogColumns();
    const sql = await getSql();
    const rows = await sql<{
      slug: string;
      name: string;
      origin: string;
      instruments: string;
      bio: string;
      photo_url: string;
      youtube_url: string;
      bio_status: string;
    }>`
      select slug, name, origin, instruments, bio, photo_url, youtube_url, bio_status
      from legends
      where catalog_source = 'auto' or bio_status = 'stub'
      order by name
    `;
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      origin: row.origin,
      instruments: row.instruments,
      bio: row.bio,
      photoUrl: row.photo_url,
      youtubeUrl: row.youtube_url,
      bioStatus: row.bio_status,
    })) satisfies CatalogStub[];
  });

type Enrichment = {
  bio?: string;
  instruments?: string;
  origin?: string;
  website?: string;
  youtube?: string;
  instagram?: string;
  spotify?: string;
  skip?: boolean;
};

function parseEnrichment(text: string): Enrichment | null {
  const trimmed = text.trim();
  const fenced = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = fenced.indexOf("{");
  const end = fenced.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(fenced.slice(start, end + 1)) as Enrichment;
  } catch {
    return null;
  }
}

async function askGrokForBio(name: string, origin: string): Promise<Enrichment | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const messages = [
    {
      role: "system",
      content:
        "You write short gypsy jazz / jazz manouche musician bios for Gypsy Jazz Hub. Only use facts you can source from the artist's site, a festival/concert page, or a reliable interview. Never invent dates, bands, or cities. If you cannot source a bio, return {\"skip\":true}. Reply with JSON only.",
    },
    {
      role: "user",
      content: `Write a 3–6 sentence bio for gypsy jazz musician or band "${name}"${origin ? ` (linked to ${origin})` : ""}. Tone: warm, neutral, community. JSON keys: bio, instruments, origin, website, youtube, instagram, spotify, skip.`,
    },
  ];
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 500,
      search_parameters: { mode: "on", return_citations: true },
      messages,
    }),
  });
  if (!res.ok) {
    const fallback = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model: "grok-4.5", max_tokens: 500, messages }),
    });
    if (!fallback.ok) return null;
    const body = (await fallback.json()) as { choices?: { message?: { content?: string } }[] };
    return parseEnrichment(body.choices?.[0]?.message?.content ?? "");
  }
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return parseEnrichment(body.choices?.[0]?.message?.content ?? "");
}

export const enrichCatalogBios = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { limit?: number } = {}) => input)
  .handler(async ({ context, data }) => {
    await requireOwner(context.userId);
    await ensureCatalogColumns();
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, reason: "AI is not available here.", filled: 0, skipped: 0 };
    }
    const sql = await getSql();
    const limit = Math.min(Math.max(data.limit ?? 5, 1), 8);
    const stubs = await sql<{
      slug: string;
      name: string;
      origin: string;
      instruments: string;
      youtube_url: string;
    }>`
      select slug, name, origin, instruments, youtube_url
      from legends
      where bio_status = 'stub' or (catalog_source = 'auto' and (bio = ${STUB_BIO} or length(bio) < 80))
      order by name
      limit ${limit}
    `;
    let filled = 0;
    let skipped = 0;
    for (const stub of stubs) {
      const result = await askGrokForBio(stub.name, stub.origin);
      if (!result || result.skip || !result.bio?.trim() || result.bio.trim().length < 40) {
        skipped += 1;
        continue;
      }
      const youtube = (result.youtube || stub.youtube_url || "").trim();
      const videoId = youtubeVideoId(youtube);
      const photoUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
      await sql`
        update legends set
          bio = ${result.bio.trim()},
          instruments = ${result.instruments?.trim() || stub.instruments},
          origin = ${result.origin?.trim() || stub.origin},
          years = ${result.origin?.trim() || stub.origin},
          website_url = ${result.website?.trim() ?? ""},
          youtube_url = ${youtube},
          instagram_url = ${result.instagram?.trim() ?? ""},
          spotify_url = ${result.spotify?.trim() ?? ""},
          photo_url = case when ${photoUrl} <> '' then ${photoUrl} else photo_url end,
          photo_credit = case when ${photoUrl} <> '' then ${"YouTube"} else photo_credit end,
          notable = ${"Sourced bio"},
          bio_status = ${"ok"}
        where slug = ${stub.slug} and catalog_source = 'auto'
      `;
      filled += 1;
    }
    return { ok: true as const, filled, skipped, looked: stubs.length };
  });
