import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { COUNTRY_OPTIONS, displayCountry } from "@/lib/geo";
import { formatConcertWhen } from "@/lib/utils";
import {
  INSTRUMENT_OPTIONS,
  PROFILE_TYPES,
  instrumentLabel,
  typeLabel,
} from "@/lib/profile-types";
import {
  banHubIp,
  banHubMember,
  eraseHubMember,
  listHubUserDirectory,
  listHubUserStats,
  sendOwnerPasswordReset,
  verifyHubMember,
  type HubUserFilter,
  type HubUserRow,
  type HubUserStats,
} from "@/lib/owner-api";
import { SUBSCRIPTION_KINDS, subscriptionLabel, type SubscriptionKind } from "@/lib/subscriptions";
import type { InstrumentId, ProfileTypeId } from "@/lib/profile-types";

const EMPTY_STATS: HubUserStats = {
  totalUsers: 0,
  musicians: 0,
  nonMusicians: 0,
  byCountry: [],
  byType: [],
  bySubscription: [],
  byInstrument: [],
};

function Select({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  label: string;
}) {
  return (
    <label className="block w-full min-w-0 flex-1 text-sm sm:min-w-40">
      <span className="mb-1.5 block text-muted">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md bg-raised px-3 text-fg"
      >
        {children}
      </select>
    </label>
  );
}

export function UserDirectory({ onErased }: { onErased?: (userId: string) => void }) {
  const [users, setUsers] = useState<HubUserRow[]>([]);
  const [stats, setStats] = useState<HubUserStats>(EMPTY_STATS);
  const [filter, setFilter] = useState<HubUserFilter>({
    musician: "all",
    country: "",
    subscriptionKind: "",
    profileType: "",
    instrument: "",
    q: "",
  });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banIp, setBanIp] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    setReady(false);
    void Promise.all([listHubUserDirectory({ data: filter }), listHubUserStats()])
      .then(([nextUsers, nextStats]) => {
        if (!live) return;
        setUsers(nextUsers);
        setStats(nextStats);
      })
      .catch((err) => {
        if (!live) return;
        setError(err instanceof Error ? err.message : "Could not load users.");
      })
      .finally(() => {
        if (live) setReady(true);
      });
    return () => {
      live = false;
    };
  }, [filter.country, filter.subscriptionKind, filter.profileType, filter.musician, filter.instrument, filter.q]);

  const countries = useMemo(() => {
    const present = new Set(stats.byCountry.map((row) => row.country));
    return COUNTRY_OPTIONS.filter((name) => present.has(name)).concat(
      stats.byCountry.map((row) => row.country).filter((name) => !COUNTRY_OPTIONS.includes(name)),
    );
  }, [stats.byCountry]);

  function patch(next: Partial<HubUserFilter>) {
    setFilter((prev) => ({ ...prev, ...next }));
  }

  async function ban(user: HubUserRow, banned: boolean) {
    setError(null);
    try {
      await banHubMember({ data: { userId: user.id, banned } });
      setUsers((rows) => rows.map((row) => (row.id === user.id ? { ...row, banned } : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not ban.");
    }
  }

  async function verify(user: HubUserRow) {
    setError(null);
    try {
      await verifyHubMember({ data: user.id });
      setUsers((rows) => rows.map((row) => (row.id === user.id ? { ...row, verified: true } : row)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify.");
    }
  }

  async function sendReset(user: HubUserRow) {
    setError(null);
    setNote(null);
    setResetting(user.id);
    try {
      await sendOwnerPasswordReset({ data: user.id });
      setNote(`Password reset mail sent to ${user.email}. They choose a password, then get a confirmation mail.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset mail.");
    } finally {
      setResetting(null);
    }
  }

  async function erase(user: HubUserRow) {
    if (!window.confirm(`Erase ${user.name || user.email} from the hub? They will need to join again.`)) {
      return;
    }
    setError(null);
    try {
      await eraseHubMember({ data: user.id });
      setUsers((rows) => rows.filter((row) => row.id !== user.id));
      setStats((prev) => ({
        ...prev,
        totalUsers: Math.max(0, prev.totalUsers - 1),
        musicians: Math.max(0, prev.musicians - (user.musician ? 1 : 0)),
        nonMusicians: Math.max(0, prev.nonMusicians - (user.musician ? 0 : 1)),
      }));
      onErased?.(user.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not erase.");
    }
  }

  async function onBanIp(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setNote(null);
    try {
      await banHubIp({ data: banIp });
      setBanIp("");
      setNote("IP banned. Posts from that address will be refused.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not ban IP.");
    }
  }

  return (
    <section id="desk-users" className="mt-12 scroll-mt-20">
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">Users & alerts</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Everyone who has joined the hub, with profile types, instruments and
        what they subscribe to for notifications. Send a password reset mail so
        they can choose a password (they then get a confirmation mail). Ban an
        account, or erase a bot from the hub. Your own login stays.
      </p>
      <form onSubmit={(event) => void onBanIp(event)} className="mt-4 flex max-w-md flex-wrap gap-2">
        <Input
          value={banIp}
          onChange={(event) => setBanIp(event.target.value)}
          placeholder="Ban an IP"
          className="min-w-40 flex-1"
        />
        <Button type="submit" variant="outline" size="sm">
          Ban IP
        </Button>
      </form>
      {note ? <p className="mt-2 text-sm text-muted">{note}</p> : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={stats.totalUsers} />
        <StatCard label="Musicians" value={stats.musicians} />
        <StatCard label="Non-musicians" value={stats.nonMusicians} />
        <StatCard
          label="Subscriptions"
          value={stats.bySubscription.reduce((sum, row) => sum + row.count, 0)}
        />
      </div>

      {stats.byCountry.length || stats.bySubscription.length ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {stats.byCountry.length ? (
            <div className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Users by country</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {stats.byCountry.slice(0, 8).map((row) => (
                  <li key={row.country} className="flex justify-between gap-3">
                    <span>{displayCountry(row.country)}</span>
                    <span className="tabular-nums text-muted">{row.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {stats.bySubscription.length ? (
            <div className="rounded-2xl bg-surface p-5 shadow-border">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">Subscription counts</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {stats.bySubscription.map((row) => (
                  <li key={row.kind} className="flex justify-between gap-3">
                    <span>{subscriptionLabel(row.kind)}</span>
                    <span className="tabular-nums text-muted">{row.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <label className="block w-full min-w-0 flex-1 text-sm sm:min-w-48">
          <span className="mb-1.5 block text-muted">Search</span>
          <Input
            value={filter.q ?? ""}
            onChange={(event) => patch({ q: event.target.value })}
            placeholder="Name or email"
          />
        </label>
        <Select label="Country" value={filter.country ?? ""} onChange={(value) => patch({ country: value })}>
          <option value="">All countries</option>
          {countries.map((name) => (
            <option key={name} value={name}>
              {displayCountry(name)}
            </option>
          ))}
        </Select>
        <Select
          label="Profile type"
          value={filter.profileType ?? ""}
          onChange={(value) => patch({ profileType: value as ProfileTypeId | "" })}
        >
          <option value="">All types</option>
          {PROFILE_TYPES.map((row) => (
            <option key={row.id} value={row.id}>
              {row.label}
            </option>
          ))}
        </Select>
        <Select
          label="Musician"
          value={filter.musician ?? "all"}
          onChange={(value) => patch({ musician: value as HubUserFilter["musician"] })}
        >
          <option value="all">All</option>
          <option value="musician">Musician</option>
          <option value="non">Non-musician</option>
        </Select>
        <Select
          label="Subscription"
          value={filter.subscriptionKind ?? ""}
          onChange={(value) => patch({ subscriptionKind: value as SubscriptionKind | "" })}
        >
          <option value="">All subscriptions</option>
          {SUBSCRIPTION_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {subscriptionLabel(kind)}
            </option>
          ))}
        </Select>
        <Select
          label="Instrument"
          value={filter.instrument ?? ""}
          onChange={(value) => patch({ instrument: value as InstrumentId | "" })}
        >
          <option value="">All instruments</option>
          {INSTRUMENT_OPTIONS.map((row) => (
            <option key={row.id} value={row.id}>
              {row.label}
            </option>
          ))}
        </Select>
      </div>

      {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}

      <div className="mt-4 space-y-3 md:hidden">
        {!ready ? (
          <p className="rounded-2xl bg-surface px-4 py-6 text-sm text-muted shadow-border">Loading…</p>
        ) : users.length === 0 ? (
          <p className="rounded-2xl bg-surface px-4 py-6 text-sm text-muted shadow-border">
            No members match these filters yet.
          </p>
        ) : (
          users.map((user) => (
            <article key={user.id} className="rounded-2xl bg-surface p-4 shadow-border">
              <p className="font-medium leading-tight break-words">{user.name}</p>
              <p className="mt-0.5 break-all text-xs text-muted">{user.email}</p>
              <p className="mt-1 text-xs text-faint">{formatConcertWhen(user.createdAt)}</p>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div>
                  <dt className="text-faint">Country</dt>
                  <dd className="mt-0.5 text-muted">
                    {user.country ? displayCountry(user.country) : "—"}
                    {user.city ? ` · ${user.city}` : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-faint">Musician</dt>
                  <dd className="mt-0.5 text-muted">{user.musician ? "Musician" : "Non-musician"}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-faint">Profile</dt>
                  <dd className="mt-0.5 text-muted">
                    {user.profileTypes.length
                      ? user.profileTypes.map((id) => typeLabel(id)).join(", ")
                      : "—"}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-faint">Instrument</dt>
                  <dd className="mt-0.5 text-muted">
                    {user.instrumentIds.length
                      ? user.instrumentIds.map((id) => instrumentLabel(id)).join(", ")
                      : user.instruments || "—"}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-faint">Subscriptions</dt>
                  <dd className="mt-0.5 text-muted">
                    {user.subscriptions.length
                      ? user.subscriptions
                          .slice(0, 4)
                          .map((sub) => `${subscriptionLabel(sub.kind)} · ${sub.targetName}`)
                          .join("; ")
                      : "—"}
                    {user.subscriptions.length > 4 ? ` +${user.subscriptions.length - 4}` : ""}
                  </dd>
                </div>
              </dl>
              <div className="mt-3 flex flex-wrap gap-2">
                {user.verified ? null : (
                  <Button type="button" size="sm" variant="outline" onClick={() => void verify(user)}>
                    Verify
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={resetting === user.id}
                  onClick={() => void sendReset(user)}
                >
                  {resetting === user.id ? "Sending…" : "Send reset mail"}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => void ban(user, !user.banned)}>
                  {user.banned ? "Unban" : "Ban"}
                </Button>
                {user.email.toLowerCase() === "danielgueli@mac.com" ? null : (
                  <Button type="button" size="sm" variant="outline" onClick={() => void erase(user)}>
                    Erase
                  </Button>
                )}
              </div>
              {user.banned ? <p className="mt-1 text-xs text-danger">Banned</p> : null}
            </article>
          ))
        )}
      </div>

      <div className="mt-4 hidden overflow-x-auto rounded-2xl bg-surface shadow-border md:block">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-faint">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Country</th>
              <th className="px-4 py-3 font-medium">Profile type</th>
              <th className="px-4 py-3 font-medium">Musician</th>
              <th className="px-4 py-3 font-medium">Instrument</th>
              <th className="px-4 py-3 font-medium">Subscriptions</th>
              <th className="px-4 py-3 font-medium">Desk</th>
            </tr>
          </thead>
          <tbody>
            {!ready ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-muted">
                  Loading…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-muted">
                  No members match these filters yet.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-t border-border align-top">
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                    <p className="text-xs text-faint">{formatConcertWhen(user.createdAt)}</p>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {user.country ? displayCountry(user.country) : "—"}
                    {user.city ? <span className="block text-xs">{user.city}</span> : null}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {user.profileTypes.length
                      ? user.profileTypes.map((id) => typeLabel(id)).join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{user.musician ? "Musician" : "Non-musician"}</td>
                  <td className="px-4 py-3 text-muted">
                    {user.instrumentIds.length
                      ? user.instrumentIds.map((id) => instrumentLabel(id)).join(", ")
                      : user.instruments || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {user.subscriptions.length ? (
                      <ul className="space-y-1">
                        {user.subscriptions.slice(0, 6).map((sub) => (
                          <li key={`${sub.kind}-${sub.targetId}`}>
                            {subscriptionLabel(sub.kind)} · {sub.targetName}
                          </li>
                        ))}
                        {user.subscriptions.length > 6 ? (
                          <li className="text-faint">+{user.subscriptions.length - 6} more</li>
                        ) : null}
                      </ul>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {user.verified ? null : (
                        <Button type="button" size="sm" variant="outline" onClick={() => void verify(user)}>
                          Verify
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={resetting === user.id}
                        onClick={() => void sendReset(user)}
                      >
                        {resetting === user.id ? "Sending…" : "Send reset mail"}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => void ban(user, !user.banned)}
                      >
                        {user.banned ? "Unban" : "Ban"}
                      </Button>
                      {user.email.toLowerCase() === "danielgueli@mac.com" ? null : (
                        <Button type="button" size="sm" variant="outline" onClick={() => void erase(user)}>
                          Erase
                        </Button>
                      )}
                    </div>
                    {user.banned ? <p className="mt-1 text-xs text-danger">Banned</p> : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-surface p-5 shadow-border">
      <p className="text-[11px] tracking-[0.16em] text-faint uppercase">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
