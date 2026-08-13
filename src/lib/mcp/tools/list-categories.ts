import { defineTool } from "@lovable.dev/mcp-js";
import { CATEGORIES, toolsInCategory } from "@/lib/tools/registry";

export default defineTool({
  name: "list_categories",
  title: "List tool categories",
  description: "List every Atlas Tools category with its description and tool count.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const categories = CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.desc,
      toolCount: toolsInCategory(c.slug).length,
      path: `/categories/${c.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(categories, null, 2) }],
      structuredContent: { categories },
    };
  },
});
