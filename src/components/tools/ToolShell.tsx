import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { PageShell } from "./PageShell";
import { FaqAccordion, type Faq } from "./FaqAccordion";
import { CATEGORY_BY_SLUG, relatedTools, type ToolMeta } from "@/lib/tools/registry";

export type { Faq };

export function ToolShell({
  tool,
  faqs,
  children,
}: {
  tool: ToolMeta;
  faqs?: Faq[];
  children: ReactNode;
}) {
  const category = CATEGORY_BY_SLUG[tool.category];
  const related = relatedTools(tool.slug);
  const questions = faqs ?? defaultFaqs(tool);

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-6 pb-24">
        {/* Hero */}
        <header className="relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] text-white/45">
            <Link to="/tools" className="transition hover:text-white">
              All Tools
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              to="/categories/$categorySlug"
              params={{ categorySlug: category.slug }}
              className="transition hover:text-white"
            >
              {category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">{tool.name}</span>
          </nav>

          <h1 className="font-display text-balance text-[clamp(2.1rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            {tool.name}
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-white/55">{tool.desc}</p>
        </header>

        {/* Interactive tool */}
        <div className="space-y-4">{children}</div>

        {/* Related */}
        <section className="mt-20">
          <h2 className="font-display mb-5 text-[18px] font-semibold tracking-tight text-white">Related tools</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/tools/$toolSlug"
                params={{ toolSlug: r.slug }}
                className="card-elev group rounded-2xl p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.14]"
              >
                <h3 className="font-display text-[14px] font-semibold text-white">{r.name}</h3>
                <p className="mt-1 text-[12px] leading-relaxed text-white/50">{r.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20">
          <h2 className="font-display mb-5 text-[18px] font-semibold tracking-tight text-white">
            Frequently asked questions
          </h2>
          <FaqAccordion items={questions} />
        </section>
      </div>
    </PageShell>
  );
}

function defaultFaqs(tool: ToolMeta): Faq[] {
  return [
    {
      q: `Is ${tool.name} free to use?`,
      a: "Yes. Every Atlas tool is free, unlimited and requires no account, sign-up or download.",
    },
    {
      q: "Are my files uploaded to a server?",
      a: "No. Everything is processed locally in your browser, so your files and text never leave your device.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes. The interface is fully responsive with touch-friendly controls and keyboard navigation on desktop.",
    },
  ];
}
