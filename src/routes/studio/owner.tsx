import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserDirectory } from "@/components/user-directory";
import { ActivityFeed } from "@/components/activity-feed";
import { listPublicActivity, type ActivityItem } from "@/lib/activity";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import {
  amIOwner,
  claimOwner,
  getOwnerDigest,
  getVisitStats,
  listHubActivity,
  listHubMembers,
  removeHubItem,
  saveOwnerDigest,
  sendOwnerDigest,
  type HubActivity,
  type HubMember,
  type VisitDay,
  type VisitPlace,
} from "@/lib/owner-api";
import {
  listDiscoveries,
  publishDiscovery,
  rejectDiscovery,
  type DiscoveryRow,
} from "@/lib/discovery-api";
import { SCAN_SOURCES } from "@/lib/discovery";
import { FACEBOOK_GROUPS } from "@/lib/facebook-groups";
import { DJANGOBOOKS_BOARDS } from "@/lib/djangobooks";
import { formatConcertWhen } from "@/lib/utils";
import {
  listPendingHub,
  publishHubItem,
  type PendingHubItem,
} from "@/lib/hub-api";
import {
  listCountryRequests,
  reviewCountryRequest,
  type CountryRequest,
} from "@/lib/country-requests";
import { listContactMessages, markContactRead, type ContactMessage } from "@/lib/contact";
import { enrichCatalogBios, listCatalogStubs, type CatalogStub } from "@/lib/catalog";

export const Route = createFileRoute("/studio/owner")({
  component: OwnerPage,
});

function OwnerPage() {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [owner, setOwner] = useState(false);
  const [claimed, setClaimed] = useState(true);
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<HubMember[]>([]);
  const [activity, setActivity] = useState<HubActivity[]>([]);
  const [finds, setFinds] = useState<DiscoveryRow[]>([]);
  const [pending, setPending] = useState<PendingHubItem[]>([]);
  const [publicActivity, setPublicActivity] = useState<ActivityItem[]>([]);
  const [ready, setReady] = useState(false);
  const [digestEmail, setDigestEmail] = useState("");
  const [digestOn, setDigestOn] = useState(true);
  const [digestLog, setDigestLog] = useState<
    { id: number; sentAt: string; subject: string; ok: boolean; detail: string; body: string }[]
  >([]);
  const [digestNote, setDigestNote] = useState<string | null>(null);
  const [digestBusy, setDigestBusy] = useState(false);
  const [visits, setVisits] = useState<{
    today: VisitDay;
    days: VisitDay[];
    total?: { visitors: number; hits: number };
    countries?: VisitPlace[];
    cities?: VisitPlace[];
  } | null>(null);

  async function load(isOwner: boolean) {
    if (!isOwner) return;
    const [nextMembers, nextActivity, nextFinds, nextDigest, nextPending, nextPublic, nextVisits] = await Promise.all([
      listHubMembers().catch(() => []),
      listHubActivity().catch(() => []),
      listDiscoveries().catch(() => []),
      getOwnerDigest().catch(() => ({
        settings: { email: "", enabled: true },
        log: [] as typeof digestLog,
      })),
      listPendingHub().catch(() => []),
      listPublicActivity().catch(() => []),
      getVisitStats().catch(() => null),
    ]);
    setMembers(nextMembers);
    setActivity(nextActivity);
    setFinds(nextFinds);
    setDigestEmail(nextDigest.settings.email);
    setDigestOn(nextDigest.settings.enabled);
    setDigestLog(nextDigest.log);
    setPending(nextPending);
    setPublicActivity(nextPublic);
    setVisits(nextVisits);
  }

  useEffect(() => {
    if (isPending || !user) return;
    void amIOwner()
      .then(async (res) => {
        setOwner(res.owner);
        setClaimed(res.claimed);
        setReady(true);
        await load(res.owner);
      })
      .catch(() => {
        setError("Could not open the owner desk.");
        setReady(true);
      });
  }, [isPending, user]);

  if (isPending || (user && !ready)) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-16">
        <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Owner</p>
        <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Owner desk</h1>
        <p className="mt-3 text-sm text-muted">Opening the desk…</p>
        <div className="mt-6 h-10 w-48 animate-pulse rounded-md bg-raised" />
      </main>
    );
  }
  if (!user) return <RedirectToSignIn to="/join" />;

  async function onClaim(event: FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await claimOwner({ data: phrase });
      setOwner(true);
      setClaimed(true);
      await load(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not claim.");
    }
  }

  async function onSaveDigest(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setDigestNote(null);
    try {
      await saveOwnerDigest({ data: { email: digestEmail, enabled: digestOn } });
      setDigestNote("Saved. Mail goes out around 08:00 Dutch time, every day.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save mail.");
    }
  }

  async function onSendDigest() {
    setError(null);
    setDigestNote(null);
    setDigestBusy(true);
    try {
      await saveOwnerDigest({ data: { email: digestEmail, enabled: digestOn } });
      const result = await sendOwnerDigest();
      if (result.ok) {
        setDigestNote(result.detail ?? "Mail sent. Check your inbox (and spam).");
      } else {
        setError(result.reason ?? result.detail ?? "Could not send.");
      }
      const next = await getOwnerDigest();
      setDigestLog(next.log);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send mail.");
    } finally {
      setDigestBusy(false);
    }
  }

  async function onRemove(item: HubActivity) {
    try {
      await removeHubItem({ data: { kind: item.kind, id: item.id } });
      setActivity((rows) => rows.filter((row) => !(row.kind === item.kind && row.id === item.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove.");
    }
  }

  async function onPublishFind(id: number) {
    setError(null);
    try {
      const result = await publishDiscovery({ data: id });
      if (!result.ok) setError(result.reason);
      await load(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish.");
    }
  }

  async function onRejectFind(id: number) {
    setError(null);
    try {
      await rejectDiscovery({ data: id });
      setFinds((rows) => rows.filter((row) => row.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not take down.");
    }
  }

  const dayAgo = Date.now() - 86_400_000;
  const todayMembers = members.filter((row) => new Date(row.createdAt).getTime() >= dayAgo);
  const todayActivity = activity.filter((row) => new Date(row.when).getTime() >= dayAgo);

  return (
    <main className="mx-auto w-full max-w-6xl min-w-0 flex-1 overflow-x-hidden px-3 py-8 sm:px-6 sm:py-10">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Owner</p>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-5xl">
        Owner desk
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
        Members, new pages, concerts, jams, festivals and chat. Take anything
        down that should not stay.
      </p>
      {owner ? (
        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 sm:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {[
            ["#desk-visits", "Visits"],
            ["#desk-today", "Today"],
            ["#desk-members", "Members"],
            ["#desk-users", "Users"],
            ["#desk-mail", "Mail"],
            ["#desk-scan", "Scan"],
            ["#desk-content", "Content"],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="shrink-0 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-fg shadow-border"
            >
              {label}
            </a>
          ))}
        </nav>
      ) : null}

      {!owner ? (
        <form onSubmit={onClaim} className="mt-10 max-w-md space-y-3 rounded-2xl bg-surface p-6 shadow-border">
          <p className="text-sm leading-relaxed text-muted">
            {claimed
              ? "This desk is already claimed. If you are Daniel, type the owner phrase."
              : "Type the owner phrase once. That makes you the moderator of the hub."}
          </p>
          <Input
            value={phrase}
            onChange={(event) => setPhrase(event.target.value)}
            placeholder="Owner phrase"
            autoComplete="off"
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit">Open owner desk</Button>
        </form>
      ) : (
        <>
          <section id="desk-visits" className="mt-8 scroll-mt-20 sm:mt-10">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Visits</h2>
            <p className="mt-2 text-sm text-muted">
              Every public page open. Unique people use one browser. Amsterdam day.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-surface p-5 shadow-border sm:col-span-1">
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Site visits</p>
                <p className="mt-2 font-display text-4xl font-semibold tabular-nums sm:text-5xl">
                  {visits?.total?.hits ?? 0}
                </p>
                <p className="mt-1 text-sm text-muted">
                  all time · {visits?.total?.visitors ?? 0} unique visitor
                  {(visits?.total?.visitors ?? 0) === 1 ? "" : "s"}
                </p>
              </div>
              <div className="rounded-2xl bg-surface p-5 shadow-border">
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Today</p>
                <p className="mt-2 font-display text-4xl font-semibold tabular-nums">
                  {visits?.today?.visitors ?? 0}
                </p>
                <p className="mt-1 text-sm text-muted">
                  unique visitor{(visits?.today?.visitors ?? 0) === 1 ? "" : "s"} · {visits?.today?.hits ?? 0} hit
                  {(visits?.today?.hits ?? 0) === 1 ? "" : "s"}
                </p>
              </div>
              <div className="rounded-2xl bg-surface p-4 shadow-border sm:p-5">
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Last 14 days</p>
                <ul className="mt-3 max-h-56 space-y-1.5 overflow-y-auto text-sm">
                  {(visits?.days ?? []).length === 0 ? (
                    <li className="text-faint">No visits counted yet.</li>
                  ) : (
                    visits!.days.map((row) => (
                      <li key={row.day} className="flex justify-between gap-3">
                        <span className="min-w-0 truncate">{row.day}</span>
                        <span className="tabular-nums text-muted">
                          {row.visitors} · {row.hits} hits
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-2xl bg-surface p-5 shadow-border">
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Where from</p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {(visits?.countries ?? []).length === 0 ? (
                    <li className="text-faint">No country yet — new visits start filling this in.</li>
                  ) : (
                    visits!.countries!.map((row) => (
                      <li key={row.country || "unknown"} className="flex justify-between gap-3">
                        <span className="min-w-0 truncate">{row.countryName}</span>
                        <span className="tabular-nums text-muted">
                          {row.visitors} · {row.hits} hits
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div className="rounded-2xl bg-surface p-5 shadow-border">
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Cities</p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {(visits?.cities ?? []).length === 0 ? (
                    <li className="text-faint">City shows when Cloudflare sends it.</li>
                  ) : (
                    visits!.cities!.map((row) => (
                      <li key={`${row.country}-${row.city}`} className="flex justify-between gap-3">
                        <span className="min-w-0 truncate">
                          {row.city}
                          {row.countryName ? ` · ${row.countryName}` : ""}
                        </span>
                        <span className="tabular-nums text-muted">
                          {row.visitors} · {row.hits} hits
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </section>

          <section id="desk-today" className="mt-10 scroll-mt-20">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Last 24 hours</h2>
            <p className="mt-2 text-sm text-muted">
              {todayMembers.length} new member{todayMembers.length === 1 ? "" : "s"} ·{" "}
              {todayActivity.length} new post{todayActivity.length === 1 ? "" : "s"}
            </p>
            {todayMembers.length === 0 && todayActivity.length === 0 ? (
              <p className="mt-4 text-sm text-faint">Nothing new today.</p>
            ) : (
              <ul className="mt-4 space-y-2 text-sm">
                {todayMembers.map((member) => (
                  <li key={member.id} className="rounded-xl bg-surface px-4 py-3 shadow-border">
                    Joined · <span className="break-words">{member.name}</span>
                    <span className="mt-0.5 block break-all text-xs text-muted">{member.email}</span>
                  </li>
                ))}
                {todayActivity.map((item) => (
                  <li key={`${item.kind}-${item.id}`} className="rounded-xl bg-surface px-4 py-3 shadow-border">
                    {item.kind} · {item.title} · {item.who}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="desk-members" className="mt-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Members</h2>
            <p className="mt-2 text-sm text-muted">
              {members.length} people with a hub login. Alerts they turned on are in Users & alerts below.
            </p>
            {members.length === 0 ? (
              <p className="mt-4 text-sm text-faint">No members stored yet.</p>
            ) : (
              <ul className="mt-4 divide-y divide-border overflow-hidden rounded-2xl bg-surface shadow-border">
                {members.map((member) => (
                  <li key={member.id} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
                    <span>
                      <span className="font-medium">{member.name || "Hub member"}</span>
                      <span className="mt-0.5 block break-all text-xs text-muted">{member.email}</span>
                    </span>
                    <span className="text-xs text-faint">{formatConcertWhen(member.createdAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <UserDirectory />

          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">On the hub tonight</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Hidden from the front page for now. This is the public activity
              strip — jams, concerts, new pages, news — so you can look at it
              here before it goes back on the globe.
            </p>
            <ActivityFeed items={publicActivity} />
          </section>

          <ContactMessagesPanel />

          <CountryRequestsPanel />

          <PendingHubPanel
            items={pending}
            onChange={setPending}
            onError={setError}
          />

          <CatalogPanel onError={setError} />

          <section id="desk-mail" className="mt-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Daily mail</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Every morning a short mail: new members, concerts, jams, festivals,
              clips, and scan finds waiting for you. First test may ask you to
              confirm the address — click that mail once.
            </p>
            <form
              onSubmit={onSaveDigest}
              className="mt-5 max-w-md space-y-3 rounded-2xl bg-surface p-5 shadow-border"
            >
              <div className="space-y-1.5">
                <Label htmlFor="digest-email">Your email</Label>
                <Input
                  id="digest-email"
                  type="email"
                  value={digestEmail}
                  onChange={(event) => setDigestEmail(event.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={digestOn}
                  onChange={(event) => setDigestOn(event.target.checked)}
                />
                Send every morning
              </label>
              <div className="flex flex-wrap gap-2">
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={digestBusy || !digestEmail}
                  onClick={() => void onSendDigest()}
                >
                  {digestBusy ? "Sending…" : "Send test now"}
                </Button>
              </div>
              {digestNote ? <p className="text-sm text-muted">{digestNote}</p> : null}
            </form>
            {digestLog.length > 0 ? (
              <ul className="mt-5 max-w-2xl space-y-2 text-sm">
                {digestLog.map((row) => (
                  <li key={row.id} className="rounded-xl bg-surface px-4 py-3 shadow-border">
                    <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                      {row.ok ? "sent" : "not sent"} · {formatConcertWhen(row.sentAt)}
                    </p>
                    <p className="mt-1 font-medium">{row.subject}</p>
                    <p className="mt-1 text-xs text-muted">{row.detail}</p>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>

          <section id="desk-scan" className="mt-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Daily scan</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Every day the hub looks for new dates and new rooms. A concert
              goes on the calendar only with two confirmations — artist website
              and venue. A new venue needs its own site plus a second listing.
              Big festivals we already trust can go up from the official site
              alone. One source stays here until you publish it. Every Monday
              the hub also reads the main gypsy jazz Facebook groups
              (GYPSYJAZZGUITAR and the others). A complete post — date, venue,
              artist, country — goes on the calendar with a link back to
              Facebook. Incomplete posts wait here. The same Monday it reads
              DjangoBooks (Europe, North America, International): a thread with
              date, venue and country goes on concerts, jams or festivals the
              same week, with a link back to the thread — no hand entry.
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-faint">
              {SCAN_SOURCES.map((source) => (
                <li key={source.url}>
                  <a href={source.url} className="hover:text-fg" target="_blank" rel="noreferrer">
                    {source.name}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-faint">
              {FACEBOOK_GROUPS.map((group) => (
                <li key={group.url}>
                  <a href={group.url} className="hover:text-fg" target="_blank" rel="noreferrer">
                    {group.name}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-faint">
              {DJANGOBOOKS_BOARDS.map((board) => (
                <li key={board.url}>
                  <a href={board.url} className="hover:text-fg" target="_blank" rel="noreferrer">
                    DjangoBooks · {board.name}
                  </a>
                </li>
              ))}
            </ul>
            {finds.length === 0 ? (
              <p className="mt-4 text-sm text-faint">No scan finds yet. The next daily pass will land here.</p>
            ) : (
              <ul className="mt-6 space-y-3">
                {finds.map((find) => (
                  <li key={find.id} className="rounded-2xl bg-surface px-4 py-4 shadow-border">
                    <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                      {find.kind === "venue"
                        ? "venue"
                        : find.kind === "jam"
                          ? "jam"
                          : find.kind === "festival"
                            ? "festival"
                            : "concert"} · {find.status} ·{" "}
                      {find.city || find.country}
                      {find.trustedFestival ? " · trusted festival" : ""}
                    </p>
                    <p className="mt-1 font-display text-xl font-semibold leading-tight">
                      {find.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {find.kind === "venue"
                        ? `${find.city}, ${find.country}`
                        : `${find.artistName} · ${find.venue} · ${find.startsAt ? formatConcertWhen(find.startsAt) : "no date"}`}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-faint">{find.reason}</p>
                    <ul className="mt-2 space-y-1 text-xs">
                      {find.sources.map((source) => (
                        <li key={source.url}>
                          <a
                            href={source.url}
                            className="text-muted hover:text-fg"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {source.kind.replaceAll("_", " ")} · {source.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {find.status !== "published" ? (
                        <Button type="button" size="sm" onClick={() => void onPublishFind(find.id)}>
                          Publish anyway
                        </Button>
                      ) : null}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void onRejectFind(find.id)}
                      >
                        Take down
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section id="desk-content" className="mt-12 scroll-mt-20">
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Content</h2>
            {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
            <ul className="mt-4 space-y-2">
              {activity.map((item) => (
                <li
                  key={`${item.kind}-${item.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-3 shadow-border"
                >
                  <div className="min-w-0">
                    <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                      {item.kind} · {item.who}
                    </p>
                    <p className="mt-1 font-display text-lg font-semibold leading-tight">
                      {item.title}
                    </p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => void onRemove(item)}>
                    Take down
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <p className="mt-10 text-sm">
        <Link to="/studio" className="text-muted hover:text-fg">
          {t("studio.back")}
        </Link>
      </p>
    </main>
  );
}

function PendingHubPanel({
  items,
  onChange,
  onError,
}: {
  items: PendingHubItem[];
  onChange: (rows: PendingHubItem[]) => void;
  onError: (message: string | null) => void;
}) {
  async function publish(item: PendingHubItem) {
    onError(null);
    try {
      await publishHubItem({ data: { kind: item.kind, id: item.id } });
      onChange(items.filter((row) => !(row.kind === item.kind && row.id === item.id)));
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not publish.");
    }
  }

  async function reject(item: PendingHubItem) {
    onError(null);
    try {
      await removeHubItem({ data: { kind: item.kind, id: item.id } });
      onChange(items.filter((row) => !(row.kind === item.kind && row.id === item.id)));
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not take down.");
    }
  }

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">Waiting for a look</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Member-submitted jams, concerts, festivals, teachers, venues and notes.
        First posts from a new account wait here. Publish them and they land on the site. Take down anything that should
        not stay. History and archive copy itself never changes until you publish a note.
      </p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-faint">Nothing waiting.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {items.map((item) => (
            <li
              key={`${item.kind}-${item.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface px-4 py-4 shadow-border"
            >
              <div className="min-w-0">
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                  {item.kind} · {item.who}
                </p>
                <p className="mt-1 font-display text-xl font-semibold leading-tight">{item.title}</p>
                <p className="mt-1 text-xs text-faint">{formatConcertWhen(item.when)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => void publish(item)}>
                  Publish
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => void reject(item)}>
                  Take down
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function ContactMessagesPanel() {
  const [rows, setRows] = useState<ContactMessage[]>([]);
  const [note, setNote] = useState<string | null>(null);

  async function reload() {
    const next = await listContactMessages();
    setRows(next);
  }

  useEffect(() => {
    void reload().catch(() => setNote("Could not load contact notes."));
  }, []);

  async function markRead(id: number) {
    setNote(null);
    try {
      await markContactRead({ data: id });
      await reload();
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not update.");
    }
  }

  const fresh = rows.filter((row) => row.status !== "read");
  const shown = fresh.length > 0 ? fresh : rows.slice(0, 8);

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">Contact the Board</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Notes sent from the footer form. Suggestions, corrections, and feedback.
      </p>
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-faint">No notes yet.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {shown.map((row) => (
            <li key={row.id} className="rounded-2xl bg-surface px-4 py-4 shadow-border">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                {row.status === "read" ? "Read" : "New"} · {formatConcertWhen(row.createdAt)}
              </p>
              <p className="mt-1 font-display text-xl font-semibold">{row.subject}</p>
              <p className="mt-1 text-sm text-muted">
                {row.name} · {row.email}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">{row.message}</p>
              {row.status !== "read" ? (
                <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => void markRead(row.id)}>
                  Mark read
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CountryRequestsPanel() {
  const [rows, setRows] = useState<CountryRequest[]>([]);
  const [note, setNote] = useState<string | null>(null);

  async function reload() {
    const next = await listCountryRequests();
    setRows(next);
  }

  useEffect(() => {
    void reload().catch(() => setNote("Could not load country requests."));
  }, []);

  async function review(id: number, action: "approve" | "reject") {
    setNote(null);
    try {
      await reviewCountryRequest({ data: { id, action } });
      await reload();
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Could not update.");
    }
  }

  const pending = rows.filter((row) => row.status === "pending");

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">New country requests</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Members ask to open a country that is not on the hub yet. Approve it
        and the page exists — they can put concerts and jams on it.
      </p>
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
      {pending.length === 0 ? (
        <p className="mt-4 text-sm text-faint">No country requests waiting.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {pending.map((row) => (
            <li key={row.id} className="rounded-2xl bg-surface px-4 py-4 shadow-border">
              <p className="font-display text-xl font-semibold">{row.countryName}</p>
              <p className="mt-1 text-sm text-muted">
                {row.kind}
                {row.city ? ` · ${row.city}` : ""} · {row.submittedName}
              </p>
              {row.note ? <p className="mt-2 text-sm leading-relaxed">{row.note}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => void review(row.id, "approve")}>
                  Open the page
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void review(row.id, "reject")}
                >
                  Dismiss
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function CatalogPanel({ onError }: { onError: (msg: string | null) => void }) {
  const [stubs, setStubs] = useState<CatalogStub[]>([]);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    void listCatalogStubs()
      .then(setStubs)
      .catch(() => setStubs([]));
  }, []);

  async function fillBios() {
    setBusy(true);
    setNote(null);
    onError(null);
    try {
      const result = await enrichCatalogBios({ data: { limit: 5 } });
      if (!result.ok) {
        onError(result.reason);
      } else {
        setNote(
          result.looked === 0
            ? "No stub pages waiting."
            : `Looked at ${result.looked} — filled ${result.filled}, left ${result.skipped} for later (no sourced bio).`,
        );
      }
      setStubs(await listCatalogStubs());
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not fill bios.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">Artist pages</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        A new name on a concert, jam, clip or scan opens a page automatically —
        name, country if we have it, a placeholder photo. Bios stay empty until
        there is a sourced line. Fill a few from official sites (uses your xAI
        key, five at a time).
      </p>
      <div className="mt-4">
        <Button type="button" disabled={busy} onClick={() => void fillBios()}>
          {busy ? "Looking up bios…" : "Fill missing bios"}
        </Button>
      </div>
      {note ? <p className="mt-3 text-sm text-muted">{note}</p> : null}
      {stubs.length === 0 ? (
        <p className="mt-4 text-sm text-faint">No stub pages waiting.</p>
      ) : (
        <ul className="mt-5 space-y-2">
          {stubs.map((row) => (
            <li key={row.slug} className="rounded-xl bg-surface px-4 py-3 shadow-border">
              <Link to="/musicians/$slug" params={{ slug: row.slug }} className="font-display text-lg font-semibold hover:underline">
                {row.name}
              </Link>
              <p className="mt-1 text-sm text-muted">
                {row.instruments || "role unknown"}
                {row.origin ? ` · ${row.origin}` : ""}
                {row.photoUrl ? " · photo" : " · placeholder"}
                {row.bioStatus === "stub" ? " · bio to follow" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
