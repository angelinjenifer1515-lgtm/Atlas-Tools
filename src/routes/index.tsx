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
      { title: "Atlas Tools — Everything. Beautifully Organized." },
      {
        name: "description",
        content:
          "Hundreds of beautifully crafted online utilities. Completely free, no sign-ups, no downloads, everything runs instantly in your browser. New possibilities, continuously added.",
      },
      { property: "og:title", content: "Atlas Tools — Everything. Beautifully Organized." },
      {
        property: "og:description",
        content:
          "Hundreds of beautifully crafted online utilities. Completely free, no sign-ups, no downloads, everything runs instantly in your browser. New possibilities, continuously added.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Atlas Tools" },
      { name: "twitter:description", content: "Hundreds of beautifully crafted online utilities. Completely free, no sign-ups, no downloads, everything runs instantly in your browser. New possibilities, continuously added." },
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
