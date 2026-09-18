import { Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { MAX_PAGE_LINKS, sanitizePageUrl, sanitizePhotoUrl, type HubArtistLink } from "@/lib/artist-page";
import { updateHubArtistBio } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";

type DraftLink = { label: string; url: string };

function draftsFrom(links: HubArtistLink[]): DraftLink[] {
  const rows = links.map((link) => ({ label: link.label, url: link.url }));
  return rows.length ? rows : [{ label: "", url: "" }];
}

export function ArtistBioEdit({
  slug,
  bio,
  links = [],
  photoUrl = "",
  returnTo,
}: {
  slug: string;
  bio: string;
  links?: HubArtistLink[];
  photoUrl?: string;
  returnTo?: string;
}) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(bio);
  const [photo, setPhoto] = useState(photoUrl);
  const [drafts, setDrafts] = useState<DraftLink[]>(() => draftsFrom(links));
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const next = returnTo ?? `/musicians/${slug}`;

  function resetForm() {
    setValue(bio);
    setPhoto(photoUrl);
    setDrafts(draftsFrom(links));
    setStatus(null);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      for (const row of drafts) {
        const label = row.label.trim();
        const url = row.url.trim();
        if (!label && !url) continue;
        if (!label || !sanitizePageUrl(url)) {
          throw new Error(t("page.linkNeedBoth"));
        }
      }
      if (photo.trim() && !sanitizePhotoUrl(photo)) {
        throw new Error(t("page.photoBad"));
      }
      const result = await updateHubArtistBio({
        data: {
          slug,
          bio: value,
          links: drafts,
          photoUrl: photo,
        },
      });
      setStatus(result.pending ? t("bio.pending") : t("page.saved"));
      if (!result.pending) setOpen(false);
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t("bio.fail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4">
      {isPending ? (
        <div className="h-9 w-20 animate-pulse rounded-md bg-raised" />
      ) : user ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setOpen((v) => !v);
            resetForm();
          }}
        >
          {t("page.edit")}
        </Button>
      ) : (
        <Button asChild variant="outline" size="sm">
          <Link to="/login" search={{ next }}>
            {t("page.edit")}
          </Link>
        </Button>
      )}
      {open && user ? (
        <form onSubmit={(event) => void onSubmit(event)} className="mt-3 max-w-2xl space-y-4">
          <p className="text-sm text-muted">{t("page.lead")}</p>
          <Textarea
            rows={8}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("bio.placeholder")}
          />
          <div className="space-y-2">
            <Label htmlFor="page-photo">{t("page.photo")}</Label>
            <p className="text-sm text-muted">{t("page.photoLead")}</p>
            <Input
              id="page-photo"
              type="text"
              inputMode="url"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="https://… or /groups/photo.jpg"
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label>{t("page.links")}</Label>
            <p className="text-sm text-muted">{t("page.linksLead")}</p>
            <div className="space-y-2">
              {drafts.map((row, index) => (
                <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input
                    value={row.label}
                    onChange={(e) => {
                      const nextRows = drafts.slice();
                      nextRows[index] = { ...row, label: e.target.value };
                      setDrafts(nextRows);
                    }}
                    placeholder={t("page.linkLabel")}
                    aria-label={t("page.linkLabel")}
                    autoComplete="off"
                  />
                  <Input
                    type="text"
                    inputMode="url"
                    value={row.url}
                    onChange={(e) => {
                      const nextRows = drafts.slice();
                      nextRows[index] = { ...row, url: e.target.value };
                      setDrafts(nextRows);
                    }}
                    placeholder={t("page.linkUrl")}
                    aria-label={t("page.linkUrl")}
                    autoComplete="off"
                  />
                  {drafts.length > 1 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDrafts(drafts.filter((_, i) => i !== index))}
                    >
                      {t("page.removeLink")}
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
            {drafts.length < MAX_PAGE_LINKS ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDrafts([...drafts, { label: "", url: "" }])}
              >
                {t("page.addLink")}
              </Button>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={busy}>
              {busy ? t("bio.saving") : t("page.save")}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              {t("bio.cancel")}
            </Button>
            {status ? <p className="text-sm text-muted">{status}</p> : null}
          </div>
        </form>
      ) : status ? (
        <p className="mt-2 text-sm text-muted">{status}</p>
      ) : null}
    </div>
  );
}
