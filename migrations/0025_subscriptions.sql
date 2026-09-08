create table if not exists hub_subscriptions (
  user_id text not null,
  kind text not null,
  target_id text not null,
  target_name text not null default '',
  created_at timestamptz not null default now(),
  primary key (user_id, kind, target_id)
);
create index if not exists hub_subscriptions_user_idx on hub_subscriptions (user_id);
create index if not exists hub_subscriptions_kind_idx on hub_subscriptions (kind);

alter table profiles add column if not exists profile_types text not null default '';
