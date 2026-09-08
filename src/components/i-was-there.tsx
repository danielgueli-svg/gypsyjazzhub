import { Link, useRouter } from "@tanstack/react-router";
import { format } from "date-fns";
import { Check, ImagePlus, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CountryLabel } from "@/components/country-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Concert } from "@/lib/api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  addNightReview,
  concertHasStarted,
  deleteNightReview,
  type NightMedia,
  type NightReview,
} from "@/lib/concert-reviews";
import { useI18n } from "@/lib/i18n";
import { formatConcertDay, formatConcertYear } from "@/lib/utils";

const MAX_BODY = 1200;
const MAX_FILES = 6;
const MAX_IMAGE = 3_000_000;
const MAX_VIDEO = 8_000_000;

type Pending = {
  key: string;
  filename: string;
  mime: string;
  data: string;
  preview: string;
  kind: "image" | "video";
};

function when(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return format(date, "d MMM yyyy");
}

function yearOf(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? 0 : date.getFullYear();
}

function isPast(concert: Concert, now = Date.now()) {
  return concert.isHistoric || new Date(concert.startsAt).getTime() < now;
}

async function fileToPending(file: File): Promise<Pending> {
  const mime = file.type.toLowerCase();
  if (mime === "video/mp4") {
    if (file.size > MAX_VIDEO) throw new Error("tooBig");
    const data = await readAsDataUrl(file);
    return {
      key: `${file.name}-${file.size}-${file.lastModified}`,
      filename: file.name || "clip.mp4",
      mime: "video/mp4",
      data,
      preview: URL.createObjectURL(file),
      kind: "video",
    };
  }
  if (mime !== "image/jpeg" && mime !== "image/png" && mime !== "image/jpg") {
    throw new Error("badType");
  }
  if (file.size > MAX_IMAGE * 2.2) throw new Error("tooBig");
  return compressImage(file);
}

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("tooBig"));
    reader.readAsDataURL(file);
  });
}

function compressImage(file: File): Promise<Pending> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const max = 1600;
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;
      if (width > max || height > max) {
        const scale = max / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("tooBig"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const keepPng = file.type === "image/png";
      const mime = keepPng ? "image/png" : "image/jpeg";
      const dataUrl = canvas.toDataURL(mime, keepPng ? undefined : 0.84);
      URL.revokeObjectURL(url);
      const payload = dataUrl.split(",")[1] ?? "";
      const size = Math.floor((payload.length * 3) / 4);
      if (size > MAX_IMAGE) {
        reject(new Error("tooBig"));
        return;
      }
      const name = file.name.replace(/\.[^.]+$/, keepPng ? ".png" : ".jpg") || (keepPng ? "photo.png" : "photo.jpg");
      resolve({
        key: `${name}-${size}-${file.lastModified}`,
        filename: name,
        mime,
        data: dataUrl,
        preview: dataUrl,
        kind: "image",
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("badType"));
    };
    img.src = url;
  });
}

function MediaGrid({
  media,
  onOpen,
}: {
  media: NightMedia[];
  onOpen?: (item: NightMedia) => void;
}) {
  if (media.length === 0) return null;
  return (
    <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
      {media.map((item) => (
        <li key={item.id} className="overflow-hidden rounded-lg bg-raised">
          {item.kind === "video" ? (
            <video
              src={item.url}
              controls
              playsInline
              preload="metadata"
              className="aspect-square h-full w-full bg-raised object-cover"
            />
          ) : (
            <button
              type="button"
              onClick={() => onOpen?.(item)}
              className="block aspect-square w-full"
            >
              <img
                src={item.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}

export function ReviewList({
  reviews,
  currentUserId,
  onDeleted,
}: {
  reviews: NightReview[];
  currentUserId?: string | null;
  onDeleted?: (id: number) => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState<NightMedia | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  if (reviews.length === 0) return null;

  return (
    <>
      <ul className="mt-4 space-y-3">
        {reviews.map((review) => (
          <li key={review.id} className="rounded-2xl bg-raised/80 p-4 shadow-border">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-semibold">{review.authorName}</p>
                <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
                  {when(review.createdAt)}
                </p>
              </div>
              {currentUserId && currentUserId === review.userId ? (
                <button
                  type="button"
                  disabled={busy === review.id}
                  onClick={() => {
                    setBusy(review.id);
                    void deleteNightReview({ data: review.id })
                      .then(() => onDeleted?.(review.id))
                      .finally(() => setBusy(null));
                  }}
                  className="text-xs text-faint hover:text-fg"
                >
                  {t("there.remove")}
                </button>
              ) : null}
            </div>
            {review.body ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">{review.body}</p>
            ) : null}
            <MediaGrid media={review.media} onOpen={setOpen} />
          </li>
        ))}
      </ul>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-50 grid place-items-center bg-bg/85 p-4"
          onClick={() => setOpen(null)}
        >
          <img src={open.url} alt="" className="max-h-[88dvh] max-w-full rounded-2xl shadow-border" />
        </button>
      ) : null}
    </>
  );
}

function IWasThereForm({
  concert,
  existing,
  onSaved,
  onCancel,
}: {
  concert: Concert;
  existing?: NightReview;
  onSaved: (review: NightReview) => void;
  onCancel: () => void;
}) {
  const { t } = useI18n();
  const { user } = useCurrentUserState();
  const [body, setBody] = useState(existing?.body ?? "");
  const [files, setFiles] = useState<Pending[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef(files);
  filesRef.current = files;
  const signer = user?.displayName?.trim() || user?.primaryEmail?.split("@")[0] || "you";
  const existingCount = existing?.media.length ?? 0;

  useEffect(() => {
    return () => {
      for (const file of filesRef.current) {
        if (file.kind === "video" && file.preview.startsWith("blob:")) {
          URL.revokeObjectURL(file.preview);
        }
      }
    };
  }, []);

  async function onPick(event: ChangeEvent<HTMLInputElement>) {
    const picked = [...(event.target.files ?? [])];
    event.target.value = "";
    if (picked.length === 0) return;
    setStatus(null);
    const room = MAX_FILES - existingCount - files.length;
    if (room <= 0) {
      setStatus(t("there.tooMany"));
      return;
    }
    try {
      const next: Pending[] = [];
      for (const file of picked.slice(0, room)) {
        next.push(await fileToPending(file));
      }
      const videos = [...files, ...next].filter((row) => row.kind === "video").length
        + (existing?.media.filter((row) => row.kind === "video").length ?? 0);
      if (videos > 1) {
        setStatus(t("there.oneVideo"));
        return;
      }
      setFiles((prev) => [...prev, ...next].slice(0, room));
    } catch (err) {
      const code = err instanceof Error ? err.message : "badType";
      setStatus(t(code === "tooBig" ? "there.tooBig" : "there.badType"));
    }
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const review = await addNightReview({
        data: {
          concertId: concert.id,
          body,
          files: files.map((file) => ({
            filename: file.filename,
            mime: file.mime,
            data: file.data,
          })),
        },
      });
      onSaved(review);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("there.fail");
      setStatus(message === "Unauthorized" ? t("there.signin") : message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="mt-3 space-y-3 rounded-xl bg-raised p-4">
      <p className="text-xs tracking-wide text-faint">{t("there.as").replace("{name}", signer)}</p>
      <div className="space-y-1.5">
        <Label htmlFor={`review-${concert.id}`}>{t("there.review")}</Label>
        <Textarea
          id={`review-${concert.id}`}
          maxLength={MAX_BODY}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={t("there.reviewPh")}
        />
        <p className="text-right text-[11px] text-faint">
          {body.length}/{MAX_BODY}
        </p>
      </div>
      <div className="space-y-2">
        <Label>{t("there.media")}</Label>
        <p className="text-xs leading-relaxed text-faint">{t("there.mediaHint")}</p>
        {files.length > 0 ? (
          <ul className="grid grid-cols-3 gap-2">
            {files.map((file) => (
              <li key={file.key} className="relative overflow-hidden rounded-lg bg-surface">
                {file.kind === "video" ? (
                  <video src={file.preview} className="aspect-square w-full object-cover" muted />
                ) : (
                  <img src={file.preview} alt="" className="aspect-square w-full object-cover" />
                )}
                <button
                  type="button"
                  className="absolute top-1 right-1 grid size-8 place-items-center rounded-full bg-bg/80 text-fg"
                  onClick={() =>
                    setFiles((prev) => {
                      const next = prev.filter((row) => row.key !== file.key);
                      if (file.kind === "video" && file.preview.startsWith("blob:")) {
                        URL.revokeObjectURL(file.preview);
                      }
                      return next;
                    })
                  }
                  aria-label={t("there.removeFile")}
                >
                  <X className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,video/mp4,.jpg,.jpeg,.png,.mp4"
          multiple
          className="sr-only"
          onChange={(event) => void onPick(event)}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={existingCount + files.length >= MAX_FILES}
        >
          <ImagePlus className="size-4" />
          {t("there.addFiles")}
        </Button>
      </div>
      {status ? <p className="text-sm text-danger">{status}</p> : null}
      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={busy || (!body.trim() && files.length === 0 && !existing)}>
          {busy ? t("there.posting") : t("there.submit")}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {t("there.cancel")}
        </Button>
      </div>
    </form>
  );
}

function NightCard({
  concert,
  reviews,
  currentUserId,
  formOpen,
  onToggleForm,
  onSaved,
  onDeleted,
}: {
  concert: Concert;
  reviews: NightReview[];
  currentUserId?: string | null;
  formOpen: boolean;
  onToggleForm: () => void;
  onSaved: (review: NightReview) => void;
  onDeleted: (id: number) => void;
}) {
  const { t } = useI18n();
  const { user } = useCurrentUserState();
  const own = reviews.find((row) => row.userId === currentUserId);
  const started = concertHasStarted(concert);
  const bits = [concert.city, concert.venue].filter(Boolean);

  return (
    <article className="rounded-2xl bg-surface p-4 shadow-border sm:p-5">
      <div className="grid grid-cols-[4.5rem_1fr] items-start gap-3 sm:gap-4">
        <Link
          to="/concerts/$id"
          params={{ id: concert.id }}
          className="text-center hover:text-accent"
        >
          <div className="font-display text-xl font-semibold leading-none">{formatConcertDay(concert.startsAt)}</div>
          <div className="mt-0.5 text-[11px] tracking-wide text-faint">{formatConcertYear(concert.startsAt)}</div>
        </Link>
        <div className="min-w-0">
          <Link
            to="/concerts/$id"
            params={{ id: concert.id }}
            className="font-display text-lg font-semibold leading-tight hover:underline"
          >
            {concert.title?.trim() || concert.artistName}
          </Link>
          {concert.country || bits.length > 0 ? (
            <p className="mt-1 truncate text-sm text-muted">
              {concert.country ? <CountryLabel name={concert.country} className="inline-flex" /> : null}
              {concert.country && bits.length > 0 ? " · " : null}
              {bits.join(" · ")}
            </p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {!started ? (
              <p className="text-xs text-faint">{t("there.upcomingNight")}</p>
            ) : user ? (
              <Button type="button" variant={own ? "outline" : "default"} onClick={onToggleForm}>
                {own ? <Check className="size-4" /> : null}
                {own ? t("there.done") : t("there.cta")}
              </Button>
            ) : (
              <Button asChild>
                <Link to="/login">{t("there.cta")}</Link>
              </Button>
            )}
            <Button asChild variant="ghost" size="sm">
              <Link to="/concerts/$id" params={{ id: concert.id }}>
                {t("there.nightPage")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
      {formOpen && started && user ? (
        <IWasThereForm
          concert={concert}
          existing={own}
          onSaved={onSaved}
          onCancel={onToggleForm}
        />
      ) : null}
      {reviews.length > 0 ? (
        <div className="mt-4 border-t border-border pt-3">
          <p className="text-[11px] tracking-[0.16em] text-faint uppercase">
            {t("there.count").replace("{n}", String(reviews.length))}
          </p>
          <ReviewList reviews={reviews} currentUserId={currentUserId} onDeleted={onDeleted} />
        </div>
      ) : null}
    </article>
  );
}

export function Nightbook({
  artistName,
  concerts,
  initialReviews,
}: {
  artistName: string;
  concerts: Concert[];
  initialReviews: NightReview[];
}) {
  const { t } = useI18n();
  const { user } = useCurrentUserState();
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [query, setQuery] = useState("");
  const [yearOpen, setYearOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const year = new Date().getFullYear();

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  const past = useMemo(
    () =>
      concerts
        .filter((concert) => isPast(concert))
        .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()),
    [concerts],
  );
  const thisYear = useMemo(
    () =>
      concerts
        .filter((concert) => yearOf(concert.startsAt) === year)
        .sort((a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()),
    [concerts, year],
  );

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle) {
      return past.filter((concert) => {
        const hay = `${concert.title} ${concert.artistName} ${concert.city} ${concert.venue} ${concert.country} ${formatConcertYear(concert.startsAt)}`.toLowerCase();
        return hay.includes(needle);
      });
    }
    if (yearOpen) return thisYear;
    return past.slice(0, 3);
  }, [past, query, yearOpen, thisYear]);

  function mergeReview(next: NightReview) {
    setReviews((prev) => {
      const without = prev.filter((row) => row.id !== next.id);
      return [next, ...without];
    });
    setOpenId(null);
    void router.invalidate();
  }

  function dropReview(id: number) {
    setReviews((prev) => prev.filter((row) => row.id !== id));
    void router.invalidate();
  }

  return (
    <section className="mt-12">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("there.kicker")}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold">{t("there.title")}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {t("there.lead").replace("{name}", artistName)}
      </p>

      <div className="relative mt-5 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint" />
        <Input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setYearOpen(false);
          }}
          placeholder={t("there.searchPh")}
          aria-label={t("there.search")}
          className="pl-10"
        />
      </div>

      {thisYear.length > 0 ? (
        <button
          type="button"
          onClick={() => {
            setYearOpen((value) => !value);
            setQuery("");
          }}
          className="mt-3 text-sm text-muted hover:text-fg"
        >
          {yearOpen ? t("there.hideYear") : t("there.year")}
        </button>
      ) : null}

      {shown.length === 0 ? (
        <p className="mt-5 text-sm text-faint">
          {query.trim() ? t("there.noMatch") : t("there.empty")}
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {shown.map((concert) => (
            <NightCard
              key={concert.id}
              concert={concert}
              reviews={reviews.filter((row) => row.concertId === concert.id)}
              currentUserId={user?.id}
              formOpen={openId === concert.id}
              onToggleForm={() => setOpenId((id) => (id === concert.id ? null : concert.id))}
              onSaved={mergeReview}
              onDeleted={dropReview}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export function ConcertNightPanel({
  concert,
  initialReviews,
}: {
  concert: Concert;
  initialReviews: NightReview[];
}) {
  const { t } = useI18n();
  const { user } = useCurrentUserState();
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [open, setOpen] = useState(false);
  const started = concertHasStarted(concert);
  const own = reviews.find((row) => row.userId === user?.id);

  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  return (
    <section className="mt-10">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">{t("there.reviews")}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold">{t("there.fromRoom")}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{t("there.pageLead")}</p>

      <div className="mt-5">
        {!started ? (
          <p className="text-sm text-faint">{t("there.upcomingNight")}</p>
        ) : user ? (
          <Button type="button" variant={own ? "outline" : "default"} onClick={() => setOpen((v) => !v)}>
            {own ? <Check className="size-4" /> : null}
            {own ? t("there.done") : t("there.cta")}
          </Button>
        ) : (
          <div className="rounded-2xl bg-surface p-5 shadow-border">
            <p className="text-sm leading-relaxed text-muted">{t("there.signin")}</p>
            <Button asChild className="mt-4">
              <Link to="/login">{t("there.signinCta")}</Link>
            </Button>
          </div>
        )}
      </div>

      {open && started && user ? (
        <div className="mt-4 max-w-xl">
          <IWasThereForm
            concert={concert}
            existing={own}
            onSaved={(review) => {
              setReviews((prev) => [review, ...prev.filter((row) => row.id !== review.id)]);
              setOpen(false);
              void router.invalidate();
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      ) : null}

      {reviews.length === 0 ? (
        <p className="mt-5 text-sm text-faint">{t("there.noReviews")}</p>
      ) : (
        <ReviewList
          reviews={reviews}
          currentUserId={user?.id}
          onDeleted={(id) => {
            setReviews((prev) => prev.filter((row) => row.id !== id));
            void router.invalidate();
          }}
        />
      )}
    </section>
  );
}
