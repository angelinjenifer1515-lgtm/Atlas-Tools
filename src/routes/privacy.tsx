import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/tools/PageShell";
import { LegalPage } from "@/components/tools/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Atlas Tools" },
      { name: "description", content: "How Atlas Tools handles your data: every tool runs locally in your browser and nothing is uploaded." },
      { property: "og:title", content: "Privacy Policy — Atlas Tools" },
      { property: "og:description", content: "Atlas Tools processes everything client-side. No uploads, no accounts, no tracking of your content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell>
      <LegalPage
        title="Privacy Policy"
        intro="Atlas Tools is built so that privacy is a property of the architecture, not a promise in a document."
        sections={[
          {
            h: "Your files never leave your device",
            p: "Every tool on Atlas runs entirely in your browser using standard web APIs — Canvas, WebCrypto, File and pdf-lib. Images, PDFs and text you provide are processed in memory on your own machine and are never transmitted to a server.",
          },
          {
            h: "No accounts, no profiles",
            p: "There is no sign-up, no login and no user database. We do not create a profile of you and we do not sell or share data, because we do not collect it.",
          },
          {
            h: "Cookies",
            p: "Atlas Tools does not set advertising or tracking cookies. Any state, such as the last inputs of a tool, lives only for the lifetime of the page.",
          },
          {
            h: "Third parties",
            p: "Static assets and fonts are served with the site. No tool calls an external API with your content.",
          },
        ]}
      />
    </PageShell>
  );
}
