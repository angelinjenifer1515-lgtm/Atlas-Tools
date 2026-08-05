import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/tools/PageShell";
import { LegalPage } from "@/components/tools/LegalPage";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Atlas Tools" },
      { name: "description", content: "Request a tool, report a bug or say hello to the team behind Atlas Tools." },
      { property: "og:title", content: "Contact — Atlas Tools" },
      { property: "og:description", content: "Request a tool, report a bug or send feedback about Atlas Tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell>
      <LegalPage
        title="Contact"
        intro="Atlas is built and maintained by one person. Feedback genuinely shapes what gets built next."
        sections={[
          {
            h: "Request a tool",
            p: "Missing something you use every day? Send the name of the tool and a sentence about how you'd use it, and it will be considered for the next batch.",
          },
          {
            h: "Report a bug",
            p: "Include the tool name, your browser and what you expected to happen. Because everything runs locally, a short description of the input usually reproduces it instantly.",
          },
          {
            h: "Email",
            p: "hello@atlastools.app — replies usually arrive within a couple of days.",
          },
          {
            h: "Credits",
            p: "Atlas Tools is designed and built by Angelin Jenifer.",
          },
        ]}
      />
    </PageShell>
  );
}
