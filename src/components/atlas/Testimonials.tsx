import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Ricky K.",   text: "Atlas Tools is my daily go-to. So many tools, all so well designed.",       top: "48%", left: "12%" },
  { name: "Jessica M.", text: "Clean, fast and incredibly useful. Everything just works.",                 top: "16%", left: "27%" },
  { name: "Alex P.",    text: "Finally, a tools site that feels premium. Amazing experience!",             top: "6%",  left: "50%" },
  { name: "Daniel F.",  text: "I've tried them all. Atlas Tools is by far the best.",                      top: "16%", left: "73%" },
  { name: "Priya S.",   text: "Saves me hours every single week. Highly recommended.",                     top: "48%", left: "88%" },
];

export function Testimonials() {
  return (
    <section className="relative w-full overflow-hidden px-6 pt-24 pb-40">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="font-display mx-auto max-w-3xl text-balance text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
            Loved by <span className="text-gradient-violet-inline">millions</span><br />
            around the world.
          </h2>
        </div>

        {/* Curved arc + floating cards */}
        <div className="relative mx-auto mt-14 h-auto min-h-[520px] max-w-5xl">
          {/* dashed arc */}
          <svg viewBox="0 0 1000 500" className="absolute inset-x-0 top-8 mx-auto h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="arc-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="rgba(167,139,250,0)" />
                <stop offset="0.5" stopColor="rgba(167,139,250,0.4)" />
                <stop offset="1" stopColor="rgba(167,139,250,0)" />
              </linearGradient>
            </defs>
            <path
              d="M 40 380 Q 500 -40 960 380"
              stroke="url(#arc-grad)"
              strokeWidth="1"
              strokeDasharray="2 6"
              fill="none"
            />
          </svg>

          {/* nodes */}
          {[15, 40, 65, 88].map((p) => (
            <span
              key={p}
              className="absolute h-1.5 w-1.5 rounded-full bg-[color:var(--violet-soft)] shadow-[0_0_12px_rgba(196,181,253,0.9)]"
              style={{
                left: `${p}%`,
                top: `${25 + Math.abs(p - 50) * 0.4}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}

          {/* cards container with proper grid layout */}
          <div className="absolute inset-0 w-full h-full">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="glass anim-drift absolute w-[230px] rounded-2xl p-5 text-left shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)] transition-all duration-300 hover:shadow-[0_25px_50px_-15px_rgba(167,139,250,0.15)]"
                style={{ 
                  top: r.top, 
                  left: r.left, 
                  transform: "translate(-50%, -50%)",
                  minHeight: "160px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div className="mb-3 flex gap-0.5 text-[color:var(--violet-soft)]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-[13px] leading-relaxed text-white/85">{r.text}</p>
                </div>
                <p className="mt-3 text-[11px] font-medium text-white/60">{r.name}</p>
              </div>
            ))}
          </div>

          {/* horizon glow bottom */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40">
            <div className="absolute inset-x-1/4 bottom-0 h-24 rounded-t-[100%] bg-[radial-gradient(closest-side,rgba(124,92,240,0.35),transparent_70%)]" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </div>
        </div>
      </div>

      {/* Mobile fallback for small screens */}
      <style>{`
        @media (max-width: 768px) {
          .anim-drift {
            position: static !important;
            transform: none !important;
            margin: 12px auto;
          }
        }
      `}</style>
    </section>
  );
}
