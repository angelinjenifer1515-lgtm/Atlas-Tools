import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { PageShell } from "@/components/tools/PageShell";
import { CATEGORY_BY_SLUG, toolsInCategory, type CategorySlug, type ToolMeta } from "@/lib/tools/registry";

export const Route = createFileRoute("/categories/$categorySlug")({
  loader: ({ params }) => {
    const category = CATEGORY_BY_SLUG[params.categorySlug];
    if (!category) throw notFound();
    return { category, tools: toolsInCategory(category.slug as CategorySlug) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Category not found — Atlas Tools" }, { name: "robots", content: "noindex" }] };
    }
    const { category } = loaderData;
    const title = `${category.name} — Free Online ${category.name} | Atlas`;
    return {
      meta: [
        { title },
        { name: "description", content: `${category.desc} Every tool is free and runs entirely in your browser.` },
        { property: "og:title", content: title },
        { property: "og:description", content: category.desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
  errorComponent: CategoryMissing,
  notFoundComponent: CategoryMissing,
});

function CategoryPage() {
  const { category, tools } = Route.useLoaderData();
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-6xl px-6 pb-24">
        <header className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] text-white/45">
            <Link to="/categories" className="transition hover:text-white">
              Categories
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">{category.name}</span>
          </nav>
          <h1 className="font-display text-balance text-[clamp(2.1rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
            {category.name}
          </h1>
          <p className="mt-4 max-w-xl text-[14.5px] leading-relaxed text-white/55">{category.desc}</p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool: ToolMeta) => (
            <Link
              key={tool.slug}
              to="/tools/$toolSlug"
              params={{ toolSlug: tool.slug }}
              className="card-elev group rounded-2xl p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.14]"
            >
              <h2 className="font-display text-[14px] font-semibold text-white">{tool.name}</h2>
              <p className="mt-1 text-[12px] leading-relaxed text-white/50">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageShell>
  );
}

function CategoryMissing() {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold tracking-[-0.035em] text-white">
          Category not found
        </h1>
        <p className="mt-4 text-[14px] text-white/55">Browse all categories instead.</p>
        <Link
          to="/categories"
          className="glass mt-8 inline-flex rounded-full px-5 py-2.5 text-[13px] text-white/85 transition hover:text-white"
        >
          All categories
        </Link>
      </div>
    </PageShell>
  );
}
