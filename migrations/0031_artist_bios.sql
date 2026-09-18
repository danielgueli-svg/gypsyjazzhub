-- Member-edited bios lived only in runEnsureHub(), which is skipped on
-- Cloudflare HubDb SQLite. Concert lists also select source_id, which was
-- never migrated — a missing column made hub concerts disappear after submit.
create table if not exists hub_artist_bios (
  artist_slug text primary key,
  bio text not null,
  submitted_by text not null,
  submitted_name text not null default '',
  status text not null default 'published',
  updated_at timestamptz not null default now()
);

alter table hub_concerts add column if not exists source_id text not null default '';
