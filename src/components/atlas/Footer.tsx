import { AtlasWordmark } from "./Logo";

const COLS = [
  { title: "Tools",    items: ["PDF", "Image", "Developer", "Text", "Finance", "AI"] },
  { title: "Platform", items: ["All Tools", "Categories", "Collections", "Changelog"] },
  { title: "Company",  items: ["About", "Manifesto", "Contact", "Press"] },
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
                  <li key={i}><a href="#" className="transition hover:text-white">{i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-[12px] text-white/40 md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} Atlas Tools. All utilities free forever.</span>
          <span className="font-mono">v1.0 · handcrafted</span>
        </div>
      </div>
    </footer>
  );
}
