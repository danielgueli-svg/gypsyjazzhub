-- Sourced Yorkshire Gypsy Swing Collective bios. Catalog TypeScript is the
-- public copy; hub_artist_bios wins over the live HubDb stub on
-- /musicians/yorkshire-gypsy-swing-collective after Workers apply this file.
-- No concert rows. Violinist spelling is Magee (his own mail).
insert into hub_artist_bios (artist_slug, bio, submitted_by, submitted_name, status)
values
  (
    'yorkshire-gypsy-swing-collective',
    'Yorkshire Gypsy Swing Collective is a gypsy jazz group from around Yorkshire. Lewis Kilvington and Martin Chung on guitar, James Munroe on double bass, Derek Magee on violin, Christine Pinkard on clarinet. They stay in the spirit of Django Reinhardt and Stéphane Grappelli, with fast swing, ballads, and some Latin pieces. Jazz Leeds bills the group as featured in Guitarist magazine on the Django Reinhardt legacy; the March 2023 piece (also on Guitar World, 7 March 2023, Denny Ilett) interviews Lewis Kilvington among six guitarists, not the band as a whole.',
    'catalog',
    'Gypsy Jazz Hub',
    'published'
  ),
  (
    'lewis-kilvington',
    'Lewis Kilvington plays guitar with the Yorkshire Gypsy Swing Collective. He comes from a musical family. His father is a pianist inspired by Jerry Lee Lewis, hence the name. He describes his approach as “Django with a modern twist.” He is involved in the Collective, “a group dedicated to playing music inspired by Django.” He says he feels lucky to share and teach Django’s music, and that his younger students react to Django with amazement.',
    'catalog',
    'Gypsy Jazz Hub',
    'published'
  ),
  (
    'martin-chung',
    'Martin Chung is a Yorkshire guitarist and composer. He plays guitar with the Yorkshire Gypsy Swing Collective. His own site is https://martinchungmusic.wordpress.com/. A public post of his mentions the Collective and an Eastman DM1.',
    'catalog',
    'Gypsy Jazz Hub',
    'published'
  ),
  (
    'james-munroe',
    'James Munroe plays double bass with the Yorkshire Gypsy Swing Collective, based in Yorkshire, United Kingdom.',
    'catalog',
    'Gypsy Jazz Hub',
    'published'
  ),
  (
    'derek-magee',
    'Derek Magee plays violin with the Yorkshire Gypsy Swing Collective, based in Yorkshire, United Kingdom.',
    'catalog',
    'Gypsy Jazz Hub',
    'published'
  ),
  (
    'christine-pinkard',
    'Christine Pinkard plays clarinet with the Yorkshire Gypsy Swing Collective, based in Yorkshire, United Kingdom.',
    'catalog',
    'Gypsy Jazz Hub',
    'published'
  )
on conflict (artist_slug) do update set
  bio = excluded.bio,
  submitted_by = excluded.submitted_by,
  submitted_name = excluded.submitted_name,
  status = excluded.status,
  updated_at = now();

update legends set
  bio = 'Yorkshire Gypsy Swing Collective is a gypsy jazz group from around Yorkshire. Lewis Kilvington and Martin Chung on guitar, James Munroe on double bass, Derek Magee on violin, Christine Pinkard on clarinet. They stay in the spirit of Django Reinhardt and Stéphane Grappelli, with fast swing, ballads, and some Latin pieces. Jazz Leeds bills the group as featured in Guitarist magazine on the Django Reinhardt legacy; the March 2023 piece (also on Guitar World, 7 March 2023, Denny Ilett) interviews Lewis Kilvington among six guitarists, not the band as a whole.',
  bio_status = 'ok',
  origin = 'Yorkshire, United Kingdom',
  years = 'Yorkshire, United Kingdom',
  instruments = 'Guitar, violin, clarinet, double bass',
  youtube_url = 'https://www.youtube.com/watch?v=GgDYOZTgeYg',
  photo_url = '/groups/yorkshire-gypsy-swing-collective.jpg',
  photo_credit = 'Lewis Kilvington trailer still',
  notable = 'Yorkshire gypsy jazz; Guitarist magazine Django legacy feature',
  era = 'The Circle'
where slug = 'yorkshire-gypsy-swing-collective';
