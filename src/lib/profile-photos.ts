import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, getDbSource } from "@/lib/db";

const MAX_IMAGE = 400_000;

export function profilePhotoUrl(userId: string, rev: number | string | null | undefined) {
  const n = Number(rev ?? 0);
  if (!userId || !Number.isFinite(n) || n <= 0) return "";
  return `/api/profile-photo/${encodeURIComponent(userId)}?v=${n}`;
}

function stripDataUrl(raw: string) {
  const trimmed = raw.trim();
  const comma = trimmed.indexOf(",");
  if (trimmed.startsWith("data:") && comma >= 0) return trimmed.slice(comma + 1);
  return trimmed;
}

function decodedSize(b64: string) {
  const clean = b64.replace(/\s/g, "");
  if (!clean) return 0;
  const pad = clean.endsWith("==") ? 2 : clean.endsWith("=") ? 1 : 0;
  return Math.max(0, Math.floor((clean.length * 3) / 4) - pad);
}

function cleanMime(mime: string) {
  const value = mime.trim().toLowerCase();
  if (value === "image/jpg") return "image/jpeg";
  return value;
}

export async function ensureProfilePhotos() {
  if (getDbSource() === "none") return;
  const sql = await getSql();
  await sql.query(`
    create table if not exists profile_photos (
      user_id text primary key,
      mime text not null,
      filename text not null,
      bytes text not null,
      updated_at text not null default (datetime('now'))
    )
  `);
  try {
    await sql.query(`alter table profiles add column photo_rev integer not null default 0`);
  } catch {
    /* column already there */
  }
}

export async function readProfilePhoto(userId: string) {
  const id = userId.trim();
  if (!id) return null;
  await ensureProfilePhotos();
  const sql = await getSql();
  const rows = await sql<{ mime: string; filename: string; bytes: string }>`
    select mime, filename, bytes from profile_photos where user_id = ${id} limit 1
  `;
  return rows[0] ?? null;
}

export const saveMyPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { filename: string; mime: string; data: string }) => input)
  .handler(async ({ context, data }) => {
    await ensureProfilePhotos();
    const mime = cleanMime(data.mime);
    if (mime !== "image/jpeg" && mime !== "image/png") {
      throw new Error("Use a JPEG or PNG photo.");
    }
    const bytes = stripDataUrl(data.data);
    if (!bytes) throw new Error("That photo did not upload. Try another file.");
    if (decodedSize(bytes) > MAX_IMAGE) {
      throw new Error("That photo is too large (400 KB max after resize).");
    }
    const filename = (data.filename.trim() || (mime === "image/png" ? "photo.png" : "photo.jpg"))
      .replace(/[^\w.\-]+/g, "-")
      .slice(0, 80);
    const sql = await getSql();
    const have = await sql<{ user_id: string }>`
      select user_id from profiles where user_id = ${context.userId} limit 1
    `;
    if (!have[0]) throw new Error("Save your page first, then add a photo.");
    await sql`
      insert into profile_photos (user_id, mime, filename, bytes, updated_at)
      values (${context.userId}, ${mime}, ${filename}, ${bytes}, now())
      on conflict (user_id) do update set
        mime = excluded.mime,
        filename = excluded.filename,
        bytes = excluded.bytes,
        updated_at = now()
    `;
    await sql`
      update profiles
      set photo_rev = coalesce(photo_rev, 0) + 1, updated_at = now()
      where user_id = ${context.userId}
    `;
    const rev = await sql<{ photo_rev: number }>`
      select photo_rev from profiles where user_id = ${context.userId} limit 1
    `;
    return { photoUrl: profilePhotoUrl(context.userId, rev[0]?.photo_rev) };
  });

export const deleteMyPhoto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfilePhotos();
    const sql = await getSql();
    await sql`delete from profile_photos where user_id = ${context.userId}`;
    try {
      await sql`update profiles set photo_rev = 0, updated_at = now() where user_id = ${context.userId}`;
    } catch {
      /* column optional on old rows */
    }
    return { photoUrl: "" };
  });
