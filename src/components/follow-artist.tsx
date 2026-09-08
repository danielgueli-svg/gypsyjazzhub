import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ALERT_FREQUENCIES,
  isAlertFollowing,
  setArtistFollowCadence,
  toggleAlertFollow,
  type AlertFollow,
  type AlertFrequency,
} from "@/lib/alerts";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function CadenceRow({
  value,
  onPick,
}: {
  value: AlertFrequency;
  onPick: (next: AlertFrequency) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap gap-1">
      {ALERT_FREQUENCIES.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onPick(id)}
          className={cn(
            "h-8 rounded-md px-2.5 text-xs",
            value === id ? "bg-accent text-accent-fg" : "bg-raised text-muted hover:text-fg",
          )}
        >
          {t(`follow.${id}`)}
        </button>
      ))}
    </div>
  );
}

export function FollowArtist({ artist }: { artist: Omit<AlertFollow, "frequency"> }) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [following, setFollowing] = useState(false);
  const [frequency, setFrequency] = useState<AlertFrequency>("every");
  const [status, setStatus] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const payload = { ...artist, frequency };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user) return;
    void isAlertFollowing({ data: artist.artistSlug })
      .then((res) => {
        if (typeof res === "boolean") {
          setFollowing(res);
          return;
        }
        setFollowing(res.following);
        setFrequency(res.frequency ?? "every");
      })
      .catch(() => setFollowing(false));
  }, [user, artist.artistSlug]);

  if (!mounted || isPending) {
    return (
      <div className="max-w-xl space-y-2">
        <p className="text-sm leading-relaxed text-muted">{t("follow.lead")}</p>
        <div className="h-11 w-40 animate-pulse rounded-md bg-raised" />
      </div>
    );
  }
  if (!user) {
    return (
      <div className="max-w-xl space-y-3">
        <p className="text-sm leading-relaxed text-muted">{t("follow.lead")}</p>
        <Button asChild>
          <Link to="/login">{t("follow.signIn")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-2">
      <p className="text-sm leading-relaxed text-muted">{t("follow.lead")}</p>
      <Button
        type="button"
        variant={following ? "outline" : "default"}
        onClick={() => {
          setStatus(null);
          void toggleAlertFollow({ data: payload })
            .then((res) => {
              setFollowing(res.following);
              if (res.frequency) setFrequency(res.frequency);
              setStatus(res.following ? t("follow.saved") : t("follow.unfollowed"));
            })
            .catch((err) => setStatus(err instanceof Error ? err.message : "Could not follow"));
        }}
      >
        {following ? t("follow.following") : t("follow.artist")}
      </Button>
      {following ? (
        <CadenceRow
          value={frequency}
          onPick={(next) => {
            setFrequency(next);
            void setArtistFollowCadence({ data: { ...artist, frequency: next } })
              .then(() => setStatus(t("follow.saved")))
              .catch((err) => setStatus(err instanceof Error ? err.message : "Could not save"));
          }}
        />
      ) : null}
      <p className="text-xs text-faint">{status ?? (following ? t("follow.hintOn") : t("follow.hintOff"))}</p>
    </div>
  );
}

export { CadenceRow };
