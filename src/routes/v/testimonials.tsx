import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/atlas/Nav";
import { Hero } from "@/components/variants/testimonials/Hero";
import { Testimonials } from "@/components/variants/testimonials/Testimonials";
import { Categories } from "@/components/atlas/Categories";
import { BuiltForImpact } from "@/components/atlas/BuiltForImpact";
import { PowerfulTools } from "@/components/atlas/PowerfulTools";
import { FinalCTA } from "@/components/atlas/FinalCTA";
import { Footer } from "@/components/atlas/Footer";
import { VariantSwitcher } from "@/components/variants/VariantSwitcher";

export const Route = createFileRoute("/v/testimonials")({
  head: () => ({
    meta: [
      { title: "Atlas Tools — Testimonials Style Preview" },
      {
        name: "description",
        content:
          "Preview of the testimonials styling branch of Atlas Tools, with the restyled review cards on the landing page.",
      },
      { property: "og:title", content: "Atlas Tools — Testimonials Style Preview" },
      {
        property: "og:description",
        content: "Restyled testimonial cards variant of the Atlas Tools landing page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TestimonialsVariant,
});

function TestimonialsVariant() {
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
      <VariantSwitcher />
    </main>
  );
}
