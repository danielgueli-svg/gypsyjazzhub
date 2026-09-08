create table if not exists hub_digest_settings (
  id integer primary key,
  email text not null default '',
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into hub_digest_settings (id, email, enabled)
  values (1, '', true)
  on conflict (id) do nothing;

create table if not exists hub_digest_log (
  id serial primary key,
  sent_at timestamptz not null default now(),
  to_email text not null,
  subject text not null,
  body text not null,
  ok boolean not null,
  detail text not null default ''
);
