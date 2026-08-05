import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/tools/PageShell";
import { LegalPage } from "@/components/tools/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Atlas Tools" },
      { name: "description", content: "The simple terms that cover using the free, browser-based utilities on Atlas Tools." },
      { property: "og:title", content: "Terms of Use — Atlas Tools" },
      { property: "og:description", content: "Free, unlimited, client-side tools — provided as-is, with no warranty." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell>
      <LegalPage
        title="Terms of Use"
        intro="Short version: use Atlas freely, expect no warranty, and don't use it to break the law."
        sections={[
          {
            h: "Free to use",
            p: "Every tool is free and unlimited for personal and commercial use. No attribution is required, though it is always appreciated.",
          },
          {
            h: "Provided as-is",
            p: "Atlas Tools is offered without warranty of any kind. Always keep a backup of important documents before processing them, and verify any calculation before relying on it for financial, medical or legal decisions.",
          },
          {
            h: "Acceptable use",
            p: "Do not use Atlas Tools to process content you have no right to, or for any unlawful purpose. Automated scraping or resale of the site is not permitted.",
          },
          {
            h: "Changes",
            p: "Tools may be added, improved or retired over time. Continued use of the site means you accept the current version of these terms.",
          },
        ]}
      />
    </PageShell>
  );
}
