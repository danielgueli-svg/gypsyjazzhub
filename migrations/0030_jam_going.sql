-- Going list is per night. After that date the rows are deleted.
create table if not exists hub_jam_going (
  user_id text not null,
  jam_slug text not null,
  night text not null,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  primary key (user_id, jam_slug, night)
);
create index if not exists hub_jam_going_night_idx on hub_jam_going (jam_slug, night, created_at);
