create table if not exists hub_profiles (
  user_id text primary key,
  chat_name text not null,
  updated_at timestamptz not null default now()
);

create table if not exists hub_chat (
  id serial primary key,
  target_kind text not null,
  target_slug text not null,
  body text not null,
  user_id text not null,
  chat_name text not null,
  created_at timestamptz not null default now()
);
create index if not exists hub_chat_target_idx on hub_chat (target_kind, target_slug, created_at);
