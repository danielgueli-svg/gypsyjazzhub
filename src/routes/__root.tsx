import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { AppErrorComponent } from "@/lib/error-component";
import { LocaleProvider } from "@/lib/i18n";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VisitPing } from "@/components/visit-ping";
import appCss from "../styles.css?url";

const APP_NAME = "Gypsy Jazz Hub";

export const Route = createRootRoute({
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
      { rel: "icon", type: "image/png", href: "/logo-mark.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: RootDocument,
  errorComponent: AppErrorComponent,
  notFoundComponent: NotFound,
});

function RootDocument() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const scene = pathname === "/" ? "home" : "read";

  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh text-fg" data-scene={scene}>
        <PreviewHostBridge />
        <AuthProvider>
          <LocaleProvider>
          <VisitPing />
          <div className="flex min-h-dvh flex-col">
            <SiteHeader />
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
