-- Constant default so PGLite (real timestamptz) and SQLite ADD COLUMN both accept it.
-- SQLite rejects now() / datetime('now') on ADD COLUMN.
alter table hub_jams add column if not exists updated_at timestamptz not null default '1970-01-01 00:00:00+00';
alter table hub_jams add column if not exists updated_by text not null default '';
