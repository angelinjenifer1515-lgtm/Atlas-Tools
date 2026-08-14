// <reference types="vite/client" />
import type { ReactNode } from "react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";

// Root route: global head metadata + document shell
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Atlas Tools — 100+ Free Online Tools" },
      {
        name: "description",
        content:
          "Free online tools for everyday tasks — text, images, PDFs, calculators, developer utilities and more. Fast, simple and free to use.",
      },
      { property: "og:title", content: "Atlas Tools — 100+ Free Online Tools" },
      {
        property: "og:description",
        content:
          "Free online tools for everyday tasks — text, images, PDFs, calculators, developer utilities and more. Fast, simple and free to use.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Atlas Tools" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Atlas Tools — 100+ Free Online Tools" },
      {
        name: "twitter:description",
        content:
          "Free online tools for everyday tasks — text, images, PDFs, calculators, developer utilities and more. Fast, simple and free to use.",
      },
      { property: "og:url", content: "https://the-atlas-tools.vercel.app/" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootDocument,
  component: Outlet,
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
