import { Brain, Braces, Briefcase, Calculator, FileText, ImageIcon, Type } from "lucide-react";
import type { CategorySlug } from "@/lib/tools/registry";

const ICONS: Record<CategorySlug, typeof Brain> = {
  "image-tools": ImageIcon,
  "pdf-tools": FileText,
  "text-tools": Type,
  calculators: Calculator,
  "ai-tools": Brain,
  "developer-tools": Braces,
  "business-tools": Briefcase,
};

/**
 * Luminous, background-free category glyph.
 * Soft violet/electric-blue bloom, very slow shimmer, no card or plate behind it.
 */
export function CategoryIcon({
  slug,
  size = 64,
  className = "",
}: {
  slug: CategorySlug;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[slug] ?? Brain;
  return (
    <span
      aria-hidden="true"
      className={`glow-icon relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="glow-icon__bloom" />
      <Icon
        className="glow-icon__glyph relative"
        size={size}
        strokeWidth={1.25}
        absoluteStrokeWidth
      />
    </span>
  );
}
