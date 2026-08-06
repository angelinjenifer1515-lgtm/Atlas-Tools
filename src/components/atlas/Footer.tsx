import { Link } from "@tanstack/react-router";
import { AtlasWordmark } from "./Logo";

const LINKS = [
  { label: "Privacy", to: "/privacy" as const },
  { label: "Terms", to: "/terms" as const },
  { label: "Contact", to: "/contact" as const },
];

export function Footer() {
  return (
    <footer className="relative w-full px-6 pb-16 pt-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-7 text-center">
        <div className="divider-x max-w-xs opacity-70" aria-hidden="true" />

        <Link to="/" aria-label="Atlas Tools home" className="transition-opacity hover:opacity-80">
          <AtlasWordmark />
        </Link>

        <p className="text-[13px] leading-relaxed text-white/40">
          © {new Date().getFullYear()} Atlas Tools. All rights reserved.
        </p>

        <nav aria-label="Footer" className="flex items-center gap-3 text-[13px] text-white/55">
          {LINKS.map((l, i) => (
            <span key={l.label} className="flex items-center gap-3">
              {i > 0 ? <span aria-hidden="true" className="text-white/20">•</span> : null}
              <Link
                to={l.to}
                className="rounded transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--violet)]/40"
              >
                {l.label}
              </Link>
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
}
