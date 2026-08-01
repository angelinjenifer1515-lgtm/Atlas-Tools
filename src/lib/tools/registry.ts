export type CategorySlug =
  | "image-tools"
  | "pdf-tools"
  | "text-tools"
  | "calculators"
  | "ai-tools"
  | "developer-tools"
  | "business-tools";

export interface ToolMeta {
  slug: string;
  name: string;
  desc: string;
  category: CategorySlug;
  /** true when the tool is a polished interface only (needs a backend/AI in reality) */
  simulated?: boolean;
}

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  desc: string;
  glow: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: "image-tools", name: "Image Tools", desc: "Edit, convert and optimize beautifully.", glow: "rgba(90,220,150,0.28)" },
  { slug: "pdf-tools", name: "PDF Tools", desc: "Everything you need for PDF documents.", glow: "rgba(255,120,80,0.30)" },
  { slug: "text-tools", name: "Text Tools", desc: "Clean, format and transform any text.", glow: "rgba(167,139,250,0.32)" },
  { slug: "calculators", name: "Calculators", desc: "Fast, precise everyday calculations.", glow: "rgba(220,180,90,0.28)" },
  { slug: "ai-tools", name: "AI Tools", desc: "Smart utilities for modern problems.", glow: "rgba(167,139,250,0.35)" },
  { slug: "developer-tools", name: "Developer Tools", desc: "Built for speed and precision.", glow: "rgba(90,150,255,0.30)" },
  { slug: "business-tools", name: "Business Tools", desc: "Documents and numbers, handled.", glow: "rgba(124,92,255,0.30)" },
];

const t = (
  category: CategorySlug,
  list: Array<[string, string, string] | [string, string, string, true]>,
): ToolMeta[] =>
  list.map(([slug, name, desc, simulated]) => ({
    slug,
    name,
    desc,
    category,
    simulated: simulated as true | undefined,
  }));

export const TOOLS: ToolMeta[] = [
  ...t("image-tools", [
    ["image-compressor", "Image Compressor", "Reduce image file size without losing visible quality."],
    ["image-resizer", "Image Resizer", "Resize images to exact pixel dimensions."],
    ["image-cropper", "Image Cropper", "Crop any image with precise control."],
    ["background-remover", "Background Remover", "Remove image backgrounds in one click.", true],
    ["image-converter", "Image Converter", "Convert between JPG, PNG and WebP."],
    ["jpg-to-png", "JPG ↔ PNG", "Swap between JPG and PNG instantly."],
    ["webp-converter", "WebP Converter", "Convert any image to modern WebP."],
    ["svg-converter", "SVG Converter", "Rasterize SVG files to PNG."],
    ["gif-maker", "GIF Maker", "Turn a set of frames into an animation.", true],
    ["image-upscaler", "Image Upscaler", "Enlarge images with AI detail recovery.", true],
    ["image-blur", "Image Blur", "Apply a smooth gaussian blur."],
    ["image-sharpen", "Image Sharpen", "Bring back crisp detail and contrast."],
    ["image-rotate", "Rotate Image", "Rotate images by any angle."],
    ["image-flip", "Flip Image", "Mirror images horizontally or vertically."],
    ["color-picker", "Color Picker", "Pick colors from an image or the wheel."],
    ["watermark-tool", "Watermark Tool", "Overlay text watermarks on your images."],
    ["image-to-base64", "Image to Base64", "Encode any image as a data URL."],
    ["base64-to-image", "Base64 to Image", "Decode a data URL back to an image."],
    ["qr-code-generator", "QR Code Generator", "Generate crisp QR codes for anything."],
    ["meme-generator", "Meme Generator", "Add top and bottom captions to an image."],
  ]),
  ...t("pdf-tools", [
    ["merge-pdf", "Merge PDF", "Combine multiple PDFs into one document."],
    ["split-pdf", "Split PDF", "Extract a page range into a new PDF."],
    ["compress-pdf", "Compress PDF", "Shrink PDF file size.", true],
    ["rotate-pdf", "Rotate PDF", "Rotate every page of a document."],
    ["delete-pages", "Delete Pages", "Remove selected pages from a PDF."],
    ["extract-images", "Extract Images", "Pull embedded images out of a PDF.", true],
    ["extract-text", "Extract Text", "Get the raw text from a PDF.", true],
    ["jpg-to-pdf", "JPG to PDF", "Turn images into a single PDF."],
    ["pdf-to-jpg", "PDF to JPG", "Export PDF pages as images.", true],
    ["word-to-pdf", "Word to PDF", "Convert DOCX documents to PDF.", true],
    ["pdf-viewer", "PDF Viewer", "Open and read PDFs in your browser."],
    ["sign-pdf", "Sign PDF", "Draw a signature and place it on a page."],
    ["protect-pdf", "Protect PDF", "Add a password to a document.", true],
    ["unlock-pdf", "Unlock PDF", "Remove a known password from a PDF.", true],
  ]),
  ...t("text-tools", [
    ["word-counter", "Word Counter", "Count words, sentences and reading time."],
    ["character-counter", "Character Counter", "Live character and byte counts."],
    ["case-converter", "Case Converter", "Convert between every text case."],
    ["lorem-ipsum-generator", "Lorem Ipsum Generator", "Generate placeholder paragraphs."],
    ["remove-duplicate-lines", "Remove Duplicate Lines", "Deduplicate any list instantly."],
    ["text-sorter", "Text Sorter", "Sort lines alphabetically or numerically."],
    ["text-reverser", "Text Reverser", "Reverse characters, words or lines."],
    ["whitespace-cleaner", "Whitespace Cleaner", "Trim and collapse messy spacing."],
    ["markdown-preview", "Markdown Preview", "Render markdown as you type."],
    ["json-formatter", "JSON Formatter", "Beautify and minify JSON."],
    ["json-validator", "JSON Validator", "Validate JSON with precise errors."],
    ["xml-formatter", "XML Formatter", "Pretty-print XML documents."],
    ["html-formatter", "HTML Formatter", "Indent and tidy HTML markup."],
    ["html-minifier", "HTML Minifier", "Strip whitespace and comments."],
    ["css-minifier", "CSS Minifier", "Compress stylesheets safely."],
    ["js-minifier", "JS Minifier", "Basic JavaScript minification."],
    ["csv-viewer", "CSV Viewer", "Preview CSV data as a clean table."],
    ["csv-to-json", "CSV to JSON", "Convert CSV rows into JSON objects."],
    ["json-to-csv", "JSON to CSV", "Flatten JSON arrays into CSV."],
    ["password-generator", "Password Generator", "Strong passwords, generated locally."],
    ["uuid-generator", "UUID Generator", "Create v4 UUIDs in bulk."],
    ["slug-generator", "Slug Generator", "Turn titles into clean URL slugs."],
    ["base64-encoder", "Base64 Encoder", "Encode text to Base64."],
    ["base64-decoder", "Base64 Decoder", "Decode Base64 back to text."],
    ["url-encoder", "URL Encoder", "Percent-encode URL components."],
    ["url-decoder", "URL Decoder", "Decode percent-encoded URLs."],
  ]),
  ...t("calculators", [
    ["age-calculator", "Age Calculator", "Exact age in years, months and days."],
    ["bmi-calculator", "BMI Calculator", "Body mass index with categories."],
    ["percentage-calculator", "Percentage Calculator", "Every common percentage case."],
    ["scientific-calculator", "Scientific Calculator", "Full expression calculator."],
    ["loan-calculator", "Loan Calculator", "Monthly payment and total interest."],
    ["emi-calculator", "EMI Calculator", "Equated monthly instalments."],
    ["gst-calculator", "GST Calculator", "Add or remove GST from an amount."],
    ["discount-calculator", "Discount Calculator", "Final price and money saved."],
    ["currency-converter", "Currency Converter", "Convert with indicative static rates."],
    ["date-difference", "Date Difference", "Days, weeks and months between dates."],
    ["timezone-converter", "Time Zone Converter", "Compare a time across zones."],
    ["unit-converter", "Unit Converter", "Length, weight, temperature and more."],
  ]),
  ...t("ai-tools", [
    ["ai-summarizer", "AI Summarizer", "Condense long text into key points.", true],
    ["grammar-checker", "Grammar Checker", "Catch grammar and clarity issues.", true],
    ["rewrite-text", "Rewrite Text", "Rephrase in a different tone.", true],
    ["email-writer", "Email Writer", "Draft professional emails fast.", true],
    ["caption-generator", "Caption Generator", "Social captions that convert.", true],
    ["hashtag-generator", "Hashtag Generator", "Relevant hashtag sets per topic.", true],
    ["blog-title-generator", "Blog Title Generator", "Headline ideas that get clicks.", true],
    ["prompt-generator", "Prompt Generator", "Build structured AI prompts.", true],
    ["product-description-generator", "Product Description Generator", "Store-ready product copy.", true],
    ["translator", "Translator", "Translate between languages.", true],
  ]),
  ...t("developer-tools", [
    ["color-converter", "Color Converter", "HEX, RGB and HSL in sync."],
    ["gradient-generator", "Gradient Generator", "Design CSS gradients visually."],
    ["border-radius-generator", "Border Radius Generator", "Craft complex corner radii."],
    ["css-shadow-generator", "CSS Shadow Generator", "Layered box-shadow builder."],
    ["flexbox-generator", "Flexbox Generator", "Preview and copy flex layouts."],
    ["grid-generator", "Grid Generator", "Build CSS grid templates."],
    ["meta-tag-generator", "Meta Tag Generator", "SEO and Open Graph tags."],
    ["robots-txt-generator", "Robots.txt Generator", "Crawler rules in seconds."],
    ["sitemap-generator", "Sitemap Generator", "XML sitemaps from a URL list."],
    ["jwt-decoder", "JWT Decoder", "Inspect JWT header and payload."],
    ["timestamp-converter", "Timestamp Converter", "Human dates from timestamps."],
    ["unix-time-converter", "Unix Time Converter", "Convert dates to Unix time."],
    ["hash-generator", "Hash Generator", "SHA-1, SHA-256 and SHA-512."],
    ["cron-generator", "Cron Generator", "Build and read cron expressions."],
  ]),
  ...t("business-tools", [
    ["invoice-generator", "Invoice Generator", "Clean invoices, ready to print."],
    ["receipt-generator", "Receipt Generator", "Simple receipts for any sale."],
    ["quotation-generator", "Quotation Generator", "Professional client quotes."],
    ["resume-builder", "Resume Builder", "A polished one-page resume."],
    ["business-card-maker", "Business Card Maker", "Design a card in the browser."],
    ["barcode-generator", "Barcode Generator", "CODE128 and EAN barcodes."],
    ["qr-generator", "QR Generator", "Business QR codes, instantly."],
    ["profit-calculator", "Profit Calculator", "Margin, markup and profit."],
    ["tax-calculator", "Tax Calculator", "Quick tax and net amounts."],
    ["business-gst-calculator", "GST Calculator", "GST inclusive and exclusive."],
  ]),
];

export const TOOLS_BY_SLUG: Record<string, ToolMeta> = Object.fromEntries(
  TOOLS.map((tool) => [tool.slug, tool]),
);

export const CATEGORY_BY_SLUG: Record<string, CategoryMeta> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

export const toolsInCategory = (slug: CategorySlug) => TOOLS.filter((x) => x.category === slug);

export function relatedTools(slug: string, count = 4): ToolMeta[] {
  const tool = TOOLS_BY_SLUG[slug];
  if (!tool) return TOOLS.slice(0, count);
  const siblings = toolsInCategory(tool.category).filter((x) => x.slug !== slug);
  const i = siblings.findIndex((x) => x.slug > slug);
  const start = i < 0 ? 0 : i;
  return [...siblings.slice(start), ...siblings.slice(0, start)].slice(0, count);
}
