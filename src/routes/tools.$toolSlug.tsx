import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Suspense } from "react";
import { ToolShell } from "@/components/tools/ToolShell";
import { PageShell } from "@/components/tools/PageShell";
import { TOOLS_BY_SLUG } from "@/lib/tools/registry";
import { getToolComponent } from "@/lib/tools/loader";

export const Route = createFileRoute("/tools/$toolSlug")({
  loader: ({ params }) => {
    const tool = TOOLS_BY_SLUG[params.toolSlug];
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Tool not found — Atlas Tools" }, { name: "robots", content: "noindex" }],
      };
    }
    const { tool } = loaderData;
    const title = `${tool.name} — Free Online Tool | Atlas`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `${tool.desc} Free, private and instant — runs entirely in your browser.`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: tool.desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ToolPage,
  errorComponent: ToolError,
  notFoundComponent: ToolNotFound,
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  const Comp = getToolComponent(tool.category, tool.slug);
  return (
    <ToolShell tool={tool}>
      <Suspense
        fallback={
          <div className="card-elev rounded-2xl p-8 text-[13px] text-white/50">
            Loading the interface…
          </div>
        }
      >
        <Comp />
      </Suspense>
    </ToolShell>
  );
}

function ToolError() {
  return (
    <Fallback
      title="Something went wrong"
      body="This tool could not be loaded. Try again or browse the rest."
    />
  );
}

function ToolNotFound() {
  return (
    <Fallback
      title="Tool not found"
      body="We could not find that tool. Browse the full collection instead."
    />
  );
}

function Fallback({ title, body }: { title: string; body: string }) {
  return (
    <PageShell>
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-semibold tracking-[-0.035em] text-white">
          {title}
        </h1>
        <p className="mt-4 text-[14px] text-white/55">{body}</p>
        <Link
          to="/tools"
          className="glass mt-8 inline-flex rounded-full px-5 py-2.5 text-[13px] text-white/85 transition hover:text-white"
        >
          Browse all tools
        </Link>
      </div>
    </PageShell>
  );
}
