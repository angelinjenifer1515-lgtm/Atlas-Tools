import { ArrowRight } from "lucide-react";
import catAi from "@/assets/cat-ai.jpg";
import catPdf from "@/assets/cat-pdf.jpg";
import catImage from "@/assets/cat-image.jpg";
import catDev from "@/assets/cat-dev.jpg";
import catConvert from "@/assets/cat-convert.jpg";

type Cat = { title: string; count: string; desc: string; image: string; glow: string };

const CATS: Cat[] = [
  { title: "AI Tools",         count: "12 tools", desc: "Smart utilities for modern problems",   image: catAi,      glow: "rgba(167,139,250,0.35)" },
  { title: "PDF Tools",        count: "18 tools", desc: "All the tools you need for PDF files",  image: catPdf,     glow: "rgba(255,120,80,0.30)" },
  { title: "Image Tools",      count: "24 tools", desc: "Edit, convert, optimize beautifully",   image: catImage,   glow: "rgba(90,220,150,0.28)" },
  { title: "Developer Tools",  count: "15 tools", desc: "Built for speed and precision",         image: catDev,     glow: "rgba(90,150,255,0.30)" },
  { title: "Converters",       count: "22 tools", desc: "Convert anything to everything",        image: catConvert, glow: "rgba(220,180,90,0.28)" },
];

export function Categories() {
  return (
    <section id="categories" className="relative w-full px-6 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <span className="mb-5 text-[11px] uppercase tracking-[0.28em] text-white/45">
            Browse by Category
          </span>
          <h2 className="font-display max-w-3xl text-balance text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
            Every tool you need,<br />
            in one <span className="text-gradient-violet-inline">intelligent</span> place.
          </h2>
          <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-white/55">
            From everyday essentials to advanced utilities, everything is designed
            to save you time and help you focus on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CATS.map((c) => (
            <CategoryCard key={c.title} {...c} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[13px] text-white/80 transition hover:bg-white/[0.07] hover:text-white"
          >
            View all categories
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ title, count, desc, image, glow }: Cat) {
  return (
    <div
      className="card-elev group relative flex h-[340px] flex-col overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.14]"
      style={{
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 40px -20px rgba(0,0,0,0.6)`,
      }}
    >
      {/* corner count */}
      <div className="relative z-10 flex items-start justify-end">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">
          {count}
        </span>
      </div>

      {/* 3D icon */}
      <div className="relative flex flex-1 items-center justify-center">
        <div
          className="pointer-events-none absolute inset-x-4 top-1/2 h-32 -translate-y-1/2 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(closest-side, ${glow}, transparent 70%)`, opacity: 0.55 }}
        />
        <img
          src={image}
          alt=""
          width={512}
          height={512}
          loading="lazy"
          className="relative h-[160px] w-[160px] select-none object-contain transition-transform duration-700 group-hover:scale-[1.06]"
          style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))" }}
        />
      </div>

      <div className="relative">
        <h3 className="font-display text-[18px] font-semibold tracking-tight text-white">
          {title}
        </h3>
        <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">{desc}</p>
        <a
          href="#"
          className="mt-3 inline-flex items-center gap-1 text-[12px] text-white/70 transition hover:text-white"
        >
          Explore
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
}
