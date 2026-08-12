import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const registryPath = path.join(__dirname, '..', 'src', 'lib', 'tools', 'registry.ts');
const outDir = path.join(__dirname, '..', 'public');
const outPath = path.join(outDir, 'sitemap.xml');

if (!fs.existsSync(registryPath)) {
  console.error('registry.ts not found at', registryPath);
  process.exit(1);
}

const src = fs.readFileSync(registryPath, 'utf8');

// Extract category slugs from objects like { slug: "image-tools", name: ... }
const categoryRegex = /{[^}]*slug:\s*["']([^"']+)["'][^}]*}/g;
const categories = new Set();
let m;
while ((m = categoryRegex.exec(src)) !== null) {
  categories.add(m[1]);
}

// Extract tool slugs from arrays like ["image-compressor", "Image Compressor", "..." ]
const toolRegex = /\[\s*["']([a-z0-9\-]+)["']\s*,\s*["'][^"']*["']\s*,\s*["'][\s\S]*?["'](?:\s*,\s*true)?\s*\]/gi;
const tools = new Set();
while ((m = toolRegex.exec(src)) !== null) {
  tools.add(m[1]);
}

// Required pages
const base = 'https://the-atlas-tools.vercel.app';
const urls = new Set();
urls.add(`${base}/`);
urls.add(`${base}/tools`);
urls.add(`${base}/categories`);

for (const c of categories) {
  urls.add(`${base}/categories/${c}`);
}
for (const t of tools) {
  urls.add(`${base}/tools/${t}`);
}

const urlEntries = Array.from(urls)
  .map((loc) => `  <url>\n    <loc>${loc}</loc>\n  </url>`)
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outPath, xml, 'utf8');
console.log('Wrote sitemap to', outPath);
