import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/atlas/Nav";
import { Hero } from "@/components/variants/interactive/Hero";
import { Testimonials } from "@/components/variants/interactive/Testimonials";
import { InteractiveBackground } from "@/components/variants/interactive/InteractiveBackground";
import { Categories } from "@/components/atlas/Categories";
import { BuiltForImpact } from "@/components/atlas/BuiltForImpact";
import { PowerfulTools } from "@/components/atlas/PowerfulTools";
import { FinalCTA } from "@/components/atlas/FinalCTA";
import { Footer } from "@/components/atlas/Footer";
import { VariantSwitcher } from "@/components/variants/VariantSwitcher";
import { useAssignFloating } from "@/hooks/useAssignFloating";

export const Route = createFileRoute("/v/interactive")({
  head: () => ({
    meta: [
      { title: "Atlas Tools — Interactive UI Preview" },
      {
        name: "description",
        content:
          "Preview of the interactive UI branch of Atlas Tools: animated background layers and floating card motion across the landing page.",
      },
      { property: "og:title", content: "Atlas Tools — Interactive UI Preview" },
      {
        property: "og:description",
        content: "Animated background and floating card motion variant of the Atlas Tools landing page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InteractiveVariant,
});

function InteractiveVariant() {
  useAssignFloating();
  return (
    <main className="relative min-h-screen w-full overflow-x-clip bg-[#050505] text-white">
      <InteractiveBackground />
      <Nav />
      <Hero />
      <Categories />
      <BuiltForImpact />
      <PowerfulTools />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <VariantSwitcher />
    </main>
  );
}
