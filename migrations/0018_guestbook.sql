create table if not exists artist_guestbook (
  id serial primary key,
  artist_slug text not null,
  body text not null,
  user_id text not null,
  author_name text not null,
  created_at timestamptz not null default now()
);
create index if not exists artist_guestbook_slug_idx on artist_guestbook (artist_slug, created_at desc);
create index if not exists artist_guestbook_user_idx on artist_guestbook (user_id, created_at desc);
