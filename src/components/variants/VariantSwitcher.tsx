import { Link } from "@tanstack/react-router";

const LINKS = [
  { to: "/", label: "main" },
  { to: "/v/interactive", label: "interactive-ui" },
  { to: "/v/testimonials", label: "testimonials-fix" },
] as const;

export function VariantSwitcher() {
  return (
    <div className="fixed bottom-4 left-1/2 z-[100] -translate-x-1/2 rounded-full border border-white/10 bg-black/70 px-2 py-1.5 backdrop-blur-md">
      <div className="flex items-center gap-1">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: true }}
            className="rounded-full px-3 py-1 text-[11px] text-white/60 transition hover:text-white [&.active]:bg-white/10 [&.active]:text-white"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
