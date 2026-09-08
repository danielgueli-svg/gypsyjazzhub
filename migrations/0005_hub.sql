create table if not exists hub_concerts (
  id serial primary key,
  artist_slug text not null,
  artist_name text not null,
  artist_kind text not null default 'legend',
  title text not null,
  venue text not null default '',
  city text not null default '',
  country text not null,
  starts_at timestamptz not null,
  note text not null default '',
  submitted_by text not null,
  submitted_name text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists hub_concerts_artist_idx on hub_concerts (artist_slug);
create index if not exists hub_concerts_starts_idx on hub_concerts (starts_at);

create table if not exists hub_clips (
  id serial primary key,
  artist_slug text not null,
  title text not null default '',
  youtube_url text not null,
  submitted_by text not null,
  submitted_name text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists hub_clips_artist_idx on hub_clips (artist_slug);

create table if not exists hub_notes (
  id serial primary key,
  artist_slug text not null,
  body text not null,
  submitted_by text not null,
  submitted_name text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists hub_notes_artist_idx on hub_notes (artist_slug);

create table if not exists hub_festivals (
  id serial primary key,
  slug text not null unique,
  name text not null,
  city text not null default '',
  country text not null,
  when_text text not null default '',
  next_starts_at timestamptz not null,
  bio text not null default '',
  site text not null default '',
  submitted_by text not null,
  submitted_name text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists hub_jams (
  id serial primary key,
  slug text not null unique,
  name text not null,
  city text not null default '',
  country text not null,
  venue text not null default '',
  when_text text not null default '',
  next_starts_at timestamptz not null,
  bio text not null default '',
  submitted_by text not null,
  submitted_name text not null default '',
  created_at timestamptz not null default now()
);
