-- Signed-in members can add extra labelled links and a photo URL on a
-- musician or group page. Same HubDb row as the member-edited bio
-- (hub_artist_bios). Do not invent a photo host — store a URL only.
alter table hub_artist_bios add column if not exists links text not null default '[]';
alter table hub_artist_bios add column if not exists photo_url text not null default '';
