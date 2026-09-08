import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

export type FavoriteKind = "jam" | "country" | "artist";

export type Favorite = {
  kind: FavoriteKind;
  slug: string;
  createdAt: string;
};

async function ensureFavorites() {
  const sql = await getSql();
  await sql.query(`
    create table if not exists hub_favorites (
      user_id text not null,
      kind text not null,
      slug text not null,
      created_at timestamptz not null default now(),
      primary key (user_id, kind, slug)
    )
  `);
}

export const listMyFavorites = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureFavorites();
    const sql = await getSql();
    const rows = await sql<{ kind: string; slug: string; created_at: unknown }>`
      select kind, slug, created_at from hub_favorites
      where user_id = ${context.userId}
      order by created_at desc
    `;
    return rows.map((row) => ({
      kind: row.kind as FavoriteKind,
      slug: row.slug,
      createdAt: String(row.created_at),
    })) satisfies Favorite[];
  });

export const isFavorite = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { kind: FavoriteKind; slug: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureFavorites();
    const sql = await getSql();
    const rows = await sql<{ n: number }>`
      select 1 as n from hub_favorites
      where user_id = ${context.userId} and kind = ${data.kind} and slug = ${data.slug}
      limit 1
    `;
    return Boolean(rows[0]);
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: FavoriteKind; slug: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureFavorites();
    const sql = await getSql();
    const existing = await sql<{ n: number }>`
      select 1 as n from hub_favorites
      where user_id = ${context.userId} and kind = ${data.kind} and slug = ${data.slug}
      limit 1
    `;
    if (existing[0]) {
      await sql`
        delete from hub_favorites
        where user_id = ${context.userId} and kind = ${data.kind} and slug = ${data.slug}
      `;
      return { saved: false };
    }
    await sql`
      insert into hub_favorites (user_id, kind, slug)
      values (${context.userId}, ${data.kind}, ${data.slug})
    `;
    return { saved: true };
  });
