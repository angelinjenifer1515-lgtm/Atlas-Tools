import { StarField } from "@/components/atlas/StarField";
import { Globe } from "@/components/atlas/Globe";
import { OrbitLabels } from "@/components/atlas/OrbitLabels";
import { MagneticButton } from "@/components/atlas/MagneticButton";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative isolate w-full overflow-hidden bg-transparent pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="pointer-events-none absolute inset-0 radial-vignette" />
      <div className="mask-fade-b absolute inset-0">
        <StarField density={1.0} />
      </div>
      <div className="pointer-events-none absolute inset-0 grain mask-fade-b" />


      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Left: copy */}
        <div className="relative z-10 max-w-xl">
          <div className="glass mb-7 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] tracking-wide text-white/75">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[color:var(--violet)]" />
            <span>100+ Premium Tools. One Beautiful Experience.</span>
          </div>

          <h1 className="font-display text-balance text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.95] tracking-[-0.045em]">
            <span className="block text-white">Every Digital Tool.</span>
            <span className="block text-gradient-violet">Under One Roof.</span>
          </h1>

          <p className="mt-7 max-w-[700px] text-[15px] leading-relaxed tracking-wide text-white/55 font-normal">
            Hundreds of beautifully crafted online utilities. Completely free, no sign-ups, no downloads, everything runs instantly in your browser.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton variant="primary">
              Explore Tools <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>

        {/* Right: globe stage */}
        <div className="relative h-[420px] w-full sm:h-[520px] md:h-[600px] lg:h-[680px]">
          <div className="absolute inset-0">
            <Globe />
            <OrbitLabels />
          </div>
        </div>
      </div>

      {/* Trust bar + stats */}
      <div className="relative mx-auto mt-16 max-w-6xl px-6 md:mt-24">
        <p className="text-center text-[12px] tracking-wide text-white/45">
          Trusted by millions of creators, students, developers &amp; businesses worldwide.
        </p>
        <StatsRow />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#050505]" />
    </section>
  );
}

function StatsRow() {
  const stats = [
    { value: "2.4M+",  label: "Users Worldwide" },
    { value: "12.7M+", label: "Tasks Completed Today" },
    { value: "100+",   label: "Powerful Tools" },
    { value: "99.98%", label: "Uptime Guaranteed" },
  ];
  return (
    <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/[0.06] pt-8 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex items-start gap-3">
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[color:var(--violet)] shadow-[0_0_16px_rgba(167,139,250,0.7)]" />
          <div className="min-w-0">
            <div className="font-display text-[22px] font-semibold tracking-tight text-white">{s.value}</div>
            <div className="text-[12px] text-white/50">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
