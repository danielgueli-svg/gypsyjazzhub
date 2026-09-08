create table if not exists hub_country_requests (
  id serial primary key,
  country_name text not null,
  slug text not null,
  city text not null default '',
  kind text not null default 'page',
  note text not null default '',
  submitted_by text not null,
  submitted_name text not null default '',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists hub_country_requests_status_idx on hub_country_requests (status, created_at desc);

create table if not exists hub_countries (
  slug text primary key,
  name text not null,
  requested_by text not null default '',
  created_at timestamptz not null default now()
);
