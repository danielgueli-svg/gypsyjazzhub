alter table hub_profiles add column if not exists artist_slug text not null default '';

create table if not exists hub_forum_topics (
  id serial primary key,
  slug text not null unique,
  title text not null,
  body text not null,
  user_id text not null,
  author_name text not null,
  created_at timestamptz not null default now()
);
create index if not exists hub_forum_topics_created_idx on hub_forum_topics (created_at desc);

create table if not exists hub_forum_posts (
  id serial primary key,
  topic_id integer not null references hub_forum_topics (id) on delete cascade,
  body text not null,
  user_id text not null,
  author_name text not null,
  created_at timestamptz not null default now()
);
create index if not exists hub_forum_posts_topic_idx on hub_forum_posts (topic_id, created_at);
