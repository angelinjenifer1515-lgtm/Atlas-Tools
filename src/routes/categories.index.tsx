import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/tools/PageShell";
import { CATEGORIES, toolsInCategory } from "@/lib/tools/registry";

export const Route = createFileRoute("/categories/")({
  head: () => ({
    meta: [
      { title: "Tool Categories — Browse by Type | Atlas" },
      {
        name: "description",
        content:
          "Explore Atlas tool categories: image, PDF, text, calculators, AI, developer and business utilities — all free and browser-based.",
      },
      { property: "og:title", content: "Tool Categories — Atlas" },
      { property: "og:description", content: "Seven categories, over a hundred free browser tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CategoriesIndex,
});

function CategoriesIndex() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-6 pb-24">
        <header className="py-10 sm:py-14">
          <h1 className="font-display text-balance text-[clamp(2.1rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            Categories
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-white/55">
            Seven collections, built for everyday work. Pick a category to see everything inside.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to="/categories/$categorySlug"
              params={{ categorySlug: cat.slug }}
              className="card-elev group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.14]"
            >
              <div
                className="pointer-events-none absolute -top-10 right-0 h-32 w-32 rounded-full blur-2xl"
                style={{ background: `radial-gradient(closest-side, ${cat.glow}, transparent 70%)`, opacity: 0.55 }}
              />
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">
                {toolsInCategory(cat.slug).length} tools
              </span>
              <h2 className="font-display mt-4 text-[18px] font-semibold tracking-tight text-white">{cat.name}</h2>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
