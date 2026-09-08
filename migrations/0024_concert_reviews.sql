create table if not exists concert_reviews (
  id serial primary key,
  concert_id text not null,
  artist_slug text not null,
  user_id text not null,
  author_name text not null,
  body text not null default '',
  created_at timestamptz not null default now()
);
create unique index if not exists concert_reviews_user_concert_idx
  on concert_reviews (concert_id, user_id);
create index if not exists concert_reviews_artist_idx
  on concert_reviews (artist_slug, created_at desc);
create index if not exists concert_reviews_concert_idx
  on concert_reviews (concert_id, created_at desc);

create table if not exists concert_media (
  id serial primary key,
  review_id integer not null references concert_reviews(id) on delete cascade,
  concert_id text not null,
  artist_slug text not null,
  user_id text not null,
  kind text not null,
  mime text not null,
  filename text not null,
  bytes text not null,
  created_at timestamptz not null default now()
);
create index if not exists concert_media_review_idx on concert_media (review_id);
create index if not exists concert_media_concert_idx on concert_media (concert_id);
create index if not exists concert_media_artist_idx on concert_media (artist_slug, created_at desc);
