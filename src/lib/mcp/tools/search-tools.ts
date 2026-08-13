import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { TOOLS, type CategorySlug } from "@/lib/tools/registry";

const CATEGORY_SLUGS = [
  "image-tools",
  "pdf-tools",
  "text-tools",
  "calculators",
  "ai-tools",
  "developer-tools",
  "business-tools",
] as const;

export default defineTool({
  name: "search_tools",
  title: "Search tools",
  description:
    "Search the Atlas Tools catalog by keyword and/or category. Returns matching tools with their slugs and page paths.",
  inputSchema: {
    query: z.string().optional().describe("Keyword matched against tool name and description."),
    category: z.enum(CATEGORY_SLUGS).optional().describe("Restrict results to one category."),
    limit: z.number().int().optional().describe("Maximum number of results (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, limit }) => {
    const q = query?.trim().toLowerCase();
    const max = Math.min(Math.max(limit ?? 20, 1), 100);
    const results = TOOLS.filter((t) => {
      if (category && t.category !== (category as CategorySlug)) return false;
      if (!q) return true;
      return `${t.name} ${t.desc} ${t.slug}`.toLowerCase().includes(q);
    })
      .slice(0, max)
      .map((t) => ({
        slug: t.slug,
        name: t.name,
        description: t.desc,
        category: t.category,
        path: `/tools/${t.slug}`,
      }));

    return {
      content: [
        {
          type: "text",
          text: results.length
            ? JSON.stringify(results, null, 2)
            : "No tools matched that search.",
        },
      ],
      structuredContent: { count: results.length, results },
    };
  },
});
