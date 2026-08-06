import { useEffect, useState } from "react";
import {
  FileText,
  Sparkles,
  Image as ImageIcon,
  Video,
  Type,
  Code2,
  DollarSign,
  Palette,
  Search,
  Database,
  ArrowLeftRight,
} from "lucide-react";

const LABELS: {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  top: string;
  left: string;
}[] = [
  { label: "AI", Icon: Sparkles, top: "18%", left: "8%" },
  { label: "PDF", Icon: FileText, top: "10%", left: "62%" },
  { label: "Image", Icon: ImageIcon, top: "34%", left: "82%" },
  { label: "Video", Icon: Video, top: "58%", left: "78%" },
  { label: "Text", Icon: Type, top: "62%", left: "38%" },
  { label: "SEO", Icon: Search, top: "46%", left: "88%" },
  { label: "Color", Icon: Palette, top: "78%", left: "60%" },
  { label: "Finance", Icon: DollarSign, top: "74%", left: "26%" },
  { label: "Database", Icon: Database, top: "38%", left: "4%" },
  { label: "Converters", Icon: ArrowLeftRight, top: "56%", left: "8%" },
  { label: "Developer", Icon: Code2, top: "88%", left: "44%" },
];

export function OrbitLabels() {
  const [visible, setVisible] = useState<boolean[]>(() => LABELS.map(() => true));

  useEffect(() => {
    const timers: number[] = [];
    LABELS.forEach((_, i) => {
      const cycle = () => {
        setVisible((v) => {
          const n = [...v];
          n[i] = false;
          return n;
        });
        timers.push(
          window.setTimeout(() => {
            setVisible((v) => {
              const n = [...v];
              n[i] = true;
              return n;
            });
          }, 1800),
        );
        timers.push(window.setTimeout(cycle, 9000 + (i % 5) * 700));
      };
      timers.push(window.setTimeout(cycle, 5000 + i * 500));
    });
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      {LABELS.map(({ label, Icon, top, left }, i) => (
        <div
          key={label}
          className="absolute"
          style={{
            top,
            left,
            transform: "translate(-50%, -50%)",
            transition: "opacity 900ms ease, transform 900ms ease",
            opacity: visible[i] ? 1 : 0,
          }}
        >
          <div className="anim-drift" style={{ animationDelay: `${i * 0.4}s` }}>
            <div className="glass inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-tight text-white/90 shadow-[0_10px_40px_-14px_rgba(124,92,240,0.5)]">
              <Icon className="h-3 w-3 text-[color:var(--violet-soft)]" />
              {label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
