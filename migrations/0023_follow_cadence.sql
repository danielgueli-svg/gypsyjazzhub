alter table hub_alert_follows add column if not exists frequency text not null default 'every';
alter table hub_alert_follows add column if not exists last_sent_at timestamptz;

create table if not exists hub_country_follows (
  user_id text not null,
  country text not null,
  frequency text not null default 'every',
  last_sent_at timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, country)
);
create index if not exists hub_country_follows_user_idx on hub_country_follows (user_id);
