import { getRequest } from "@tanstack/react-start/server";
import {
  isCrawler,
  localeFromCookie,
  resolveLocale,
  type DetectedLocale,
} from "@/lib/locale-detect";

type CfRequest = Request & {
  cf?: { country?: string };
};

export function readRequestLocale(): DetectedLocale {
  try {
    const request = getRequest() as CfRequest | undefined;
    if (!request) return "en";
    const cookie = request.headers.get("cookie") ?? "";
    const chosen = localeFromCookie(cookie);
    const ua = request.headers.get("user-agent") ?? "";
    const header = request.headers.get("cf-ipcountry")?.trim().toUpperCase() ?? "";
    let country = (request.cf?.country || header || "").toUpperCase();
    if (country === "XX" || country === "T1" || country === "A1" || country === "A2") country = "";
    country = country.replace(/[^A-Z]/g, "").slice(0, 2);
    return resolveLocale({
      chosen,
      country,
      acceptLanguage: request.headers.get("accept-language"),
      crawler: isCrawler(ua),
    });
  } catch {
    return "en";
  }
}
