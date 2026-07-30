import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/atlas/Nav";
import { Hero } from "@/components/atlas/Hero";
import { Categories } from "@/components/atlas/Categories";
import { BuiltForImpact } from "@/components/atlas/BuiltForImpact";
import { PowerfulTools } from "@/components/atlas/PowerfulTools";
import { Testimonials } from "@/components/atlas/Testimonials";
import { FinalCTA } from "@/components/atlas/FinalCTA";
import { Footer } from "@/components/atlas/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atlas Tools — Everything. Beautifully Organized." },
      {
        name: "description",
        content:
          "Atlas Tools is the internet's most thoughtfully crafted collection of online utilities. Hundreds of premium tools, free forever, running instantly in your browser.",
      },
      { property: "og:title", content: "Atlas Tools — Everything. Beautifully Organized." },
      {
        property: "og:description",
        content:
          "Hundreds of beautifully crafted online tools. Free forever, instant, private.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Atlas Tools" },
      { name: "twitter:description", content: "Everything. Beautifully Organized." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen w-full overflow-x-clip bg-[#050505] text-white">
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
