import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CATEGORY_BY_SLUG, TOOLS_BY_SLUG, relatedTools } from "@/lib/tools/registry";

export default defineTool({
  name: "get_tool",
  title: "Get tool details",
  description:
    "Get full details for one Atlas Tools utility by slug, including its category, page path and related tools.",
  inputSchema: { slug: z.string().describe("Tool slug, e.g. 'word-counter'.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const tool = TOOLS_BY_SLUG[slug.trim()];
    if (!tool) throw new ToolError(`No tool found with slug "${slug}".`);
    const category = CATEGORY_BY_SLUG[tool.category];
    const details = {
      slug: tool.slug,
      name: tool.name,
      description: tool.desc,
      category: { slug: tool.category, name: category?.name ?? tool.category },
      path: `/tools/${tool.slug}`,
      related: relatedTools(tool.slug).map((r) => ({ slug: r.slug, name: r.name })),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(details, null, 2) }],
      structuredContent: details,
    };
  },
});
