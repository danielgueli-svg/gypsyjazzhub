create table if not exists hub_discoveries (
  id serial primary key,
  fingerprint text not null unique,
  title text not null,
  artist_name text not null default '',
  artist_slug text not null default '',
  venue text not null default '',
  city text not null default '',
  country text not null default '',
  starts_at timestamptz,
  festival_slug text not null default '',
  sources_json text not null default '[]',
  trusted_festival boolean not null default false,
  status text not null default 'hold',
  reason text not null default '',
  concert_id integer,
  scanned_at timestamptz not null default now(),
  published_at timestamptz
);
create index if not exists hub_discoveries_status_idx on hub_discoveries (status);
create index if not exists hub_discoveries_starts_idx on hub_discoveries (starts_at);
