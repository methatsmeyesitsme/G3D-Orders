import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppErrorComponent } from "@/lib/error-component";
import appCss from "../styles.css?url";

const APP_NAME = "G3D Orders";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#F4F1EA" },
      {
        name: "description",
        content: "Private G3D studio desk for Squish orders and catalog.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600&family=Syne:wght@500;600;700&display=swap",
      },
    ],
  }),
  errorComponent: AppErrorComponent,
  notFoundComponent: NotFound,
  component: RootDocument,
});

function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-3xl font-semibold">Not found</p>
        <p className="mt-2 text-sm text-muted-foreground">That page is not in the studio.</p>
        <a href="/" className="mt-6 inline-flex h-11 items-center text-sm underline">
          Back to store
        </a>
      </div>
    </main>
  );
}

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        <PreviewHostBridge />
        <Outlet />
        <Toaster position="top-center" richColors={false} />
        <Scripts />
      </body>
    </html>
  );
}

