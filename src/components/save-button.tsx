import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isFavorite, toggleFavorite, type FavoriteKind } from "@/lib/favorites";
import { cn } from "@/lib/utils";

export function SaveButton({
  kind,
  slug,
  label,
}: {
  kind: FavoriteKind;
  slug: string;
  label?: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved(false);
      setReady(true);
      return;
    }
    void isFavorite({ data: { kind, slug } })
      .then(setSaved)
      .catch(() => setSaved(false))
      .finally(() => setReady(true));
  }, [user, kind, slug]);

  if (isPending || !ready) {
    return <div className="h-11 w-28 animate-pulse rounded-md bg-raised" />;
  }
  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link to="/login">{label ?? "Save"}</Link>
      </Button>
    );
  }
  return (
    <Button
      type="button"
      variant={saved ? "outline" : "default"}
      size="sm"
      onClick={() => {
        void toggleFavorite({ data: { kind, slug } })
          .then((res) => setSaved(res.saved))
          .catch(() => undefined);
      }}
      className={cn("gap-1.5")}
    >
      <Heart className={cn("size-4", saved && "fill-current")} />
      {saved ? "Saved" : (label ?? "Save")}
    </Button>
  );
}
