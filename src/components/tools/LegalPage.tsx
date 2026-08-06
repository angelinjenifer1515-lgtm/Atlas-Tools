export function LegalPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: Array<{ h: string; p: string }>;
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24">
      <header className="py-10 sm:py-14">
        <h1 className="font-display text-balance text-[clamp(2.1rem,5vw,3.2rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-white">
          {title}
        </h1>
        <p className="mt-4 text-[14.5px] leading-relaxed text-white/55">{intro}</p>
      </header>
      <div className="space-y-3">
        {sections.map((s) => (
          <section key={s.h} className="card-elev rounded-2xl p-6">
            <h2 className="font-display text-[15px] font-semibold tracking-tight text-white">
              {s.h}
            </h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{s.p}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
