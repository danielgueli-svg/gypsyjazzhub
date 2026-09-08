import { useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SignInGate } from "@/components/sign-in-gate";
import {
  addHubArtist,
  addHubClip,
  addHubConcert,
  addHubFestival,
  addHubJam,
  addHubLuthier,
  addHubNote,
  addHubTeacher,
  addHubVenue,
  listArtistOptions,
  type ArtistOption,
} from "@/lib/hub-api";
import { parseLuthierCraft, type LuthierCraft } from "@/lib/luthiers";
import { inviteToJam } from "@/lib/fans";
import { CountryRequestForm } from "@/components/country-request";
import { COUNTRY_OPTIONS, countryFlag, displayCountry } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Kind = "concert" | "clip" | "note" | "festival" | "jam" | "venue" | "luthier" | "artist" | "teacher" | "country";

const PRIMARY_KINDS: Kind[] = ["concert", "jam", "festival", "artist", "teacher"];
const MORE_KINDS: Kind[] = ["clip", "note", "venue", "luthier", "country"];

export function Contribute({
  presetSlug,
  presetName,
  heading,
  defaultKind,
  meetup,
}: {
  presetSlug?: string;
  presetName?: string;
  heading?: string;
  defaultKind?: Kind;
  meetup?: boolean;
}) {
  const { t } = useI18n();
  const [kind, setKind] = useState<Kind>(defaultKind ?? "concert");
  const [more, setMore] = useState(
    Boolean(defaultKind && MORE_KINDS.includes(defaultKind)),
  );
  const chips = more ? [...PRIMARY_KINDS, ...MORE_KINDS] : PRIMARY_KINDS;

  return (
    <section className="mt-12 rounded-2xl bg-surface p-6 shadow-border">
      <h2 className="font-display text-2xl font-semibold">
        {heading ?? t("contribute.hubTitle")}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{t("contribute.hubLead")}</p>
      <SignInGate>
      <p className="mt-5 text-[11px] tracking-[0.16em] text-faint uppercase">{t("contribute.chooser")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {chips.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setKind(id)}
            data-kind={id}
            className={cn(
              "h-11 rounded-md px-4 text-sm",
              kind === id ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
            )}
          >
            {t(`contribute.kind.${id}`)}
          </button>
        ))}
        {more ? null : (
          <button
            type="button"
            onClick={() => setMore(true)}
            className="h-11 rounded-md px-4 text-sm text-muted hover:text-fg"
          >
            {t("contribute.more")}
          </button>
        )}
      </div>
      <div className="mt-6">
        {kind === "concert" ? <ConcertForm presetSlug={presetSlug} presetName={presetName} /> : null}
        {kind === "clip" ? <ClipForm presetSlug={presetSlug} presetName={presetName} /> : null}
        {kind === "note" ? <NoteForm presetSlug={presetSlug} presetName={presetName} /> : null}
        {kind === "festival" ? <FestivalForm /> : null}
        {kind === "jam" ? <JamForm meetup={meetup} /> : null}
        {kind === "venue" ? <VenueForm /> : null}
        {kind === "luthier" ? <LuthierForm /> : null}
        {kind === "artist" ? <ArtistForm /> : null}
        {kind === "teacher" ? <TeacherForm /> : null}
        {kind === "country" ? <CountryRequestForm compact /> : null}
      </div>
      </SignInGate>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function HoneyField() {
  return (
    <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
      <label>
        Company website
        <input type="text" name="company_url" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

function honeyValue(event: FormEvent) {
  const form = event.currentTarget as HTMLFormElement;
  return form.querySelector<HTMLInputElement>('input[name="company_url"]')?.value ?? "";
}

function postedLine(pending: boolean | undefined, live: string) {
  return pending
    ? "Thanks — first posts wait for a look. After one is published, later ones go live."
    : live;
}

function useArtists() {
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  useEffect(() => {
    void listArtistOptions()
      .then(setArtists)
      .catch(() => setArtists([]));
  }, []);
  return artists;
}

function ArtistPicker({
  id,
  value,
  onChange,
  artists,
  lockedName,
}: {
  id: string;
  value: string;
  onChange: (slug: string) => void;
  artists: ArtistOption[];
  lockedName?: string;
}) {
  if (lockedName) {
    return <Input id={id} value={lockedName} readOnly />;
  }
  return (
    <>
      <Input
        id={id}
        list={`${id}-list`}
        value={artists.find((artist) => artist.slug === value)?.name ?? value}
        onChange={(event) => {
          const typed = event.target.value;
          const match = artists.find(
            (artist) => artist.name.toLowerCase() === typed.toLowerCase() || artist.slug === typed,
          );
          onChange(match?.slug ?? typed);
        }}
        placeholder="Start typing a name — Amati Schmitt…"
        required
      />
      <datalist id={`${id}-list`}>
        {artists.map((artist) => (
          <option key={`${artist.kind}-${artist.slug}`} value={artist.name} />
        ))}
      </datalist>
    </>
  );
}

function ConcertForm({ presetSlug, presetName }: { presetSlug?: string; presetName?: string }) {
  const router = useRouter();
  const artists = useArtists();
  const [artistSlug, setArtistSlug] = useState(presetSlug ?? "");
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const match =
        artists.find((artist) => artist.slug === artistSlug) ??
        artists.find((artist) => artist.name.toLowerCase() === artistSlug.toLowerCase());
      await addHubConcert({
        data: {
          artistSlug: match?.slug || presetSlug || artistSlug,
          title,
          venue,
          city,
          country,
          startsAt,
          note,
          hp: honeyValue(event),
        },
      }).then((result) => {
        setTitle("");
        setNote("");
        setStatus(postedLine(result.pending, "Concert is on the hub."));
      });
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative grid gap-4 sm:grid-cols-2">
      <HoneyField />
      <Field label="Artist" htmlFor="concert-artist">
        <ArtistPicker
          id="concert-artist"
          value={artistSlug}
          onChange={setArtistSlug}
          artists={artists}
          lockedName={presetName}
        />
      </Field>
      <Field label="Title" htmlFor="concert-title">
        <Input id="concert-title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </Field>
      <Field label="Venue" htmlFor="concert-venue">
        <Input id="concert-venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
      </Field>
      <Field label="City" htmlFor="concert-city">
        <Input id="concert-city" value={city} onChange={(e) => setCity(e.target.value)} />
      </Field>
      <Field label="Country" htmlFor="concert-country">
        <Input
          id="concert-country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="France"
          list="concert-country-list"
        />
        <datalist id="concert-country-list">
          {COUNTRY_OPTIONS.map((name) => (
            <option key={name} value={name} />
          ))}
        </datalist>
        <p className="mt-1.5 text-xs text-muted">
          Not on the list? Add the concert anyway — or{" "}
          <button
            type="button"
            className="underline underline-offset-2"
            onClick={() => {
              document.querySelector<HTMLButtonElement>('[data-kind="country"]')?.click();
            }}
          >
            request a new country
          </button>
          .
        </p>
      </Field>
      <Field label="Date and time" htmlFor="concert-when">
        <Input
          id="concert-when"
          type="datetime-local"
          required
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Note" htmlFor="concert-note">
          <Input
            id="concert-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Who else is on the bill…"
          />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add concert"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}

function ClipForm({ presetSlug, presetName }: { presetSlug?: string; presetName?: string }) {
  const router = useRouter();
  const artists = useArtists();
  const [artistSlug, setArtistSlug] = useState(presetSlug ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const match =
        artists.find((artist) => artist.slug === artistSlug) ??
        artists.find((artist) => artist.name.toLowerCase() === artistSlug.toLowerCase());
      await addHubClip({
        data: {
          artistSlug: match?.slug || presetSlug || artistSlug,
          youtubeUrl,
          title,
          hp: honeyValue(event),
        },
      }).then((result) => {
        setYoutubeUrl("");
        setTitle("");
        setStatus(postedLine(result.pending, "Clip added to the artist page."));
      });
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative grid gap-4">
      <HoneyField />
      <Field label="Artist" htmlFor="clip-artist">
        <ArtistPicker
          id="clip-artist"
          value={artistSlug}
          onChange={setArtistSlug}
          artists={artists}
          lockedName={presetName}
        />
      </Field>
      <Field label="YouTube link" htmlFor="clip-url">
        <Input
          id="clip-url"
          required
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </Field>
      <Field label="What is it" htmlFor="clip-title">
        <Input
          id="clip-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Amati at Samois, 2024"
        />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Share clip"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}

function NoteForm({ presetSlug, presetName }: { presetSlug?: string; presetName?: string }) {
  const router = useRouter();
  const artists = useArtists();
  const [artistSlug, setArtistSlug] = useState(presetSlug ?? "");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const match =
        artists.find((artist) => artist.slug === artistSlug) ??
        artists.find((artist) => artist.name.toLowerCase() === artistSlug.toLowerCase());
      await addHubNote({
        data: { artistSlug: match?.slug || presetSlug || artistSlug, body, hp: honeyValue(event) },
      }).then((result) => {
        setBody("");
        setStatus(postedLine(result.pending, "Note added to the bio."));
      });
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative grid gap-4">
      <HoneyField />
      <Field label="Artist" htmlFor="note-artist">
        <ArtistPicker
          id="note-artist"
          value={artistSlug}
          onChange={setArtistSlug}
          artists={artists}
          lockedName={presetName}
        />
      </Field>
      <Field label="Extra information" htmlFor="note-body">
        <Textarea
          id="note-body"
          required
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Who they play with, a story from a gig, where they are based…"
        />
      </Field>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add to bio"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}

function FestivalForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [when, setWhen] = useState("");
  const [nextStartsAt, setNextStartsAt] = useState("");
  const [bio, setBio] = useState("");
  const [site, setSite] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const result = await addHubFestival({
        data: { name, city, country, when, nextStartsAt, bio, site, hp: honeyValue(event) },
      });
      setName("");
      setBio("");
      setStatus(postedLine(result.pending, "Festival is on the hub."));
      void router.invalidate();
      if (result.pending) return;
      await router.navigate({ to: "/festivals/$slug", params: { slug: result.slug } });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative grid gap-4 sm:grid-cols-2">
      <HoneyField />
      <Field label="Festival name" htmlFor="fest-name">
        <Input id="fest-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Country" htmlFor="fest-country">
        <Input id="fest-country" required value={country} onChange={(e) => setCountry(e.target.value)} />
      </Field>
      <Field label="City" htmlFor="fest-city">
        <Input id="fest-city" value={city} onChange={(e) => setCity(e.target.value)} />
      </Field>
      <Field label="When" htmlFor="fest-when">
        <Input
          id="fest-when"
          value={when}
          onChange={(e) => setWhen(e.target.value)}
          placeholder="Late June"
        />
      </Field>
      <Field label="Next date" htmlFor="fest-next">
        <Input
          id="fest-next"
          type="datetime-local"
          required
          value={nextStartsAt}
          onChange={(e) => setNextStartsAt(e.target.value)}
        />
      </Field>
      <Field label="Official site" htmlFor="fest-site">
        <Input id="fest-site" value={site} onChange={(e) => setSite(e.target.value)} />
      </Field>
      <div className="sm:col-span-2">
        <Field label="About" htmlFor="fest-bio">
          <Textarea id="fest-bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add festival"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}

function JamForm({ meetup = false }: { meetup?: boolean }) {
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState(meetup ? "Meetup jam" : "");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [venue, setVenue] = useState(meetup ? "At home" : "");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");
  const [when, setWhen] = useState(meetup ? "Meetup jam" : "");
  const [nextStartsAt, setNextStartsAt] = useState("");
  const [kind, setKind] = useState(meetup ? "meetup" : "regular");
  const [bio, setBio] = useState("");
  const [alertOpen, setAlertOpen] = useState(true);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const result = await addHubJam({
        data: { name, city, country, venue, address, hours, when, nextStartsAt, bio, kind, hp: honeyValue(event) },
      });
      if (result.pending) {
        setStatus(postedLine(true, "Jam is on the hub."));
        void router.invalidate();
        return;
      }
      if (alertOpen) {
        try {
          const invited = await inviteToJam({
            data: {
              jamSlug: result.slug,
              jamName: name,
              city,
              country,
              startsAt: nextStartsAt,
              allOpen: true,
            },
          });
          setStatus(
            invited.sent
              ? `Jam is on the hub. Alerted ${invited.sent} people open for invitations.`
              : "Jam is on the hub.",
          );
        } catch {
          setStatus("Jam is on the hub.");
        }
      } else {
        setStatus("Jam is on the hub.");
      }
      void router.invalidate();
      await router.navigate({ to: "/jams/$slug", params: { slug: result.slug } });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative grid gap-4 sm:grid-cols-2">
      <HoneyField />
      <Field label="Jam name" htmlFor="jam-name">
        <Input id="jam-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Country" htmlFor="jam-country">
        <Input id="jam-country" required value={country} onChange={(e) => setCountry(e.target.value)} />
      </Field>
      <Field label="City" htmlFor="jam-city">
        <Input id="jam-city" value={city} onChange={(e) => setCity(e.target.value)} />
      </Field>
      <Field label="Where" htmlFor="jam-venue">
        <Input
          id="jam-venue"
          required
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
          placeholder={kind === "meetup" ? "Home, café, campsite…" : "Club or café"}
        />
      </Field>
      <Field label="Street address" htmlFor="jam-address">
        <Input
          id="jam-address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Street, number, postcode"
        />
      </Field>
      <Field label="From – until" htmlFor="jam-hours">
        <Input
          id="jam-hours"
          required
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="19:00–23:00"
        />
      </Field>
      <div className="sm:col-span-2">
        <p className="text-sm text-muted">Kind</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setKind("regular")}
            className={cn(
              "h-11 rounded-md px-4 text-sm",
              kind === "regular" ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
            )}
          >
            Regular jam
          </button>
          <button
            type="button"
            onClick={() => {
              setKind("meetup");
              if (!when) setWhen("Meetup jam");
            }}
            className={cn(
              "h-11 rounded-md px-4 text-sm",
              kind === "meetup" ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
            )}
          >
            Meetup jam
          </button>
        </div>
      </div>
      {kind === "regular" ? (
        <Field label="When" htmlFor="jam-when">
          <Input
            id="jam-when"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="Every Tuesday"
          />
        </Field>
      ) : (
        <Field label="When" htmlFor="jam-when">
          <Input id="jam-when" value={when} onChange={(e) => setWhen(e.target.value)} />
        </Field>
      )}
      <Field label={kind === "meetup" ? "Date and time" : "Next date"} htmlFor="jam-next">
        <Input
          id="jam-next"
          type="datetime-local"
          required
          value={nextStartsAt}
          onChange={(e) => setNextStartsAt(e.target.value)}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="About" htmlFor="jam-bio">
          <Textarea
            id="jam-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={
              kind === "meetup"
                ? "Bring a guitar. Who is hosting. How to find the door."
                : undefined
            }
          />
        </Field>
      </div>
      <label className="sm:col-span-2 flex min-h-11 items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={alertOpen}
          onChange={(e) => setAlertOpen(e.target.checked)}
          className="size-4 accent-accent"
        />
        {t("jam.inviteOpen")}
      </label>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : kind === "meetup" ? "Announce meetup" : "Add jam"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}

function VenueForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [kind, setKind] = useState("Club");
  const [scene, setScene] = useState("gypsy");
  const [site, setSite] = useState("");
  const [contact, setContact] = useState("");
  const [booker, setBooker] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const result = await addHubVenue({
        data: { name, city, country, kind, site, contact, bio, scene, booker, hp: honeyValue(event) },
      });
      setName("");
      setBio("");
      setStatus(postedLine(result.pending, "Venue is on the map."));
      void router.invalidate();
      if (result.pending) return;
      await router.navigate({ to: "/venues/$slug", params: { slug: result.slug } });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative grid gap-4 sm:grid-cols-2">
      <HoneyField />
      <Field label="Venue name" htmlFor="ven-name">
        <Input id="ven-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Country" htmlFor="ven-country">
        <Input
          id="ven-country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </Field>
      <Field label="City" htmlFor="ven-city">
        <Input id="ven-city" value={city} onChange={(e) => setCity(e.target.value)} />
      </Field>
      <Field label="Kind" htmlFor="ven-kind">
        <Input
          id="ven-kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          placeholder="Club, theatre, café, hall"
        />
      </Field>
      <Field label="Scene" htmlFor="ven-scene">
        <select
          id="ven-scene"
          value={scene}
          onChange={(e) => setScene(e.target.value)}
          className="h-11 w-full rounded-md border border-border bg-raised px-3 text-sm"
        >
          <option value="gypsy">Gypsy jazz</option>
          <option value="jazz">Jazz</option>
          <option value="world">World / other</option>
        </select>
      </Field>
      <Field label="Website" htmlFor="ven-site">
        <Input id="ven-site" value={site} onChange={(e) => setSite(e.target.value)} />
      </Field>
      <Field label="Who books gypsy jazz" htmlFor="ven-booker">
        <Input
          id="ven-booker"
          value={booker}
          onChange={(e) => setBooker(e.target.value)}
          placeholder="Name of the booker, if you know"
        />
      </Field>
      <Field label="Booker email or page" htmlFor="ven-contact">
        <Input
          id="ven-contact"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="mailto: or booking page"
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="About" htmlFor="ven-bio">
          <Textarea id="ven-bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add venue"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}

function LuthierForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [site, setSite] = useState("");
  const [contact, setContact] = useState("");
  const [bio, setBio] = useState("");
  const [craft, setCraft] = useState<LuthierCraft>("guitar");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const result = await addHubLuthier({
        data: { name, city, country, site, contact, bio, craft, note, hp: honeyValue(event) },
      });
      setName("");
      setBio("");
      setStatus(postedLine(result.pending, "Luthier is on the map."));
      void router.invalidate();
      if (result.pending) return;
      await router.navigate({ to: "/luthiers/$slug", params: { slug: result.slug } });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative grid gap-4 sm:grid-cols-2">
      <HoneyField />
      <Field label="Luthier / workshop" htmlFor="lut-name">
        <Input id="lut-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Country" htmlFor="lut-country">
        <Input
          id="lut-country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />
      </Field>
      <Field label="City" htmlFor="lut-city">
        <Input id="lut-city" value={city} onChange={(e) => setCity(e.target.value)} />
      </Field>
      <Field label="Website" htmlFor="lut-site">
        <Input id="lut-site" value={site} onChange={(e) => setSite(e.target.value)} />
      </Field>
      <Field label="Craft" htmlFor="lut-craft">
        <select
          id="lut-craft"
          value={craft}
          onChange={(e) => setCraft(parseLuthierCraft(e.target.value))}
          className="h-11 w-full rounded-md bg-raised px-3 text-sm"
        >
          <option value="guitar">Guitar</option>
          <option value="bass">Double bass</option>
          <option value="violin">Violin</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label="Short note" htmlFor="lut-note">
          <Input
            id="lut-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Jazz setup specialist, travel basses…"
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Contact" htmlFor="lut-contact">
          <Input
            id="lut-contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email or contact page"
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="About" htmlFor="lut-bio">
          <Textarea id="lut-bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add luthier"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}

function ArtistForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [instruments, setInstruments] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const result = await addHubArtist({
        data: { name, country, instruments, bio, hp: honeyValue(event) },
      });
      setStatus(
        result.pending
          ? postedLine(true, "")
          : result.existed
            ? "That musician is already on the hub."
            : "Artist page created.",
      );
      void router.invalidate();
      if (result.pending || !result.slug || result.slug === "pending") return;
      await router.navigate({ to: "/musicians/$slug", params: { slug: result.slug } });
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative grid gap-4 sm:grid-cols-2">
      <HoneyField />
      <Field label="Artist name" htmlFor="art-name">
        <Input id="art-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      <Field label="Country" htmlFor="art-country">
        <Input
          id="art-country"
          required
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Where they are based"
        />
      </Field>
      <Field label="Instrument" htmlFor="art-inst">
        <Input
          id="art-inst"
          value={instruments}
          onChange={(e) => setInstruments(e.target.value)}
          placeholder="Solo guitar"
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Bio" htmlFor="art-bio">
          <Textarea id="art-bio" value={bio} onChange={(e) => setBio(e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Create artist page"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}

export function TeacherForm({ countrySlug }: { countrySlug?: string }) {
  const router = useRouter();
  const { locale } = useI18n();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [instruments, setInstruments] = useState("");
  const [contact, setContact] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const result = await addHubTeacher({
        data: {
          countrySlug,
          country,
          region,
          city,
          name,
          instruments,
          contact,
          note,
          hp: honeyValue(event),
        },
      });
      setName("");
      setRegion("");
      setCity("");
      setInstruments("");
      setContact("");
      setNote("");
      setStatus(postedLine(result.pending, "You are on the teachers list."));
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="relative grid gap-4 sm:grid-cols-2">
      <HoneyField />
      <Field label="Your name" htmlFor="teach-name">
        <Input id="teach-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </Field>
      {countrySlug ? null : (
        <Field label="Country" htmlFor="teach-country">
          <select
            id="teach-country"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="h-11 w-full rounded-md border border-border bg-raised px-3 text-sm"
          >
            <option value="">Choose a country</option>
            {COUNTRY_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {countryFlag(item)} {displayCountry(item, locale)}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Region" htmlFor="teach-region">
        <Input
          id="teach-region"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Alsace, Noord-Brabant…"
        />
      </Field>
      <Field label="City" htmlFor="teach-city">
        <Input id="teach-city" value={city} onChange={(e) => setCity(e.target.value)} />
      </Field>
      <Field label="Instrument" htmlFor="teach-inst">
        <Input
          id="teach-inst"
          value={instruments}
          onChange={(e) => setInstruments(e.target.value)}
          placeholder="Guitar, violin…"
        />
      </Field>
      <Field label="How to contact you" htmlFor="teach-contact">
        <Input
          id="teach-contact"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="email, website or WhatsApp"
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="About the lessons" htmlFor="teach-note">
          <Textarea
            id="teach-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="In person, online, beginners, pompe…"
          />
        </Field>
      </div>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add me as a teacher"}
        </Button>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
      </div>
    </form>
  );
}
