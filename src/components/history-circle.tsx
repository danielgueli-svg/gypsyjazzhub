import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  addHistoryCircleNote,
  type HistoryCircleKind,
  type HistoryCircleNote,
} from "@/lib/hub-api";

const KINDS: HistoryCircleKind[] = ["Name", "Memory", "Date", "Correction", "Photograph"];

const HOUSE_OPTIONS = [
  { id: "paris", label: "Paris" },
  { id: "forbach", label: "Forbach" },
  { id: "germany", label: "Germany" },
  { id: "low-countries", label: "Low Countries" },
  { id: "midi", label: "Midi and Alsace" },
] as const;

function when(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return format(date, "d MMM yyyy");
}

export function CircleNotes({
  house,
  notes,
  chooseHouse,
  cta,
  empty,
  defaultKind,
}: {
  house: string;
  notes: HistoryCircleNote[];
  chooseHouse?: boolean;
  cta: string;
  empty?: string;
  defaultKind?: HistoryCircleKind;
}) {
  const { user, isPending } = useCurrentUserState();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<HistoryCircleKind>(defaultKind ?? "Memory");
  const [houseId, setHouseId] = useState(house);
  const [text, setText] = useState("");
  const [year, setYear] = useState("");
  const [link, setLink] = useState("");
  const [photoSource, setPhotoSource] = useState("");
  const [licence, setLicence] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      await addHistoryCircleNote({
        data: {
          house: chooseHouse ? houseId : house,
          kind,
          text,
          year,
          link,
          photoSource,
          licence,
        },
      });
      setText("");
      setYear("");
      setLink("");
      setPhotoSource("");
      setLicence("");
      setOpen(false);
      setStatus("Sent to the owner desk. It goes live after a look.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not add the note.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      <p className="text-[11px] tracking-[0.18em] text-faint uppercase">From the circle</p>
      <p className="mt-1 text-xs text-faint">Logged in. Every change waits on the owner desk.</p>
      {notes.length === 0 ? (
        empty ? <p className="mt-2 text-sm text-muted">{empty}</p> : null
      ) : (
        <ul className="mt-3 space-y-2">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border border-border bg-raised/40 px-4 py-3">
              <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                {note.kind}
                {note.year ? ` · ${note.year}` : ""}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{note.text}</p>
              {note.link ? (
                <a
                  href={note.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-xs text-muted hover:text-fg hover:underline"
                >
                  {note.link}
                </a>
              ) : null}
              {note.kind === "Photograph" && note.photoSource ? (
                <p className="mt-1 text-xs text-faint">
                  Source:{" "}
                  <a href={note.photoSource} target="_blank" rel="noreferrer" className="hover:text-fg">
                    {note.photoSource}
                  </a>
                  {note.licence ? ` · ${note.licence}` : ""}
                </p>
              ) : null}
              <p className="mt-2 text-[11px] text-faint">
                {note.submittedName} · {when(note.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!open ? (
        <>
          {isPending ? (
            <div className="mt-3 h-11 w-40 animate-pulse rounded-md bg-raised" />
          ) : user ? (
            <Button type="button" variant="outline" className="mt-3" onClick={() => setOpen(true)}>
              {cta}
            </Button>
          ) : (
            <Button asChild variant="outline" className="mt-3">
              <Link to="/login">{cta}</Link>
            </Button>
          )}
          {status ? <p className="mt-2 text-sm text-muted">{status}</p> : null}
        </>
      ) : (
        <form onSubmit={onSubmit} className="mt-4 max-w-xl space-y-3">
          {chooseHouse ? (
            <div>
              <Label htmlFor="circle-house">House</Label>
              <select
                id="circle-house"
                value={houseId}
                onChange={(event) => setHouseId(event.target.value)}
                className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
              >
                {HOUSE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div>
            <Label htmlFor={`circle-kind-${house}`}>Kind</Label>
            <select
              id={`circle-kind-${house}`}
              value={kind}
              onChange={(event) => setKind(event.target.value as HistoryCircleKind)}
              className="mt-1 h-11 w-full rounded-md border border-border bg-surface px-3 text-sm"
            >
              {KINDS.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor={`circle-text-${house}`}>Text</Label>
            <Textarea
              id={`circle-text-${house}`}
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={3}
              required
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`circle-year-${house}`}>Year (optional)</Label>
              <Input
                id={`circle-year-${house}`}
                value={year}
                onChange={(event) => setYear(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor={`circle-link-${house}`}>Link (optional)</Label>
              <Input
                id={`circle-link-${house}`}
                value={link}
                onChange={(event) => setLink(event.target.value)}
              />
            </div>
          </div>
          {kind === "Photograph" ? (
            <>
              <div>
                <Label htmlFor={`circle-source-${house}`}>Source URL</Label>
                <Input
                  id={`circle-source-${house}`}
                  value={photoSource}
                  onChange={(event) => setPhotoSource(event.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`circle-licence-${house}`}>Licence</Label>
                <Input
                  id={`circle-licence-${house}`}
                  value={licence}
                  onChange={(event) => setLicence(event.target.value)}
                  required
                />
              </div>
              <p className="text-xs text-faint">
                Real archive or photographer only. Generated images are refused.
              </p>
            </>
          ) : null}
          {status ? <p className="text-sm text-muted">{status}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Sending…" : "Add"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
