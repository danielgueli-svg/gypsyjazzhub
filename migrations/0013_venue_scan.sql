alter table hub_discoveries add column if not exists kind text not null default 'concert';
alter table hub_discoveries add column if not exists item_slug text not null default '';
