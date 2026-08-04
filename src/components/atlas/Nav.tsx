import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AtlasWordmark } from "./Logo";

const LINKS = [
  { to: "/tools", label: "All Tools" },
  { to: "/categories", label: "Categories" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-6 pt-5 sm:px-10">
      <nav
        aria-label="Main"
        className="flex w-full max-w-6xl items-center justify-between rounded-[18px] border border-white/[0.08] px-6 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          height: scrolled ? 54 : 62,
          backdropFilter: `blur(${scrolled ? 30 : 24}px) saturate(160%)`,
          WebkitBackdropFilter: `blur(${scrolled ? 30 : 24}px) saturate(160%)`,
          background: `rgba(255,255,255,${scrolled ? 0.075 : 0.05})`,
          boxShadow: scrolled
            ? "0 18px 50px -28px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.09)"
            : "0 12px 40px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <Link to="/" aria-label="Atlas Tools home" className="shrink-0">
          <AtlasWordmark />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <Link
          to="/tools"
          className="group relative overflow-hidden rounded-[12px] border border-white/[0.12] px-4 py-2 text-[13px] font-medium text-white/90 transition-all duration-300 hover:border-white/25 hover:text-white"
          style={{
            background: "rgba(124,92,255,0.14)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 26px -14px rgba(124,92,255,0.9)",
          }}
        >
          Explore Tools
        </Link>
      </nav>
    </header>
  );
}

function NavLink({ children, to }: { children: React.ReactNode; to: "/tools" | "/categories" }) {
  return (
    <Link
      to={to}
      activeProps={{ className: "text-white" }}
      className="group relative py-1 text-[13.5px] font-medium text-white/65 transition-colors duration-300 hover:text-white"
    >
      {children}
      <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-gradient-to-r from-transparent via-[#8E7BFF] to-transparent transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:origin-left group-hover:scale-x-100 group-data-[status=active]:scale-x-100" />
    </Link>
  );
}
