import { Star } from "lucide-react";

const REVIEWS = [
  { text: "Everything I need, all in one place." },
  { text: "Fast, beautiful, and ridiculously useful." },
  { text: "Finally, a tools website that feels premium." },
  { text: "Exactly what modern utilities should look like." },
];

export function Testimonials() {
  return (
    <section className="relative w-full overflow-hidden px-6 pt-24 pb-32">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display mx-auto max-w-3xl text-balance text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
            Loved by <span className="text-gradient-violet-inline">millions</span><br />
            around the world.
          </h2>
        </div>

        {/* Straight, centered, equally spaced row of independently floating cards */}
        <div className="relative mt-16 [perspective:1400px]">
          <div className="flex flex-wrap items-stretch justify-center gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="float-hover anim-drift w-[240px] max-w-full">
                <div className="glass flex h-full min-h-[160px] w-full flex-col justify-between rounded-2xl p-5 text-left">
                  <div>
                    <div className="mb-3 flex gap-0.5 text-[color:var(--violet-soft)]">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-[13px] leading-relaxed text-white/85">{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* horizon glow */}
          <div className="pointer-events-none absolute inset-x-0 -bottom-24 h-40">
            <div className="absolute inset-x-1/4 bottom-0 h-24 rounded-t-[100%] bg-[radial-gradient(closest-side,rgba(124,92,240,0.28),transparent_70%)]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
