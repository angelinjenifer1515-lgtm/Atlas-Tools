import { lazy, type ComponentType } from "react";
import type { CategorySlug } from "./registry";

export type ToolComponent = ComponentType<Record<string, never>>;
export type ToolModule = { tools: Record<string, ToolComponent> };

const loaders: Record<CategorySlug, () => Promise<ToolModule>> = {
  "image-tools": () => import("@/components/tools/impl/image"),
  "pdf-tools": () => import("@/components/tools/impl/pdf"),
  "text-tools": () => import("@/components/tools/impl/text"),
  calculators: () => import("@/components/tools/impl/calculators"),
  "ai-tools": () => import("@/components/tools/impl/ai"),
  "developer-tools": () => import("@/components/tools/impl/developer"),
  "business-tools": () => import("@/components/tools/impl/business"),
};

const cache = new Map<string, ToolComponent>();

/** Lazily loads the implementation for a tool, code-split per category. */
export function getToolComponent(category: CategorySlug, slug: string): ToolComponent {
  const key = `${category}/${slug}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const Comp = lazy(async () => {
    const mod = await loaders[category]();
    const found = mod.tools[slug];
    return { default: (found ?? Missing) as ComponentType };
  }) as unknown as ToolComponent;
  cache.set(key, Comp);
  return Comp;
}

function Missing() {
  return (
    <div className="card-elev rounded-2xl p-6 text-[13px] text-white/60">
      This tool interface is not available yet.
    </div>
  );
}
