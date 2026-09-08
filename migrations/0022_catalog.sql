alter table legends add column if not exists photo_url text not null default '';
alter table legends add column if not exists photo_credit text not null default '';
alter table legends add column if not exists website_url text not null default '';
alter table legends add column if not exists instagram_url text not null default '';
alter table legends add column if not exists spotify_url text not null default '';
alter table legends add column if not exists catalog_source text not null default 'seed';
alter table legends add column if not exists bio_status text not null default 'ok';
