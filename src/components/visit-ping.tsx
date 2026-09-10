import { useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { pingVisit } from "@/lib/visits";

const VID = "hub-vid";
const STAMP = "hub-vid-at";

function visitorId() {
  try {
    let id = window.localStorage.getItem(VID);
    if (!id || !/^[a-zA-Z0-9-]{8,64}$/.test(id)) {
      id = crypto.randomUUID();
      window.localStorage.setItem(VID, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function VisitPing() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (pathname.startsWith("/studio") || pathname.startsWith("/api")) return;
    const id = visitorId();
    if (!id) return;
    try {
      const last = Number(window.sessionStorage.getItem(STAMP) || 0);
      if (Date.now() - last < 20_000) return;
      window.sessionStorage.setItem(STAMP, String(Date.now()));
    } catch {
      /* still ping once */
    }
    void pingVisit({ data: id }).catch(() => {});
  }, [pathname]);

  return null;
}
