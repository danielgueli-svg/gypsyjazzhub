import {
  albumsForArtist,
  albumCover,
  albumQuery,
  artistItunes,
  artistPageHref,
  artistSpotify,
  itunesSearch,
  spotifySearch,
  type Album,
} from "@/lib/music";

function AlbumRow({ album }: { album: Album }) {
  const q = albumQuery(album);
  const cover = albumCover(album.slug);
  return (
    <li className="flex items-start gap-3 border-b border-border py-3">
      {cover ? (
        <img
          src={cover}
          alt={`${album.title} cover`}
          className="size-14 shrink-0 rounded-md object-cover"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-semibold leading-tight">{album.title}</p>
        <p className="mt-0.5 text-sm text-muted">
          {album.year} · {album.billed}
        </p>
        {album.note ? <p className="mt-1 text-xs text-faint">{album.note}</p> : null}
        {album.artists.length > 1 ? (
          <p className="mt-1 flex flex-wrap gap-x-2 text-xs text-muted">
            {album.artists.map((slug) => (
              <a key={slug} href={artistPageHref(slug)} className="hover:text-fg">
                {slug.replace(/-/g, " ")}
              </a>
            ))}
          </p>
        ) : null}
      </div>
      <p className="flex shrink-0 gap-3 text-sm">
        <a href={spotifySearch(q)} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
          Spotify
        </a>
        <a href={itunesSearch(q)} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
          iTunes
        </a>
      </p>
    </li>
  );
}

export function ArtistMusic({ slug, name }: { slug: string; name: string }) {
  const albums = albumsForArtist(slug);
  return (
    <section className="mt-12">
      <h2 className="font-display text-3xl font-semibold">Listen</h2>
      <p className="mt-2 text-sm text-muted">Albums this player is on. Open them on Spotify or iTunes.</p>
      <p className="mt-4 flex flex-wrap gap-3 text-sm">
        <a
          href={artistSpotify(slug, name)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center rounded-md bg-raised px-3 hover:bg-surface"
        >
          Spotify
        </a>
        <a
          href={artistItunes(name)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center rounded-md bg-raised px-3 hover:bg-surface"
        >
          iTunes
        </a>
      </p>
      {albums.length > 0 ? (
        <ul className="mt-6 max-w-2xl">
          {albums.map((album) => (
            <AlbumRow key={album.slug} album={album} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-faint">
          No album list yet — the Spotify and iTunes buttons still open this name.
        </p>
      )}
    </section>
  );
}

export function AlbumCard({ album, compact }: { album: Album; compact?: boolean }) {
  const q = albumQuery(album);
  const cover = albumCover(album.slug);
  if (compact) {
    return (
      <article className="flex items-start gap-2.5 rounded-xl bg-surface p-2.5 shadow-border">
        {cover ? (
          <img
            src={cover}
            alt={`${album.title} cover`}
            className="size-14 shrink-0 rounded-md object-cover sm:size-16"
          />
        ) : (
          <div className="size-14 shrink-0 rounded-md bg-raised sm:size-16" />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] tracking-[0.14em] text-faint uppercase">{album.year}</p>
          <h3 className="mt-0.5 font-display text-sm font-semibold leading-tight">{album.title}</h3>
          <p className="mt-0.5 truncate text-xs text-muted">{album.billed}</p>
          <p className="mt-1.5 flex gap-2 text-xs">
            <a href={spotifySearch(q)} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
              Spotify
            </a>
            <a href={itunesSearch(q)} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
              iTunes
            </a>
          </p>
        </div>
      </article>
    );
  }
  return (
    <article className="overflow-hidden rounded-2xl bg-surface shadow-border">
      {cover ? (
        <img
          src={cover}
          alt={`${album.title} cover`}
          className="aspect-square w-full object-cover"
        />
      ) : null}
      <div className="p-5">
        <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{album.year}</p>
        <h3 className="mt-2 font-display text-xl font-semibold leading-tight">{album.title}</h3>
        <p className="mt-1 text-sm text-muted">{album.billed}</p>
        <p className="mt-3 flex gap-3 text-sm">
          <a href={spotifySearch(q)} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
            Spotify
          </a>
          <a href={itunesSearch(q)} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">
            iTunes
          </a>
        </p>
      </div>
    </article>
  );
}
