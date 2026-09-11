import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { ConcertRow } from "@/components/concert-row";
import { Contribute } from "@/components/contribute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  getAlertPrefs,
  previewMyAlerts,
  saveAlertPrefs,
  sendMyAlertSample,
  toggleAlertFollow,
  type AlertFollow,
  type AlertFrequency,
  type AlertKind,
  type AlertLogRow,
  type AlertPrefs,
} from "@/lib/alerts";
import {
  addConcert,
  deleteConcert,
  getMyProfile,
  listInbox,
  listMusicianConcerts,
  saveMyProfile,
  listLegends,
  type MessageRow,
  type Profile,
} from "@/lib/api";
import {
  listMyInvites,
  saveProfileTypes,
  setOpenForInvites,
  type JamInvite,
} from "@/lib/fans";
import {
  INSTRUMENT_OPTIONS,
  PROFILE_TYPES,
  isMusician,
  parseInstrumentIds,
  serializeInstruments,
  typesFromMemberKind,
  type InstrumentId,
  type ProfileTypeId,
} from "@/lib/profile-types";
import { listMySubscriptions, subscriptionLabel, type Subscription } from "@/lib/subscriptions";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isHubOwnerEmail } from "@/lib/hub-owner";
import { useI18n } from "@/lib/i18n";
import { listArtistOptions, type ArtistOption } from "@/lib/hub-api";
import { COUNTRY_OPTIONS, countryFlag, displayCountry } from "@/lib/geo";
import { listMyFavorites, type Favorite } from "@/lib/favorites";
import { cn, formatConcertWhen } from "@/lib/utils";

type Tab = "add" | "page" | "gigs" | "saved" | "alerts" | "inbox" | "invites";
const TABS: Tab[] = ["add", "page", "gigs", "saved", "alerts", "inbox", "invites"];
function isTab(value: unknown): value is Tab {
  return typeof value === "string" && TABS.includes(value as Tab);
}

export const Route = createFileRoute("/studio/")({
  validateSearch: (search: Record<string, unknown>): { tab?: Tab } =>
    isTab(search.tab) ? { tab: search.tab } : {},
  component: StudioPage,
});

function StudioPage() {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const { tab: tabFromUrl } = Route.useSearch();
  const navigate = useRouter();
  const tab: Tab = tabFromUrl ?? "add";
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);

  function setTab(next: Tab) {
    void navigate.navigate({ to: "/studio", search: { tab: next }, replace: true });
  }

  useEffect(() => {
    if (isPending || !user) return;
    void getMyProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setReady(true));
  }, [isPending, user]);

  if (isPending || (user && !ready)) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16">
        <div className="h-10 w-48 animate-pulse rounded-md bg-raised" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-surface" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Studio</p>
      <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
        {t("nav.hubProfile")}
      </h1>
      <p className="mt-3 max-w-xl text-sm text-muted">
        Signed in. Say if you are a musician or a non-musician / fan. Turn on
        invitations so jam hosts can alert you. Add a concert, a YouTube clip,
        a bio note, a festival or a jam.
      </p>
      {isHubOwnerEmail(user.primaryEmail) ? (
        <p className="mt-3 text-sm">
          <Link to="/studio/owner" className="text-muted hover:text-fg">
            Owner desk
          </Link>
        </p>
      ) : null}
      <DeskIdentity profile={profile} onProfile={setProfile} />
      <div className="mt-8 flex flex-wrap gap-2">
        {(
          [
            ["add", "Add to the hub"],
            ["page", "Your artist page"],
            ["gigs", "Your concerts"],
            ["saved", "Saved"],
            ["alerts", "Email alerts"],
            ["invites", "Invitations"],
            ["inbox", "Inbox"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "h-11 rounded-md px-4 text-sm",
              tab === key ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-8">
        {tab === "add" ? <Contribute heading="Add to the hub" /> : null}
        {tab === "page" ? (
          <ProfileForm
            key={`${profile?.slug ?? "new"}-${profile?.memberKind ?? "musician"}`}
            userName={user.displayName ?? ""}
            profile={profile}
            onSaved={setProfile}
          />
        ) : null}
        {tab === "gigs" ? <ConcertsPanel profile={profile} /> : null}
        {tab === "saved" ? <SavedPanel /> : null}
        {tab === "alerts" ? <AlertsPanel /> : null}
        {tab === "invites" ? <InvitesPanel /> : null}
        {tab === "inbox" ? <InboxPanel /> : null}
      </div>
    </main>
  );
}

function DeskIdentity({
  profile,
  onProfile,
}: {
  profile: Profile | null;
  onProfile: (profile: Profile | null) => void;
}) {
  const types = typesFromMemberKind(profile?.profileTypes ?? [], profile?.memberKind);
  const open = Boolean(profile?.openForInvites);
  const [status, setStatus] = useState<string | null>(null);

  async function toggleType(id: ProfileTypeId) {
    setStatus(null);
    const next = types.includes(id) ? types.filter((item) => item !== id) : [...types, id];
    try {
      await saveProfileTypes({ data: next.length ? next : ["fan"] });
      const saved = await getMyProfile();
      onProfile(saved);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not save.");
    }
  }

  async function toggleInvites() {
    setStatus(null);
    try {
      const result = await setOpenForInvites({ data: !open });
      const saved = await getMyProfile();
      onProfile(saved);
      setStatus(result.open ? "Invitations are on — jam hosts can alert you." : "Invitations off.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not save.");
    }
  }

  return (
    <div className="mt-8 rounded-2xl bg-surface p-5 shadow-border sm:p-6">
      <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Who you are</p>
      <p className="mt-2 text-sm text-muted">Pick every role that fits — musician and photographer is fine.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PROFILE_TYPES.map((row) => (
          <button
            key={row.id}
            type="button"
            onClick={() => void toggleType(row.id)}
            className={cn(
              "h-11 rounded-md px-4 text-sm",
              types.includes(row.id) ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
            )}
          >
            {row.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <Button type="button" variant={open ? "outline" : "default"} onClick={() => void toggleInvites()}>
          {open ? "Open for invitations ✓" : "Open for invitations"}
        </Button>
      </div>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        {isMusician(types)
          ? "Your artist page stays in Musicians. Turn invitations on if you also want hosts to invite you to a jam."
          : "A non-musician page sits with the listeners. Turn invitations on and jam hosts can alert you when they organise a night."}
      </p>
      {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}
    </div>
  );
}

function InvitesPanel() {
  const [rows, setRows] = useState<JamInvite[]>([]);
  const { user } = useCurrentUserState();

  useEffect(() => {
    void listMyInvites()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  const incoming = rows.filter((row) => row.toUserId === user?.id);
  const sent = rows.filter((row) => row.fromUserId === user?.id);

  return (
    <div className="max-w-2xl space-y-8">
      <section>
        <h2 className="font-display text-2xl font-semibold">Invites to you</h2>
        {incoming.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            None yet. Turn on Open for invitations so jam hosts can find you.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {incoming.map((row) => (
              <li key={row.id} className="rounded-2xl bg-surface p-4 shadow-border">
                <Link to="/jams/$slug" params={{ slug: row.jamSlug }} className="font-display text-xl font-semibold hover:underline">
                  {row.jamName}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  From {row.fromName}
                  {row.city ? ` · ${row.city}` : ""}
                  {row.startsAt ? ` · ${formatConcertWhen(row.startsAt)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section>
        <h2 className="font-display text-2xl font-semibold">Invites you sent</h2>
        {sent.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Organise a jam, then use Alert the room to invite people who are open.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {sent.map((row) => (
              <li key={row.id} className="rounded-2xl bg-surface p-4 shadow-border">
                <p className="font-medium">{row.jamName}</p>
                <p className="mt-1 text-sm text-muted">To {row.toName}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ProfileForm({
  userName,
  profile,
  onSaved,
}: {
  userName: string;
  profile: Profile | null;
  onSaved: (profile: Profile) => void;
}) {
  const [displayName, setDisplayName] = useState(profile?.displayName || userName);
  const [city, setCity] = useState(profile?.city ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [instruments, setInstruments] = useState(profile?.instruments ?? "");
  const [instrumentIds, setInstrumentIds] = useState<InstrumentId[]>(
    parseInstrumentIds(profile?.instruments ?? ""),
  );
  const [profileTypes, setProfileTypes] = useState<ProfileTypeId[]>(
    typesFromMemberKind(profile?.profileTypes ?? [], profile?.memberKind),
  );
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(profile?.websiteUrl ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(profile?.youtubeUrl ?? "");
  const [instagramUrl, setInstagramUrl] = useState(profile?.instagramUrl ?? "");
  const [spotifyUrl, setSpotifyUrl] = useState(profile?.spotifyUrl ?? "");
  const [contactUrl, setContactUrl] = useState(profile?.contactUrl ?? "");
  const [lookingForGigs, setLookingForGigs] = useState(profile?.lookingForGigs ?? false);
  const [availableToJam, setAvailableToJam] = useState(profile?.availableToJam ?? false);
  const [openForInvites, setOpen] = useState(profile?.openForInvites ?? false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const saved = await saveMyProfile({
        data: {
          displayName,
          city,
          country,
          instruments: isMusician(profileTypes) ? serializeInstruments(instrumentIds) || instruments : "",
          bio,
          websiteUrl,
          youtubeUrl,
          instagramUrl,
          spotifyUrl,
          contactUrl,
          lookingForGigs,
          availableToJam,
          memberKind: isMusician(profileTypes) ? "musician" : "fan",
          profileTypes,
          openForInvites,
        },
      });
      onSaved(saved);
      setStatus("Page saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="max-w-2xl space-y-8">
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">Who you are</h2>
        <div>
          <p className="mb-2 text-sm text-muted">Profile type — pick every role that fits</p>
          <div className="flex flex-wrap gap-2">
            {PROFILE_TYPES.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() =>
                  setProfileTypes((current) =>
                    current.includes(row.id)
                      ? current.filter((id) => id !== row.id)
                      : [...current, row.id],
                  )
                }
                className={cn(
                  "h-11 rounded-md px-4 text-sm",
                  profileTypes.includes(row.id)
                    ? "bg-accent text-accent-fg"
                    : "bg-raised text-muted hover:text-fg",
                )}
              >
                {row.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={isMusician(profileTypes) ? "Artist name" : "Your name"} htmlFor="displayName">
            <Input
              id="displayName"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={isMusician(profileTypes) ? "The name on the poster" : "The name on your page"}
            />
          </Field>
          {isMusician(profileTypes) ? (
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm text-muted">Instrument</p>
              <div className="flex flex-wrap gap-2">
                {INSTRUMENT_OPTIONS.map((row) => (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() =>
                      setInstrumentIds((current) =>
                        current.includes(row.id)
                          ? current.filter((id) => id !== row.id)
                          : [...current, row.id],
                      )
                    }
                    className={cn(
                      "h-11 rounded-md px-4 text-sm",
                      instrumentIds.includes(row.id)
                        ? "bg-accent text-accent-fg"
                        : "bg-raised text-muted hover:text-fg",
                    )}
                  >
                    {row.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <Field label="City" htmlFor="city">
            <Input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Amsterdam"
            />
          </Field>
          <Field label="Country" htmlFor="country">
            <Input
              id="country"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Netherlands"
            />
          </Field>
        </div>
        <Field label="Bio" htmlFor="bio">
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Who you play with, what you are looking for, where you learned the pompe…"
          />
        </Field>
      </section>

      {isMusician(profileTypes) ? (
      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">For bookers</h2>
        <p className="text-sm text-muted">
          A public link or email so venues and bookers can reach you. It shows
          as a contact button on your page.
        </p>
        <Field label="Contact link or email" htmlFor="contact">
          <Input
            id="contact"
            value={contactUrl}
            onChange={(e) => setContactUrl(e.target.value)}
            placeholder="booking@you.com or https://…"
          />
        </Field>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={lookingForGigs}
              onChange={(e) => setLookingForGigs(e.target.checked)}
              className="size-4 accent-accent"
            />
            Looking for gigs
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={availableToJam}
              onChange={(e) => setAvailableToJam(e.target.checked)}
              className="size-4 accent-accent"
            />
            Open to jam
          </label>
        </div>
      </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-semibold">YouTube and links</h2>
        <Field label="YouTube video" htmlFor="youtube">
          <Input
            id="youtube"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </Field>
        <p className="text-xs text-faint">
          Paste a video URL and it embeds on your public page. A channel URL
          still shows as a link.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Website" htmlFor="website">
            <Input
              id="website"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
            />
          </Field>
          <Field label="Instagram" htmlFor="instagram">
            <Input
              id="instagram"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
            />
          </Field>
          <Field label="Spotify" htmlFor="spotify">
            <Input
              id="spotify"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="https://open.spotify.com/artist/…"
            />
          </Field>
        </div>
      </section>
      {status ? <p className="text-sm text-muted">{status}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : profile ? "Save changes" : "Save page"}
        </Button>
        <p className="text-sm text-muted">
          After you save, this appears on the website. Come back anytime to edit.
        </p>
        {profile ? (
          <Link
            to={isMusician(profileTypes) ? "/musicians/$slug" : "/fans/$slug"}
            params={{ slug: profile.slug }}
            className="text-sm text-muted hover:text-fg"
          >
            View public page
          </Link>
        ) : null}
      </div>
    </form>
  );
}

function ConcertsPanel({ profile }: { profile: Profile | null }) {
  const router = useRouter();
  const { user } = useCurrentUserState();
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState(profile?.city ?? "");
  const [country, setCountry] = useState(profile?.country ?? "");
  const [startsAt, setStartsAt] = useState("");
  const [description, setDescription] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [concerts, setConcerts] = useState<Awaited<ReturnType<typeof listMusicianConcerts>>>([]);

  useEffect(() => {
    if (!user) return;
    void listMusicianConcerts({ data: user.id }).then(setConcerts).catch(() => setConcerts([]));
  }, [user]);

  if (!profile) {
    return (
      <p className="text-sm text-muted">
        Save your artist name and country first — then post the nights bookers
        will see.
      </p>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[20rem_1fr]">
      <form
        className="space-y-3 rounded-2xl bg-surface p-5 shadow-border"
        onSubmit={(event) => {
          event.preventDefault();
          setStatus(null);
          void addConcert({
            data: { title, venue, city, country, startsAt, description, ticketUrl },
          })
            .then(async () => {
              setTitle("");
              setVenue("");
              setStartsAt("");
              setDescription("");
              setTicketUrl("");
              setStatus("Concert posted.");
              if (user) setConcerts(await listMusicianConcerts({ data: user.id }));
              await router.invalidate();
            })
            .catch((err) => setStatus(err instanceof Error ? err.message : "Could not post"));
        }}
      >
        <h2 className="font-display text-2xl font-semibold">Upcoming concert</h2>
        <p className="text-sm text-muted">
          Posted dates show on your public page, the globe, and the concerts
          calendar.
        </p>
        <Field label="Title" htmlFor="title">
          <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </Field>
        <Field label="Venue" htmlFor="venue">
          <Input id="venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
        </Field>
        <Field label="City" htmlFor="gig-city">
          <Input id="gig-city" value={city} onChange={(e) => setCity(e.target.value)} />
        </Field>
        <Field label="Country" htmlFor="gig-country">
          <Input id="gig-country" value={country} onChange={(e) => setCountry(e.target.value)} />
        </Field>
        <Field label="Starts" htmlFor="starts">
          <Input
            id="starts"
            type="datetime-local"
            required
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
          />
        </Field>
        <Field label="Note" htmlFor="desc">
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label="Ticket link" htmlFor="tickets">
          <Input
            id="tickets"
            value={ticketUrl}
            onChange={(e) => setTicketUrl(e.target.value)}
          />
        </Field>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
        <Button type="submit" className="w-full">
          Publish
        </Button>
      </form>
      <div className="space-y-3">
        {concerts.length === 0 ? (
          <p className="text-sm text-muted">No concerts on your page yet.</p>
        ) : (
          concerts.map((concert) => {
            const numericId = Number(concert.id.replace("c-", ""));
            return (
              <div key={concert.id} className="space-y-2">
                <ConcertRow concert={concert} />
                <button
                  type="button"
                  className="text-xs text-faint hover:text-danger"
                  onClick={() => {
                    void deleteConcert({ data: numericId }).then(async () => {
                      if (user) setConcerts(await listMusicianConcerts({ data: user.id }));
                    });
                  }}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function AlertsPanel() {
  const { user } = useCurrentUserState();
  const [prefs, setPrefs] = useState<AlertPrefs | null>(null);
  const [follows, setFollows] = useState<AlertFollow[]>([]);
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [log, setLog] = useState<AlertLogRow[]>([]);
  const [email, setEmail] = useState("");
  const [artists, setArtists] = useState<ArtistOption[]>([]);
  const [countryQ, setCountryQ] = useState("");
  const [artistQ, setArtistQ] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  async function reload() {
    const [next, nextSubs] = await Promise.all([getAlertPrefs(), listMySubscriptions().catch(() => [])]);
    setPrefs(next.prefs);
    setFollows(next.follows);
    setSubs(nextSubs);
    setLog(next.log);
    setEmail(next.email);
    const [legends, options] = await Promise.all([
      listLegends().catch(() => []),
      listArtistOptions().catch(() => [] as ArtistOption[]),
    ]);
    const merged = new Map<string, ArtistOption>();
    for (const row of options) merged.set(row.slug, row);
    for (const legend of legends) {
      if (!merged.has(legend.slug)) {
        merged.set(legend.slug, { slug: legend.slug, name: legend.name, kind: "legend" });
      }
    }
    setArtists([...merged.values()].sort((a, b) => a.name.localeCompare(b.name)));
  }

  useEffect(() => {
    void reload().catch(() => setStatus("Could not load alerts."));
  }, []);

  const countryList = useMemo(() => {
    const q = countryQ.trim().toLowerCase();
    return COUNTRY_OPTIONS.filter((name) => {
      if (!q) return true;
      return `${displayCountry(name)} ${name}`.toLowerCase().includes(q);
    });
  }, [countryQ]);

  const artistHits = useMemo(() => {
    const q = artistQ.trim().toLowerCase();
    if (q.length < 2) return [];
    const taken = new Set(follows.map((row) => row.artistSlug));
    return artists
      .filter((row) => !taken.has(row.slug) && row.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [artistQ, artists, follows]);

  if (!prefs) {
    return status ? (
      <p className="text-sm text-muted">{status}</p>
    ) : (
      <div className="h-64 animate-pulse rounded-2xl bg-surface" />
    );
  }

  function toggleCountry(name: string) {
    setPrefs((current) => {
      if (!current) return current;
      const on = current.countries.includes(name);
      return {
        ...current,
        countries: on
          ? current.countries.filter((item) => item !== name)
          : [...current.countries, name],
      };
    });
  }

  function toggleKind(kind: AlertKind) {
    setPrefs((current) => {
      if (!current) return current;
      const on = current.kinds.includes(kind);
      const kinds = on ? current.kinds.filter((item) => item !== kind) : [...current.kinds, kind];
      return { ...current, kinds: kinds.length ? kinds : current.kinds };
    });
  }

  async function onSave(event: FormEvent) {
    event.preventDefault();
    if (!prefs) return;
    setBusy(true);
    setStatus(null);
    try {
      const saved = await saveAlertPrefs({
        data: {
          countries: prefs.countries,
          kinds: prefs.kinds,
          frequency: prefs.frequency,
          enabled: prefs.enabled,
        },
      });
      setPrefs(saved);
      setStatus("Alerts saved. Mail only goes out when there is a matching new date.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSave(event)} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-8">
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Pick countries, artists and festivals. Choose weekly, monthly, or every
          new date — and we mail what is coming.
        </p>
        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">Countries</h2>
          <p className="text-sm text-muted">
            One or more. We email jams and concerts listed for those countries.
            Pick none if you only want mail about artists you follow.
          </p>
          <Input
            value={countryQ}
            onChange={(e) => setCountryQ(e.target.value)}
            placeholder="Find a country"
            aria-label="Find a country"
          />
          <div className="max-h-64 overflow-y-auto rounded-2xl bg-surface p-3 shadow-border">
            <div className="grid grid-cols-2 gap-1">
              {countryList.map((name) => {
                const checked = prefs.countries.includes(name);
                return (
                  <label
                    key={name}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-2 text-sm",
                      checked ? "bg-raised" : "hover:bg-raised/60",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCountry(name)}
                      className="size-4 accent-accent"
                    />
                    <span>
                      {countryFlag(name)} {displayCountry(name)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          {prefs.countries.length ? (
            <p className="text-xs text-faint">
              {prefs.countries.map((name) => displayCountry(name)).join(" · ")}
            </p>
          ) : (
            <p className="text-xs text-faint">No country selected yet.</p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">What to send</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            {(
              [
                ["concert", "Concerts"],
                ["jam", "Jam sessions"],
                ["festival", "Festivals"],
              ] as const
            ).map(([kind, label]) => (
              <label key={kind} className="flex min-h-11 items-center gap-2 rounded-md bg-surface px-3 text-sm shadow-border">
                <input
                  type="checkbox"
                  checked={prefs.kinds.includes(kind)}
                  onChange={() => toggleKind(kind)}
                  className="size-4 accent-accent"
                />
                {label}
              </label>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">How often</h2>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["every", "Every new date"],
                ["weekly", "Weekly"],
                ["monthly", "Monthly"],
              ] as const satisfies ReadonlyArray<readonly [AlertFrequency, string]>
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setPrefs({ ...prefs, frequency: key })}
                className={cn(
                  "h-11 rounded-md px-4 text-sm",
                  prefs.frequency === key ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={prefs.enabled}
              onChange={(e) => setPrefs({ ...prefs, enabled: e.target.checked })}
              className="size-4 accent-accent"
            />
            Send email alerts
          </label>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">Subscriptions</h2>
          <p className="text-sm text-muted">
            Concerts, jams, festivals and countries you asked to be notified about.
          </p>
          {subs.filter((row) => row.kind !== "musician" && row.kind !== "legend").length ? (
            <ul className="space-y-1.5 text-sm">
              {subs
                .filter((row) => row.kind !== "musician" && row.kind !== "legend")
                .map((row) => (
                  <li key={`${row.kind}-${row.targetId}`} className="text-muted">
                    {subscriptionLabel(row.kind)} · {row.targetName}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">
              Open a concert, jam, festival or country page and tap Notify me.
            </p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">Follow artists</h2>
          <p className="text-sm text-muted">
            When they publish a new concert on the hub, it goes in your mail.
            Pick how often on their page — every new date, weekly, or monthly.
          </p>
          {follows.length ? (
            <div className="flex flex-wrap gap-2">
              {follows.map((follow) => (
                <button
                  key={follow.artistSlug}
                  type="button"
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-surface px-3 text-sm shadow-border hover:text-danger"
                  onClick={() => {
                    void toggleAlertFollow({ data: follow }).then(() => reload());
                  }}
                >
                  {follow.artistName}
                  <span className="text-faint">Remove</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-faint">No artists yet. Search a name below, or open a page and press Follow.</p>
          )}
          {artists.length ? (
            <div className="flex flex-wrap gap-2">
              {artists
                .filter((artist) => !follows.some((row) => row.artistSlug === artist.slug))
                .filter((artist) =>
                  [
                    "stochelo-rosenberg",
                    "mozes-rosenberg",
                    "joscho-stephan",
                    "bireli-lagrene",
                    "paulus-schafer",
                    "jimmy-rosenberg",
                  ].includes(artist.slug),
                )
                .map((artist) => (
                  <button
                    key={artist.slug}
                    type="button"
                    className="inline-flex min-h-11 items-center rounded-md bg-raised px-3 text-sm text-muted hover:text-fg"
                    onClick={() => {
                      void toggleAlertFollow({
                        data: {
                          artistSlug: artist.slug,
                          artistKind: artist.kind,
                          artistName: artist.name,
                        },
                      }).then(() => reload());
                    }}
                  >
                    Follow {artist.name}
                  </button>
                ))}
            </div>
          ) : null}
          <Input
            value={artistQ}
            onChange={(e) => setArtistQ(e.target.value)}
            placeholder="Stochelo, Mozes, Joscho…"
            aria-label="Follow an artist"
          />
          {artistHits.length ? (
            <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-surface shadow-border">
              {artistHits.map((artist) => (
                <li key={`${artist.kind}-${artist.slug}`}>
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center justify-between px-4 text-left text-sm hover:bg-raised"
                    onClick={() => {
                      void toggleAlertFollow({
                        data: {
                          artistSlug: artist.slug,
                          artistKind: artist.kind,
                          artistName: artist.name,
                        },
                      }).then(() => {
                        setArtistQ("");
                        return reload();
                      });
                    }}
                  >
                    <span>{artist.name}</span>
                    <span className="text-xs text-faint">
                      {artist.kind === "musician" ? "Hub member" : "Artist"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      </div>

      <aside className="space-y-4 rounded-2xl bg-surface p-5 shadow-border lg:sticky lg:top-24">
        <h2 className="font-display text-2xl font-semibold">Mail</h2>
        <p className="text-sm text-muted">
          {email.includes("@")
            ? `Goes to ${email}. Change it on the email you signed in with.`
            : "Sign in with an email so we know where to write."}
        </p>
        <p className="text-xs leading-relaxed text-faint">
          Every new date, weekly or monthly — never a mail on a quiet stretch. Each
          night links back to the hub. Owner digest stays separate.
        </p>
        {status ? <p className="text-sm text-muted">{status}</p> : null}
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? "Saving…" : "Save alerts"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            setStatus(null);
            void previewMyAlerts()
              .then((next) => {
                if (!next.events.length) {
                  setPreview(null);
                  setStatus("No matching new dates right now — nothing to send.");
                  return;
                }
                setPreview(next.body);
                return sendMyAlertSample().then((res) => {
                  setStatus(
                    res.ok
                      ? `Sent ${res.eventCount} date${res.eventCount === 1 ? "" : "s"} to ${email}.`
                      : res.reason ?? res.detail ?? "Could not send.",
                  );
                  return reload();
                });
              })
              .catch((err) => setStatus(err instanceof Error ? err.message : "Could not send."))
              .finally(() => setBusy(false));
          }}
        >
          Send a sample now
        </Button>
        {preview ? (
          <pre className="max-h-56 overflow-auto whitespace-pre-wrap text-xs text-muted">{preview}</pre>
        ) : null}
        {log.length ? (
          <div className="space-y-2">
            <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Last mails</p>
            {log.map((row) => (
              <p key={row.id} className="text-xs text-faint">
                {formatConcertWhen(row.sentAt)} · {row.ok ? "sent" : "failed"} · {row.eventCount} dates
              </p>
            ))}
          </div>
        ) : null}
        {user?.displayName ? (
          <p className="text-xs text-faint">Signed in as {user.displayName}.</p>
        ) : null}
      </aside>
    </form>
  );
}

function InboxPanel() {
  const { user } = useCurrentUserState();
  const [messages, setMessages] = useState<MessageRow[]>([]);

  useEffect(() => {
    void listInbox()
      .then(setMessages)
      .catch(() => setMessages([]));
  }, []);

  if (messages.length === 0) {
    return <p className="text-sm text-muted">No notes yet. Follow players and write first.</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => {
        const incoming = message.toUserId === user?.id;
        const otherName = incoming ? message.fromName : message.toName;
        const otherSlug = incoming ? message.fromSlug : message.toSlug;
        return (
          <article key={message.id} className="rounded-2xl bg-surface p-5 shadow-border">
            <p className="text-xs text-faint">
              {incoming ? "From" : "To"}{" "}
              {otherSlug ? (
                <Link
                  to="/musicians/$slug"
                  params={{ slug: otherSlug }}
                  className="text-muted hover:text-fg"
                >
                  {otherName}
                </Link>
              ) : (
                otherName
              )}
              <span className="ml-2">{formatConcertWhen(message.createdAt)}</span>
            </p>
            <p className="mt-2 text-sm leading-relaxed">{message.body}</p>
          </article>
        );
      })}
    </div>
  );
}

function SavedPanel() {
  const [rows, setRows] = useState<Favorite[]>([]);

  useEffect(() => {
    void listMyFavorites()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  function href(row: Favorite) {
    if (row.kind === "jam") return `/jams/${row.slug}`;
    if (row.kind === "country") return `/world/${row.slug}`;
    return `/search?q=${encodeURIComponent(row.slug.replaceAll("-", " "))}`;
  }

  function label(row: Favorite) {
    return row.slug.replaceAll("-", " ");
  }

  if (rows.length === 0) {
    return (
      <p className="max-w-xl text-sm leading-relaxed text-muted">
        Nothing saved yet. Open a jam, a country or an artist page and press Save.
        Email alerts still live under Alerts — this list is the room you keep.
      </p>
    );
  }

  return (
    <ul className="max-w-2xl space-y-2">
      {rows.map((row) => (
        <li key={`${row.kind}-${row.slug}`}>
          <a href={href(row)} className="block rounded-2xl bg-surface px-4 py-3 shadow-border hover:bg-raised">
            <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{row.kind}</p>
            <p className="mt-1 font-display text-xl font-semibold capitalize">{label(row)}</p>
          </a>
        </li>
      ))}
    </ul>
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
