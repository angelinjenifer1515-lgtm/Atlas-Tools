import { Link } from "@tanstack/react-router";
import { AtlasWordmark } from "./Logo";
import type { CategorySlug } from "@/lib/tools/registry";

type Item = { label: string; category?: CategorySlug; to?: "/tools" | "/categories" | "/" };

const COLS: Array<{ title: string; items: Item[] }> = [
  {
    title: "Tools",
    items: [
      { label: "PDF", category: "pdf-tools" },
      { label: "Image", category: "image-tools" },
      { label: "Developer", category: "developer-tools" },
      { label: "Text", category: "text-tools" },
      { label: "Finance", category: "calculators" },
      { label: "AI", category: "ai-tools" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "All Tools", to: "/tools" },
      { label: "Categories", to: "/categories" },
      { label: "Collections", to: "/categories" },
      { label: "Changelog", to: "/tools" },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", to: "/" },
      { label: "Manifesto", to: "/" },
      { label: "Contact", to: "/" },
      { label: "Press", to: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative w-full border-t border-white/[0.06] px-6 pb-10 pt-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 max-w-sm">
            <AtlasWordmark />
            <p className="mt-4 text-[13px] leading-relaxed text-white/50">
              The definitive home for online tools. Crafted with restraint, given away freely.
            </p>
          </div>
          {COLS.map((c) => (
            <div key={c.title}>
              <div className="mb-4 text-[11px] uppercase tracking-[0.22em] text-white/40">{c.title}</div>
              <ul className="space-y-2.5 text-[13px] text-white/70">
                {c.items.map((i) => (
                  <li key={i.label}>
                    {i.category ? (
                      <Link
                        to="/categories/$categorySlug"
                        params={{ categorySlug: i.category }}
                        className="transition hover:text-white"
                      >
                        {i.label}
                      </Link>
                    ) : (
                      <Link to={i.to ?? "/"} className="transition hover:text-white">
                        {i.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-white/40 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Atlas Tools. All utilities free forever.</span>
          <span className="font-mono">v1.0 · handcrafted</span>
        </div>
        <p className="pt-10 text-center text-[13px] leading-relaxed text-white/35">
          © 2026 Atlas Tools. Crafted by{" "}
          <span className="bg-gradient-to-r from-[#B9AFFF] via-[#C9C2FF] to-[#9FB6FF] bg-clip-text font-medium text-transparent opacity-80 transition-opacity duration-300 hover:opacity-100">
            Angelin Jenifer
          </span>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}
