import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CadenceRow } from "@/components/follow-artist";
import { Button } from "@/components/ui/button";
import {
  getCountryFollowState,
  setCountryFollowCadence,
  type AlertFrequency,
} from "@/lib/alerts";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useI18n } from "@/lib/i18n";

export function FollowCountry({ country }: { country: string }) {
  const { t } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [following, setFollowing] = useState(false);
  const [frequency, setFrequency] = useState<AlertFrequency>("every");
  const [status, setStatus] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user || !country) return;
    void getCountryFollowState({ data: country })
      .then((res) => {
        setFollowing(res.following);
        setFrequency(res.frequency);
      })
      .catch(() => setFollowing(false));
  }, [user, country]);

  if (!country) return null;
  if (!mounted || isPending) {
    return <div className="h-11 w-48 animate-pulse rounded-md bg-raised" />;
  }
  if (!user) {
    return (
      <Button asChild>
        <Link to="/login">{t("follow.signIn")}</Link>
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={following ? "outline" : "default"}
        onClick={() => {
          setStatus(null);
          void setCountryFollowCadence({
            data: { country, following: !following, frequency },
          })
            .then((res) => {
              setFollowing(res.following);
              setFrequency(res.frequency);
              setStatus(res.following ? t("follow.saved") : t("follow.unfollowed"));
            })
            .catch((err) => setStatus(err instanceof Error ? err.message : "Could not follow"));
        }}
      >
        {following ? t("follow.countryOn") : t("follow.country")}
      </Button>
      {following ? (
        <CadenceRow
          value={frequency}
          onPick={(next) => {
            setFrequency(next);
            void setCountryFollowCadence({
              data: { country, following: true, frequency: next },
            })
              .then(() => setStatus(t("follow.saved")))
              .catch((err) => setStatus(err instanceof Error ? err.message : "Could not save"));
          }}
        />
      ) : null}
      <p className="text-xs text-faint">{status ?? (following ? t("follow.hintOn") : t("follow.hintOff"))}</p>
    </div>
  );
}
