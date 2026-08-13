import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/atlas/Nav";
import { Hero } from "@/components/atlas/Hero";
import { Categories } from "@/components/atlas/Categories";
import { BuiltForImpact } from "@/components/atlas/BuiltForImpact";
import { PowerfulTools } from "@/components/atlas/PowerfulTools";
import { Testimonials } from "@/components/atlas/Testimonials";
import { FinalCTA } from "@/components/atlas/FinalCTA";
import { Footer } from "@/components/atlas/Footer";
import { InteractiveBackground } from "@/components/atlas/InteractiveBackground";
import { useAssignFloating } from "@/hooks/useAssignFloating";

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
    ],
  }),
  component: Index,
});

function Index() {
  useAssignFloating();

  return (
    <main className="relative min-h-screen w-full overflow-x-clip bg-transparent text-white [perspective:1600px]">
      <InteractiveBackground />
      <Nav />
      <Hero />
      <Categories />
      <BuiltForImpact />
      <PowerfulTools />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
}
