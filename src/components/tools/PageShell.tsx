import type { ReactNode } from "react";
import { Nav } from "@/components/atlas/Nav";
import { Footer } from "@/components/atlas/Footer";
import { InteractiveBackground } from "@/components/atlas/InteractiveBackground";
import { useAssignFloating } from "@/hooks/useAssignFloating";

export function PageShell({ children }: { children: ReactNode }) {
  useAssignFloating();
  return (
    <main className="relative min-h-screen w-full overflow-x-clip bg-transparent text-white [perspective:1600px]">
      <InteractiveBackground />
      <Nav />
      <div className="relative pt-28">{children}</div>
      <Footer />
    </main>
  );
}
