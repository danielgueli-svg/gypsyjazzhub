-- Daily unique visitors (Amsterdam day) plus hits per visitor.
create table if not exists hub_visits (
  day date not null,
  visitor_id text not null,
  hits int not null default 1,
  first_at timestamptz not null default now(),
  last_at timestamptz not null default now(),
  primary key (day, visitor_id)
);

create index if not exists hub_visits_day_idx on hub_visits (day desc);
