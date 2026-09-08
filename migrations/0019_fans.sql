alter table profiles add column if not exists member_kind text not null default 'musician';
alter table profiles add column if not exists open_for_invites boolean not null default false;
create index if not exists profiles_member_kind_idx on profiles (member_kind);
create index if not exists profiles_open_invites_idx on profiles (open_for_invites) where open_for_invites = true;

create table if not exists hub_jam_invites (
  id serial primary key,
  jam_slug text not null,
  jam_name text not null default '',
  city text not null default '',
  country text not null default '',
  starts_at timestamptz,
  from_user_id text not null,
  to_user_id text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists hub_jam_invites_to_idx on hub_jam_invites (to_user_id, created_at desc);
create index if not exists hub_jam_invites_jam_idx on hub_jam_invites (jam_slug);
create unique index if not exists hub_jam_invites_once_idx on hub_jam_invites (jam_slug, to_user_id);
