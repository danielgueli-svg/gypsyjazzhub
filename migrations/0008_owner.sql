create table if not exists hub_owners (
  user_id text primary key,
  claimed_at timestamptz not null default now()
);
