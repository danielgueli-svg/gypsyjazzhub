create table if not exists hub_rsvps (
  user_id text not null,
  kind text not null,
  target_id text not null,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  primary key (user_id, kind, target_id)
);
create index if not exists hub_rsvps_target_idx on hub_rsvps (kind, target_id, created_at);
