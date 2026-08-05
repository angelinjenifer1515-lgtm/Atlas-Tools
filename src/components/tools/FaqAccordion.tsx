import { useId, useState } from "react";
import { Plus } from "lucide-react";

export interface Faq {
  q: string;
  a: string;
}

/**
 * Stable, non-jumping accordion.
 * Height animates via grid-template-rows (0fr → 1fr) so nothing below shifts abruptly,
 * and every row keeps a constant outer rhythm whether open or closed.
 */
export function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <div className="space-y-2.5">
      {items.map((f, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        const btnId = `${base}-btn-${i}`;
        return (
          <div key={f.q} className="card-elev overflow-hidden rounded-2xl">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[13.5px] font-medium text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--violet)]/40"
              >
                <span>{f.q}</span>
                <Plus
                  aria-hidden="true"
                  className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen ? "rotate-45 text-[color:var(--violet-soft)]" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="grid transition-[grid-template-rows,opacity] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr", opacity: isOpen ? 1 : 0 }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-[13px] leading-relaxed text-white/55">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
