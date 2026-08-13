import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";

// Root route: provide global head metadata and render nested routes via Outlet
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
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
      { name: "google-site-verification", content: "egQ6DJ--CZ7E8TPgch5JhGBqXwrt1K8m394VReZs1qg" },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Outlet />
    </div>
  );
}
