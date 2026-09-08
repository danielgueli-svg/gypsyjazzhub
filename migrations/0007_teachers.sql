create table if not exists hub_teachers (
  id serial primary key,
  country_slug text not null,
  name text not null,
  instruments text not null default '',
  contact text not null default '',
  note text not null default '',
  user_id text not null,
  created_at timestamptz not null default now()
);
create index if not exists hub_teachers_country_idx on hub_teachers (country_slug);
