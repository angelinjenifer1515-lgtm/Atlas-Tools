import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AtlasWordmark } from "./Logo";
import { ChevronDown } from "lucide-react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`glass relative flex w-full max-w-6xl items-center justify-between overflow-hidden rounded-full px-5 py-2.5 transition-all duration-500 ${
          scrolled ? "opacity-100" : "opacity-95 [--tw-shadow:none]"
        }`}
      >

        <AtlasWordmark />
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/tools">All Tools</NavLink>
          <NavLink to="/categories">
            Categories <ChevronDown className="ml-0.5 h-3 w-3 opacity-60" />
          </NavLink>
          <NavLink to="/tools">Resources</NavLink>
          <NavLink to="/categories">About</NavLink>
        </div>
        <Link
          to="/"
          hash="categories"
          className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[13px] text-white/85 transition hover:bg-white/[0.08] hover:text-white"
        >
          Explore
        </Link>
      </nav>
    </header>
  );
}

function NavLink({ children, to }: { children: React.ReactNode; to: "/tools" | "/categories" }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
    >
      {children}
    </Link>
  );
}
