alter table hub_jams add column if not exists leader text not null default '';
alter table hub_jams add column if not exists leader_contact text not null default '';
