alter table hub_concerts add column if not exists status text not null default 'published';
alter table hub_jams add column if not exists status text not null default 'published';
alter table hub_festivals add column if not exists status text not null default 'published';
alter table profiles add column if not exists spotify_url text not null default '';

create table if not exists hub_favorites (
  user_id text not null,
  kind text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, kind, slug)
);
create index if not exists hub_favorites_user_idx on hub_favorites (user_id, created_at desc);

create table if not exists hub_board (
  id serial primary key,
  kind text not null default 'looking',
  title text not null,
  body text not null default '',
  city text not null default '',
  country text not null default '',
  user_id text not null,
  author_name text not null default '',
  status text not null default 'published',
  created_at timestamptz not null default now()
);
create index if not exists hub_board_created_idx on hub_board (created_at desc);
