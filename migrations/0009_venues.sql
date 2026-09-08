create table if not exists hub_venues (
  id serial primary key,
  slug text not null unique,
  name text not null,
  city text not null default '',
  country text not null,
  kind text not null default 'Club',
  site text not null default '',
  contact text not null default '',
  bio text not null default '',
  submitted_by text not null,
  submitted_name text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists hub_venues_country_idx on hub_venues (country);
