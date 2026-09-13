import { Link, useRouter } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { updateHubArtistBio } from "@/lib/hub-api";
import { useI18n } from "@/lib/i18n";

export function ArtistBioEdit({
  slug,
  bio,
  claimed,
}: {
  slug: string;
  bio: string;
  claimed?: boolean;
}) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(bio);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  if (claimed) return null;

  const editButton = isPending ? (
    <div className="h-9 w-16 animate-pulse rounded-md bg-raised" />
  ) : user ? (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => {
        setOpen((v) => !v);
        setValue(bio);
        setStatus(null);
      }}
    >
      {t("bio.edit")}
    </Button>
  ) : (
    <Button asChild variant="outline" size="sm">
      <Link to="/login" search={{ next: `/musicians/${slug}` }}>
        {t("bio.edit")}
      </Link>
    </Button>
  );

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const result = await updateHubArtistBio({ data: { slug, bio: value } });
      setStatus(result.pending ? t("bio.pending") : t("bio.saved"));
      if (!result.pending) setOpen(false);
      void router.invalidate();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : t("bio.fail"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-3">
      {editButton}
      {open && user ? (
        <form onSubmit={(event) => void onSubmit(event)} className="mt-3 max-w-2xl space-y-3">
          <p className="text-sm text-muted">{t("bio.lead")}</p>
          <Textarea
            required
            rows={8}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={t("bio.placeholder")}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" size="sm" disabled={busy}>
              {busy ? t("bio.saving") : t("bio.save")}
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
