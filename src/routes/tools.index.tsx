import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/tools/PageShell";
import { CATEGORIES, toolsInCategory } from "@/lib/tools/registry";

export const Route = createFileRoute("/tools/")({
  head: () => ({
    meta: [
      { title: "All Tools — 100+ Free Online Tools | Atlas Tools" },
      {
        name: "description",
        content:
          "Browse every Atlas tool: image, PDF, text, calculators, AI, developer and business utilities. Free, private and instant in your browser.",
      },
      { property: "og:title", content: "All Tools — 100+ Free Online Tools | Atlas Tools" },
      { property: "og:description", content: "Every Atlas utility in one directory. Free forever." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Atlas Tools" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://the-atlas-tools.vercel.app/tools" },
    ],
  }),
  component: ToolsIndex,
});

function ToolsIndex() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-6 pb-24">
        <header className="py-10 sm:py-14">
          <h1 className="font-display text-balance text-[clamp(2.1rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            All tools
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-white/55">
            Every utility Atlas offers, grouped by category. Free, no account, everything runs in your browser.
          </p>
        </header>

        {CATEGORIES.map((cat) => (
          <section key={cat.slug} className="mt-14 first:mt-0">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-[18px] font-semibold tracking-tight text-white">{cat.name}</h2>
                <p className="mt-1 text-[12.5px] text-white/50">{cat.desc}</p>
              </div>
              <Link
                to="/categories/$categorySlug"
                params={{ categorySlug: cat.slug }}
                className="shrink-0 text-[12px] text-white/60 transition hover:text-white"
              >
                View category →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {toolsInCategory(cat.slug).map((tool) => (
                <Link
                  key={tool.slug}
                  to="/tools/$toolSlug"
                  params={{ toolSlug: tool.slug }}
                  className="card-elev group rounded-2xl p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.14]"
                >
                  <h3 className="font-display text-[14px] font-semibold text-white">{tool.name}</h3>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/50">{tool.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
