-- SQLite (Cloudflare Durable Object) rejects ADD COLUMN with a non-constant
-- default such as now() / datetime('now'). Use a constant default instead.
alter table hub_jams add column if not exists updated_at timestamptz not null default '';
alter table hub_jams add column if not exists updated_by text not null default '';
