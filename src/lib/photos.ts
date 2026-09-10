/** Real photographs only — no generated portraits. Credit the source. */
import { clipsForArtist } from "@/lib/artist-clips";
import { CHANNEL_VIDEOS } from "@/lib/channel-videos";
import { youtubeVideoId } from "@/lib/utils";

export type ArtistPhoto = {
  src: string;
  credit: string;
  href?: string;
  license?: string;
};

const LOCAL: Record<string, ArtistPhoto> = {
  "daniel-gueli": {
    src: "/artists/daniel-gueli.jpg",
    credit: "Daniel Gueli",
  },
  "django-reinhardt": {
    src: "/artists/django-reinhardt.jpg",
    credit: "William P. Gottlieb / Library of Congress",
    href: "https://www.loc.gov/pictures/item/gottlieb.07301/",
  },
  "stephane-grappelli": {
    src: "/artists/stephane-grappelli.jpg",
    credit: "William P. Gottlieb / Library of Congress",
    href: "https://www.loc.gov/pictures/collection/gottlieb/",
  },
  "joscho-stephan": {
    src: "/artists/joscho-stephan.jpg",
    credit: "Joscho Stephan / Pollert",
    href: "https://joscho-stephan.de/",
  },
  "stochelo-rosenberg": {
    src: "/artists/stochelo-rosenberg.jpg",
    credit: "Sinti Music",
    href: "https://www.sintimusic.nl/en/artists/stochelo-rosenberg/",
  },
  "mozes-rosenberg": {
    src: "/artists/mozes-rosenberg.jpg",
    credit: "Sinti Music",
    href: "https://www.sintimusic.nl/en/artists/mozes-rosenberg/",
  },
  "paulus-schafer": {
    src: "/artists/paulus-schafer.jpg",
    credit: "Sinti Music",
    href: "https://www.sintimusic.nl/en/artists/paulus-schafer/",
  },
  "popy-basily": {
    src: "/artists/popy-basily.jpg",
    credit: "Kees De Hond / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Popy_basily-1448261511.png",
    license: "CC BY-SA 4.0",
  },
  "tim-kliphuis": {
    src: "/artists/tim-kliphuis.jpg",
    credit: "Tim Kliphuis",
    href: "https://timkliphuis.com/",
  },
  "christiaan-van-hemert": {
    src: "/artists/christiaan-van-hemert.jpg",
    credit: "Christiaan van Hemert",
    href: "https://christiaanvanhemert.com/",
  },
  "costel-nitescu": {
    src: "/artists/costel-nitescu.jpg",
    credit: "Tore Sætre / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Costel_Ni%C8%9Bescu_Djangofestivalen_2025_(205324).jpg",
    license: "CC BY-SA 4.0",
  },
  "olli-soikkeli": {
    src: "/artists/olli-soikkeli.jpg",
    credit: "Olli Soikkeli",
    href: "https://www.ollisoikkeli.com/",
  },
  "denis-chang": {
    src: "/artists/denis-chang.jpg",
    credit: "Upstairs Jazz",
    href: "https://www.upstairsjazz.com/events/denis-chang-gypsy-quartet/",
  },
  "erno-kallai-kiss": {
    src: "/artists/erno-kallai-kiss.jpg",
    credit: "Fifike1978 / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:K%C3%A1llai_Kiss_Erno_Kossuth_dijas_Klarin%C3%A9tm%C3%BCv%C3%A9sz.jpg",
    license: "CC BY-SA 4.0",
  },
  "bireli-lagrene": {
    src: "/artists/bireli-lagrene.jpg",
    credit: "Biréli Lagrène",
    href: "https://birelilagrene.com/",
  },
  "angelo-debarre": {
    src: "/artists/angelo-debarre.jpg",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Angelo_Debarre_Cosmopolite_(221433).jpg",
  },
  "antoine-boyer": {
    src: "/artists/antoine-boyer.jpg",
    credit: "Tore Sætre / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Antoine_Boyer_Cosmopolite_Djangofestivalen_(224439).jpg",
    license: "CC BY-SA 4.0",
  },
  "attila-sidoo": {
    src: "/artists/attila-sidoo.jpg",
    credit: "Grandpierre Atilla / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:V%C3%A1gt%C3%A1z%C3%B3_Halottk%C3%A9mek_(1995).jpg",
    license: "CC BY-SA 3.0",
  },
  "aurore-voilque": {
    src: "/artists/aurore-voilque.jpg",
    credit: "Tore Sætre / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Aurore_Voilqu%C3%A9_Djangofestivalen_2023_(225637).jpg",
    license: "CC BY-SA 4.0",
  },
  "tchavolo-schmitt": {
    src: "/artists/tchavolo-schmitt.jpg",
    credit: "Jeronimo Vicente Cunha / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Tchavolo_Schmitt_2026_%C3%A0_Binic.jpg",
    license: "CC BY 4.0",
  },
  "fapy-lafertin": {
    src: "/artists/fapy-lafertin.jpg",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Fapy_Lafertin,_guitarist_on_stage_in_London,_1983.jpg",
  },
  "jimmy-rosenberg": {
    src: "/artists/jimmy-rosenberg.jpg",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Jimmy_Rosenberg_Djangofestivalen_2024_(232226).jpg",
  },
  "joseph-reinhardt": {
    src: "/artists/joseph-reinhardt.jpg",
    credit: "Polmeccartni / Gipsy Jazz Enciclopedia / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Joseph_reinhardt.jpg",
    license: "GFDL",
  },
  "koen-de-cauter": {
    src: "/artists/koen-de-cauter.jpg",
    credit: "Tony 1212 (Tony Rees) / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Waso-83-3.jpg",
    license: "CC BY 4.0",
  },
  "lulo-reinhardt": {
    src: "/artists/lulo-reinhardt.jpg",
    credit: "Elke Klefisch, Norbert Schikowski / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Lulo_Reinhardt.jpg",
    license: "CC BY-SA 4.0",
  },
  "andreas-oberg": {
    src: "/artists/andreas-oberg.jpg",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Andreas_Oberg_1.jpg",
  },
  "dario-napoli": {
    src: "/artists/dario-napoli.jpg",
    credit: "Dario Napoli",
    href: "https://darionapoli.com/bio/",
  },
  "georges-boulanger": {
    src: "/artists/georges-boulanger.jpg",
    credit: "Abraham Pisarek / Deutsche Fotothek / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Fotothek_df_pk_0000196_002_Portr%C3%A4t,_Dirigent_Boulanger.jpg",
    license: "CC BY-SA 3.0 DE",
  },
  "gismo-graf": {
    src: "/artists/gismo-graf.jpg",
    credit: "Gismo Graf Trio",
    href: "https://gismograf.de/",
  },
  "hansche-weiss": {
    src: "/artists/hansche-weiss.jpg",
    credit: "Godwin T. Petermann / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:H%C3%A4ns%27che_Weiss_im_Schnuckenack-reinhardt-quintett_1972a.jpg",
    license: "CC BY-SA 3.0",
  },
  "holzmanno-winterstein": {
    src: "/artists/holzmanno-winterstein.jpg",
    credit: "Godwin T. Petermann / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Schnuckenack-reinhardt-quintett_1972a.jpg",
    license: "CC BY-SA 3.0",
  },
  "holzmano-lagrene": {
    src: "/artists/holzmano-lagrene.jpg",
    credit: "Godwin T. Petermann / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Schnuckenack-reinhardt-quintett_1972a.jpg",
    license: "CC BY-SA 3.0",
  },
  "schnuckenack-reinhardt": {
    src: "/artists/schnuckenack-reinhardt.jpg",
    credit: "Godwin T. Petermann / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Schnuckenack-reinhardt-quintett_1972a.jpg",
    license: "CC BY-SA 3.0",
  },
  "david-reinhardt": {
    src: "/artists/david-reinhardt.jpg",
    credit: "Yves Moch / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:David_Reinhardt.png",
    license: "CC BY-SA 3.0",
  },
  "nitcho-reinhardt": {
    src: "/artists/nitcho-reinhardt.jpg",
    credit: "Tore Sætre / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Nitcho_Reinhardt_Djangofestivalen_2019_(212737).jpg",
    license: "CC BY-SA 4.0",
  },
  "diknu-schneeberger": {
    src: "/artists/diknu-schneeberger.jpg",
    credit: "Wolfgang H. Wögerer (User:W.) / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Diknu_Schneeberger_20090425_213.jpg",
    license: "CC BY-SA 3.0",
  },
  "christian-escoude": {
    src: "/artists/christian-escoude.jpg",
    credit: "Gampe / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Christian_Escoud%C3%A9_1984_(249-24).jpg",
    license: "CC BY-SA 4.0",
  },
  "andre-reyes": {
    src: "/artists/andre-reyes.jpg",
    credit: "Totalisimo / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Andr%C3%A9_Reyes_de_Gipsy_Kings.jpg",
    license: "CC BY-SA 4.0",
  },
  "canut-reyes": {
    src: "/artists/canut-reyes.jpg",
    credit: "Stefan Brending (2eight) / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:2018_Lieder_am_See_-_The_Original_Gypsies_-_Canut_Reyes_-_by_2eight_-_DSC1230.jpg",
    license: "CC BY-SA 3.0 DE",
  },
  "nicolas-reyes": {
    src: "/artists/nicolas-reyes.jpg",
    credit: "Sierraelizabethflach / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:NicolasReyesin2021.jpg",
    license: "CC BY-SA 4.0",
  },
  "chico-bouchikhi": {
    src: "/artists/chico-bouchikhi.jpg",
    credit: "Stefan Brending (2eight) / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:2018_Lieder_am_See_-_The_Original_Gypsies_-_Chico_Bouchikhi_-_by_2eight_-_DSC1292.jpg",
    license: "CC BY-SA 3.0 DE",
  },
  "tonino-baliardo": {
    src: "/artists/tonino-baliardo.jpg",
    credit: "Alexander Veprev (Александр Вепрёв) / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Tonino_Baliardo.JPG",
    license: "CC BY-SA 3.0",
  },
  "john-jorgenson": {
    src: "/artists/john-jorgenson.jpg",
    credit: "FloNight / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:John_Jorgenson_at_Kentucky_Coffee_Tree_Cafe.JPG",
    license: "CC BY-SA 3.0",
  },
  "roby-lakatos": {
    src: "/artists/roby-lakatos.jpg",
    credit: "Bieniecki Piotr / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Roby_Lakatos_hungarian_violinist.jpg",
    license: "CC BY-SA 4.0",
  },
  "martin-weiss": {
    src: "/artists/martin-weiss.jpg",
    credit: "Tore Sætre / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Martin_Weiss_Cosmopolite_Djangofestivalen_(213520).jpg",
    license: "CC BY-SA 4.0",
  },
  "django-wagner": {
    src: "/artists/django-wagner.jpg",
    credit: "Martijn van den Baar / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Django_wagner-1567369868.jpeg",
    license: "CC BY-SA 4.0",
  },
  "ismael-reinhardt": {
    src: "/artists/ismael-reinhardt.jpg",
    credit: "Ismael Reinhardt / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Ismael_Reinhardt_Foto_Live.jpg",
    license: "CC BY-SA 4.0",
  },
  "kussi-weiss": {
    src: "/artists/kussi-weiss.jpg",
    credit: "Chris W. Braunschweiger / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:DRF2020-Freitag-60.jpg",
    license: "CC BY-SA 3.0",
  },
  "roger-moreno-rathgeb": {
    src: "/artists/roger-moreno-rathgeb.jpg",
    credit: "Roger Moreno-Rathgeb / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Roger_Moreno-Rathgeb.jpg",
    license: "CC BY-SA 4.0",
  },
  "al-di-meola": {
    src: "/artists/al-di-meola.jpg",
    credit: "Gorupdebesanez / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Al_di_Meola,_2013_05.jpg",
    license: "CC BY-SA 3.0",
  },
  "frank-vignola": {
    src: "/artists/frank-vignola.jpg",
    credit: "Paul Comstock (Flickr) / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Frank_Vignola.jpg",
    license: "CC BY 2.0",
  },
  "bango-margit": {
    src: "/artists/bango-margit.jpg",
    credit: "Solymári / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Bang%C3%B3_Margit_(2013).jpg",
    license: "CC BY-SA 4.0",
  },
  "florin-codoba": {
    src: "/artists/florin-codoba.jpg",
    credit: "Balazs Bodor / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Florin_Codoba.JPG",
    license: "Copyrighted free use (unrestricted)",
  },
  "jermaine-landsberger": {
    src: "/artists/jermaine-landsberger.jpg",
    credit: "Walter Gehring / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:JermaineLandsberger.jpg",
    license: "CC BY-SA 4.0",
  },
  "biel-ballester": {
    src: "/artists/biel-ballester.jpg",
    credit: "Tore Sætre / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Biel_Ballester_Trio_(234143).jpg",
    license: "CC BY-SA 4.0",
  },
  "robin-nolan": {
    src: "/artists/robin-nolan.jpg",
    credit: "Robin Nolan / Jonathan Herman",
    href: "https://robinnolan.com/about/",
  },
  "sebastien-giniaux": {
    src: "/artists/sebastien-giniaux.jpg",
    credit: "Tore Sætre / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Sebastien_Giniaux_Djangofestivalen_2018_(214838).jpg",
    license: "CC BY-SA 4.0",
  },
  "nonnie-rosenberg": {
    src: "/artists/nonnie-rosenberg.jpg",
    credit: "Otourly / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Nonnie_Rosenberg1.JPG",
    license: "CC BY-SA 3.0",
  },
  "nousche-rosenberg": {
    src: "/artists/nousche-rosenberg.jpg",
    credit: "Irene Ypenburg / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Nousche_Rosenberg.jpg",
    license: "CC BY-SA 4.0",
  },
  "nuno-marinho": {
    src: "/artists/nuno-marinho.jpg",
    credit: "Nuno Marinho",
    href: "https://www.nunomarinho.com/",
  },
  "cyrille-aimee": {
    src: "/artists/cyrille-aimee.jpg",
    credit: "Cyrille Aimée / Camille Lenain",
    href: "https://cyrillemusic.com/",
  },
  "stephane-wrembel": {
    src: "/artists/stephane-wrembel.jpg",
    credit: "Stéphane Wrembel / Lawrence Sumulong",
    href: "https://www.stephanewrembel.com/",
  },
  "raphael-fays": {
    src: "/artists/raphael-fays.jpg",
    credit: "Tore Sætre / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Rapha%C3%ABl_Fa%C3%BFs_Djangofestivalen_2019_(204843).jpg",
    license: "CC BY-SA 4.0",
  },
  "remi-harris": {
    src: "/artists/remi-harris.jpg",
    credit: "Remi Harris",
    href: "https://www.remiharris.com/",
  },
  "wawau-adler": {
    src: "/artists/wawau-adler.jpg",
    credit: "Wawau Adler",
    href: "https://wawau-adler.com/bio/",
  },
  "gonzalo-bergara": {
    src: "/artists/gonzalo-bergara.jpg",
    credit: "Gonzalo Bergara",
    href: "https://www.gonzalobergara.com/",
  },
  "christine-tassan": {
    src: "/artists/christine-tassan.jpg",
    credit: "Christine Tassan",
    href: "https://christinetassan.com/bio/",
  },
  "manitas-de-plata": {
    src: "/artists/manitas-de-plata.jpg",
    credit: "Jack de Nijs / Anefo / Nationaal Archief / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Grand_Gala_du_Disque_in_de_RAI._Gitarist_Manitas_de_Platas_uit_Spanje,_Bestanddeelnr_921-1450.jpg",
    license: "CC0 1.0",
  },
  "marcel-loeffler": {
    src: "/artists/marcel-loeffler.jpg",
    credit: "Nouvel accord / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Marcel_Loeffler_2010.jpg",
    license: "CC BY-SA 3.0",
  },
  "marcia-bamberg": {
    src: "/artists/marcia-bamberg.jpg",
    credit: "Marcia Bamberg",
    href: "https://marciabamberg.nl/",
  },
  "marion-lenfant-preus": {
    src: "/artists/marion-lenfant-preus.jpg",
    credit: "Marion & Sobo Band",
    href: "https://marionandsobo.com/about/",
  },
  "martin-limberger": {
    src: "/artists/martin-limberger.jpg",
    credit: "Tore Sætre / Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Martin_Limberger_Cosmopolite_2018_(230259).jpg",
    license: "CC BY-SA 4.0",
  },
  "alexander-sobocinski": {
    src: "/artists/alexander-sobocinski.jpg",
    credit: "Marion & Sobo Band",
    href: "https://marionandsobo.com/about/",
  },
  "florin-niculescu": {
    src: "/artists/florin-niculescu.jpg",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Florin_Niculescu_Djangofestivalen_2024_(230322).jpg",
  },
  "paul-mehling": {
    src: "/artists/paul-mehling.jpg",
    credit: "Wikimedia Commons",
    href: "https://commons.wikimedia.org/wiki/File:Paul_Mehling.jpg",
  },
  "antonio-lozoya": {
    src: "https://i.ytimg.com/vi/us8TLgf0Fss/hqdefault.jpg",
    credit: "YouTube",
    href: "https://www.youtube.com/watch?v=us8TLgf0Fss",
  },
  "camilla-chimiak": {
    src: "https://i.ytimg.com/vi/FN3YgcIUAFw/hqdefault.jpg",
    credit: "YouTube",
    href: "https://www.youtube.com/watch?v=FN3YgcIUAFw",
  },
};

const GROUPS: Record<string, ArtistPhoto> = {
  "rosenberg-trio": {
    src: "/groups/rosenberg-trio.jpg",
    credit: "Sinti Music",
    href: "https://www.sintimusic.nl/en/artists/stochelo-rosenberg/",
  },
  "mozes-rosenberg-trio": {
    src: "/groups/mozes-rosenberg-trio.jpg",
    credit: "Sinti Music",
    href: "https://www.sintimusic.nl/en/artists/mozes-rosenberg/",
  },
  "gismo-graf-trio": {
    src: "/groups/gismo-graf-trio.jpg",
    credit: "Gismo Graf Trio",
    href: "https://gismograf.de/",
  },
  "dario-napoli-trio": {
    src: "/groups/dario-napoli-trio.jpg",
    credit: "Dario Napoli",
    href: "https://darionapoli.com/gallery/",
  },
  "marcia-bamberg-swing-quartet": {
    src: "/groups/marcia-bamberg-swing-quartet.jpg",
    credit: "Marcia Bamberg",
    href: "https://marciabamberg.nl/",
  },
  "marion-and-sobo-band": {
    src: "/groups/marion-and-sobo-band.jpg",
    credit: "Marion & Sobo Band",
    href: "https://marionandsobo.com/about/",
  },
  "hot-club-of-san-francisco": {
    src: "/groups/hot-club-of-san-francisco.jpg",
    credit: "Hot Club of San Francisco",
    href: "https://www.hotclubsf.com/",
  },
  "the-lost-fingers": {
    src: "/groups/the-lost-fingers.jpg",
    credit: "The Lost Fingers",
    href: "https://thelostfingers.com/",
  },
  "dance-of-joy": {
    src: "/groups/dance-of-joy.jpg",
    credit: "Dance of Joy",
    href: "https://www.dance-of-joy.de/",
  },
  "christine-tassan-et-les-imposteures": {
    src: "/groups/christine-tassan-et-les-imposteures.jpg",
    credit: "Christine Tassan",
    href: "https://christinetassan.com/photos/",
  },
  "paulus-schafer-dominique-paats": {
    src: "/groups/paulus-schafer-dominique-paats.jpg",
    credit: "Sinti Music",
    href: "https://www.sintimusic.nl/en/artists/paulus-schafer/",
  },
  "tim-kliphuis-group": {
    src: "/groups/tim-kliphuis-group.jpg",
    credit: "Tim Kliphuis",
    href: "https://timkliphuis.com/",
  },
  "gonzalo-bergara-group": {
    src: "/groups/gonzalo-bergara-group.jpg",
    credit: "Gonzalo Bergara",
    href: "https://www.gonzalobergara.com/",
  },
};

const CHANNEL_CREDIT = "Daniel Gueli Gypsy Jazz Channel";

function stillFromUrl(url: string): ArtistPhoto | null {
  const id = youtubeVideoId(url);
  if (!id) return null;
  return {
    src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    credit: CHANNEL_CREDIT,
    href: url,
  };
}

function stillFromChannel(slug: string): ArtistPhoto | null {
  const clip = clipsForArtist(slug)[0];
  if (clip) return stillFromUrl(clip.url);
  const row = CHANNEL_VIDEOS.find((video) => {
    const hrefs = [video.hub?.href, ...(video.with ?? []).map((item) => item.href)];
    return hrefs.some((href) => href?.endsWith(`/${slug}`));
  });
  return row ? stillFromUrl(row.url) : null;
}

export function artistPhoto(slug: string, _instruments = ""): ArtistPhoto | null {
  return LOCAL[slug] ?? stillFromChannel(slug);
}

export function artistPhotoSrc(slug: string, instruments = ""): string | null {
  return artistPhoto(slug, instruments)?.src ?? null;
}

export function groupPhoto(slug: string, memberSlugs: string[] = []): ArtistPhoto | null {
  if (GROUPS[slug]) return GROUPS[slug];
  for (const member of memberSlugs) {
    const photo = artistPhoto(member);
    if (photo) return photo;
  }
  return stillFromChannel(slug);
}

export function groupPhotoSrc(slug: string, memberSlugs: string[] = []): string | null {
  return groupPhoto(slug, memberSlugs)?.src ?? null;
}

export function hasArtistPortrait(slug: string): boolean {
  return Boolean(LOCAL[slug]);
}

export function hasGroupPortrait(slug: string): boolean {
  return Boolean(GROUPS[slug]);
}

const LUTHIER_PHOTOS = new Set([
  "ajl-guitars",
  "bruno-bagnarelli",
  "castelluccia",
  "jean-barault",
  "jean-pierre-favino",
  "marco-la-manna",
  "maurice-dupont",
  "mauro-freschi",
  "shelley-park",
  "stefan-hahl",
]);

export function luthierPhotoSrc(slug: string): string | null {
  if (LUTHIER_PHOTOS.has(slug)) return `/luthiers/${slug}.jpg`;
  return null;
}
