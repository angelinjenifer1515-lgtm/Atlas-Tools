import { defineMcp } from "@lovable.dev/mcp-js";
import listCategories from "./tools/list-categories";
import searchTools from "./tools/search-tools";
import getTool from "./tools/get-tool";

export default defineMcp({
  name: "peek-ahead",
  title: "Peek Ahead",
  version: "0.1.0",
  instructions:
    "Browse the Atlas Tools catalog of free browser-based utilities. Use `list_categories` for an overview, `search_tools` to find utilities by keyword or category, and `get_tool` for details and the page path of a specific tool.",
  tools: [listCategories, searchTools, getTool],
});
