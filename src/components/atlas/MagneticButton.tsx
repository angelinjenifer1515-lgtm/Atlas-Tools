import { useRef, type ButtonHTMLAttributes, type ReactNode } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export function MagneticButton({ variant = "primary", children, className = "", ...rest }: Props) {
  const ref = useRef<HTMLButtonElement | null>(null);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
  };
  const onLeave = () => {
    const el = ref.current; if (!el) return;
    el.style.transform = "translate(0,0)";
  };

  const base =
    "btn-magnetic relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium tracking-tight will-change-transform select-none";

  const styles = variant === "primary"
    ? "bg-white text-black shadow-[0_10px_40px_-12px_rgba(255,255,255,0.35)] hover:bg-white"
    : "text-white/85 hover:text-white border border-white/10 bg-white/[0.03] hover:bg-white/[0.06]";

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`${base} ${styles} ${className}`}
      {...rest}
    >
      {variant === "primary" && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="shine absolute inset-y-0 -inset-x-1/4 opacity-40" />
        </span>
      )}
      <span className="relative flex items-center gap-2">{children}</span>
    </button>
  );
}
