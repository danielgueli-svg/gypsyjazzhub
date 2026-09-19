import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { AppErrorComponent } from "@/lib/error-component";
import { LocaleProvider, isLocaleId, type LocaleId } from "@/lib/i18n";
import { localeFromCookie } from "@/lib/locale-detect";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VisitPing } from "@/components/visit-ping";
import type { TickerPayload } from "@/lib/ticker";
import appCss from "../styles.css?url";

const APP_NAME = "Gypsy Jazz Hub";

export const Route = createRootRoute({
  loader: async (): Promise<{ ticker: TickerPayload; locale: LocaleId }> => {
    const { tickerPayload } = await import("@/lib/ticker-data");
    let locale: LocaleId = "en";
    try {
      const { getRequestLocale } = await import("@/lib/locale-hint");
      const guessed = await getRequestLocale();
      if (isLocaleId(guessed)) locale = guessed;
    } catch {
      /* no request (build) — stay English */
    }
    return { ticker: tickerPayload(), locale };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#1a120e" },
      {
        name: "description",
        content:
          "Gypsy jazz jam sessions, musicians, concerts and festivals worldwide. Jazz Manouche events on an interactive globe.",
      },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/logo-mark.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
  errorComponent: AppErrorComponent,
  notFoundComponent: NotFound,
});

function htmlLocale(ssr: LocaleId): LocaleId {
  if (typeof document === "undefined") return ssr;
  const picked = localeFromCookie(document.cookie);
  return isLocaleId(picked) ? picked : ssr;
}

function RootDocument() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const data = Route.useLoaderData();
  const ticker = data?.ticker;
  const locale = htmlLocale(isLocaleId(data?.locale) ? data.locale : "en");
  const scene = pathname === "/" ? "home" : "read";

  return (
    <html lang={locale} className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh text-fg" data-scene={scene}>
        <PreviewHostBridge />
        <AuthProvider>
          <LocaleProvider initial={locale}>
          <VisitPing />
          <div className="flex min-h-dvh flex-col">
            <SiteHeader ticker={ticker} />
            <Outlet />
            <SiteFooter />
          </div>
          </LocaleProvider>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-[11px] tracking-[0.2em] text-faint uppercase">Lost the form</p>
      <h1 className="mt-3 font-display text-4xl font-semibold">This page is not on the setlist</h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        The circle is still here. Head back and pick another tune.
      </p>
    </main>
  );
}
