import { JoinedMark } from "@/components/joined-mark";
import { Portrait } from "@/components/portrait";
import { Badge } from "@/components/ui/badge";
import { artistPhoto } from "@/lib/photos";
import { formatInstrumentList } from "@/lib/utils";

export type DirectoryCard = {
  slug: string;
  name: string;
  href: string;
  instruments: string;
  place: string;
  bio: string;
  joined?: boolean;
  youtubeUrl?: string;
  instagramUrl?: string;
  websiteUrl?: string;
  spotifyUrl?: string;
};

export function MusicianCard({ person }: { person: DirectoryCard }) {
  const photo = artistPhoto(person.slug, person.instruments);
  const instruments = formatInstrumentList(person.instruments).slice(0, 3);
  return (
    <article className="break-inside-avoid rounded-2xl bg-surface p-4 shadow-border">
      <div className="flex gap-3">
        {photo ? (
          <Portrait
            src={photo.src}
            alt=""
            className="size-16 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="size-16 shrink-0 rounded-xl bg-raised" />
        )}
        <div className="min-w-0">
          <a href={person.href} className="inline-flex items-baseline gap-1.5 font-display text-xl font-semibold hover:underline">
            {person.name}
            {person.joined ? <JoinedMark /> : null}
          </a>
          {person.place ? <p className="mt-0.5 text-sm text-muted">{person.place}</p> : null}
        </div>
      </div>
      {instruments.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {instruments.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
      ) : null}
      {person.bio ? (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{person.bio}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs">
        {person.youtubeUrl ? (
          <a href={person.youtubeUrl} className="hover:underline" target="_blank" rel="noreferrer">
            YouTube
          </a>
        ) : null}
        {person.instagramUrl ? (
          <a href={person.instagramUrl} className="hover:underline" target="_blank" rel="noreferrer">
            Instagram
          </a>
        ) : null}
        {person.spotifyUrl ? (
          <a href={person.spotifyUrl} className="hover:underline" target="_blank" rel="noreferrer">
            Spotify
          </a>
        ) : null}
        {person.websiteUrl ? (
          <a href={person.websiteUrl} className="hover:underline" target="_blank" rel="noreferrer">
            Website
          </a>
        ) : null}
      </div>
    </article>
  );
}
