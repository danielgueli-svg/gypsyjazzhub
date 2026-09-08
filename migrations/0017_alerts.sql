create table if not exists hub_alert_prefs (
  user_id text primary key,
  countries text not null default '',
  kinds text not null default 'concert,jam',
  frequency text not null default 'weekly',
  enabled boolean not null default true,
  last_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists hub_alert_follows (
  user_id text not null,
  artist_slug text not null,
  artist_kind text not null default 'legend',
  artist_name text not null default '',
  created_at timestamptz not null default now(),
  primary key (user_id, artist_slug)
);
create index if not exists hub_alert_follows_user_idx on hub_alert_follows (user_id);

create table if not exists hub_alert_log (
  id serial primary key,
  user_id text not null,
  to_email text not null,
  subject text not null,
  body text not null,
  event_count integer not null default 0,
  ok boolean not null,
  detail text not null default '',
  sent_at timestamptz not null default now()
);
create index if not exists hub_alert_log_user_idx on hub_alert_log (user_id, sent_at desc);
