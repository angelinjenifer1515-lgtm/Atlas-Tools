import { ArrowRight, ImageIcon, FileText, Scissors, Sparkles } from "lucide-react";

export function PowerfulTools() {
  return (
    <section className="relative w-full px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="font-display text-balance text-[clamp(2rem,4.5vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-white">
            Powerful tools.<br />
            <span className="text-white/60">Beautifully <span className="text-gradient-violet-inline">simple.</span></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ToolCard
            Icon={ImageIcon}
            title="Image Compressor"
            desc="Reduce image size without losing quality"
            action="Compress"
            preview={
              <div className="relative h-full w-full overflow-hidden rounded-lg bg-[radial-gradient(circle_at_30%_30%,#a78bfa55,transparent_60%),radial-gradient(circle_at_70%_70%,#4f8cff33,transparent_55%),#0a0a0a]">
                <div className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-white/[0.04] shadow-[0_10px_30px_rgba(167,139,250,0.35)]" />
              </div>
            }
          />
          <ToolCard
            Icon={FileText}
            title="PDF Merger"
            desc="Merge multiple PDFs into one file"
            action="Merge PDF"
            preview={
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg bg-[#0a0a0a]">
                <div className="absolute h-24 w-16 -translate-x-3 rotate-[-8deg] rounded-md border border-white/10 bg-[#181820]" />
                <div className="absolute h-24 w-16 translate-x-3 rotate-[8deg] rounded-md border border-white/10 bg-[#20161a]" />
              </div>
            }
          />
          <ToolCard
            Icon={Scissors}
            title="Background Remover"
            desc="Remove background in one click"
            action="Remove"
            preview={
              <div
                className="h-full w-full rounded-lg"
                style={{
                  backgroundImage:
                    "conic-gradient(from 45deg at 25% 25%, #1a1a1e 0 25%, #131316 0 50%, #1a1a1e 0 75%, #131316 0)",
                  backgroundSize: "20px 20px",
                }}
              />
            }
          />
          <ToolCard
            Icon={Sparkles}
            title="AI Writer"
            desc="Write better, faster with AI"
            action="Generate"
            preview={
              <div className="h-full w-full space-y-1.5 rounded-lg bg-[#0a0a0a] p-3">
                <div className="h-1.5 w-full rounded bg-white/10" />
                <div className="h-1.5 w-11/12 rounded bg-white/10" />
                <div className="h-1.5 w-9/12 rounded bg-white/10" />
                <div className="h-1.5 w-10/12 rounded bg-[color:var(--violet)]/60" />
                <div className="h-1.5 w-7/12 rounded bg-white/10" />
              </div>
            }
          />
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="#"
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 text-[13px] text-white/80 transition hover:bg-white/[0.07] hover:text-white"
          >
            View all tools
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

function ToolCard({
  Icon, title, desc, action, preview,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  title: string; desc: string; action: string; preview: React.ReactNode;
}) {
  return (
    <div className="card-elev group relative flex h-[300px] flex-col overflow-hidden rounded-2xl p-4 transition-all duration-500 hover:-translate-y-0.5 hover:border-white/[0.14]">
      <div className="h-[120px] w-full overflow-hidden rounded-lg border border-white/[0.05]">
        {preview}
      </div>
      <div className="mt-4 flex items-start gap-2">
        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--violet-soft)]" />
        <div className="min-w-0">
          <h3 className="font-display text-[15px] font-semibold text-white">{title}</h3>
          <p className="mt-0.5 text-[12px] leading-relaxed text-white/55">{desc}</p>
        </div>
      </div>
      <button className="mt-auto self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-white/80 transition hover:bg-[color:var(--violet)]/20 hover:text-white">
        {action}
      </button>
    </div>
  );
}
