import { GraduationCap, Palette, Code2, Briefcase } from "lucide-react";
import ring from "@/assets/ring.jpg";

const AUDIENCES = [
  { Icon: GraduationCap, title: "Students",   desc: "Study smarter and get things done faster." },
  { Icon: Palette,       title: "Creators",   desc: "Create, edit and ship your best work." },
  { Icon: Code2,         title: "Developers", desc: "Code, convert and debug with ease." },
  { Icon: Briefcase,     title: "Businesses", desc: "Streamline workflows and save hours." },
];

export function BuiltForImpact() {
  return (
    <section className="relative w-full overflow-hidden px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <div className="mb-5 text-[11px] uppercase tracking-[0.28em] text-white/45">
            Built for Impact
          </div>
          <h2 className="font-display mx-auto max-w-3xl text-balance text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
            Made for real productivity.<br />
            Built for <span className="text-gradient-violet-inline">everyone.</span>
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIENCES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="card-elev group relative overflow-hidden rounded-2xl p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.14]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                <Icon className="h-4 w-4 text-[color:var(--violet-soft)]" />
              </div>
              <h3 className="mt-4 font-display text-[16px] font-semibold text-white">{title}</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-white/55">{desc}</p>
            </div>
          ))}
        </div>

        {/* Ring + counter */}
        <div className="relative mt-20">
          <div className="relative mx-auto flex h-[280px] w-full max-w-4xl items-center justify-center sm:h-[360px]">
            <img
              src={ring}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain opacity-90"
            />
            <div className="pointer-events-none absolute inset-x-0 top-1/2 h-24 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(124,92,240,0.25),transparent_70%)]" />
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <span className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold tracking-tight text-white">
                <CountUp target={2314551} />
              </span>
              <div className="flex -space-x-2">
                {["#8b5cf6", "#c4b5fd", "#f0c674", "#4f8cff"].map((c, i) => (
                  <span
                    key={i}
                    className="h-7 w-7 rounded-full border border-black/60"
                    style={{ background: `radial-gradient(circle at 30% 30%, ${c}, #111 70%)` }}
                  />
                ))}
              </div>
            </div>
            <span className="text-[12px] tracking-wide text-white/50">Tasks completed today</span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState, useRef } from "react";
function CountUp({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [n, setN] = useState(0);
  const [start, setStart] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStart(true); }, { threshold: 0.4 });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!start) return;
    const dur = 1800; const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target]);
  return <span ref={ref}>{n.toLocaleString()}</span>;
}
