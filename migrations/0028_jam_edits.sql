alter table hub_jams add column if not exists updated_at timestamptz not null default now();
alter table hub_jams add column if not exists updated_by text not null default '';
