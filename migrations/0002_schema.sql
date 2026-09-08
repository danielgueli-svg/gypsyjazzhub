create table if not exists profiles (
  user_id text primary key,
  slug text not null unique,
  display_name text not null,
  city text not null default '',
  country text not null default '',
  instruments text not null default '',
  bio text not null default '',
  website_url text not null default '',
  youtube_url text not null default '',
  instagram_url text not null default '',
  looking_for_gigs boolean not null default false,
  available_to_jam boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_slug_idx on profiles (slug);
create index if not exists profiles_city_idx on profiles (city);

create table if not exists concerts (
  id serial primary key,
  user_id text not null,
  title text not null,
  venue text not null default '',
  city text not null default '',
  country text not null default '',
  starts_at timestamptz not null,
  description text not null default '',
  ticket_url text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists concerts_starts_idx on concerts (starts_at);
create index if not exists concerts_user_idx on concerts (user_id);

create table if not exists legends (
  id serial primary key,
  slug text not null unique,
  name text not null,
  years text not null default '',
  origin text not null default '',
  instruments text not null default '',
  era text not null default '',
  bio text not null default '',
  notable text not null default '',
  youtube_url text not null default '',
  sort_order int not null default 0
);

create table if not exists legend_concerts (
  id serial primary key,
  legend_slug text not null,
  title text not null,
  venue text not null default '',
  city text not null default '',
  country text not null default '',
  starts_at timestamptz not null,
  is_historic boolean not null default false,
  note text not null default ''
);
create index if not exists legend_concerts_starts_idx on legend_concerts (starts_at);
create index if not exists legend_concerts_legend_idx on legend_concerts (legend_slug);

create table if not exists follows (
  follower_id text not null,
  musician_user_id text not null,
  created_at timestamptz not null default now(),
  primary key (follower_id, musician_user_id)
);

create table if not exists messages (
  id serial primary key,
  from_user_id text not null,
  to_user_id text not null,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_to_idx on messages (to_user_id, created_at desc);
create index if not exists messages_from_idx on messages (from_user_id, created_at desc);
