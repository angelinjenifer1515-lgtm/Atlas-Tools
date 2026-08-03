import { useNavigate } from "@tanstack/react-router";
import { MagneticButton } from "./MagneticButton";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  const navigate = useNavigate();
  return (
    <section className="relative w-full overflow-hidden px-6 pb-32 pt-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-display text-balance text-[clamp(2rem,4.5vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
          Ready to save hours<br />
          every single day?
        </h2>
        <div className="mt-9 flex justify-center">
          <MagneticButton variant="primary" onClick={() => navigate({ to: "/tools" })}>
            Launch Atlas Tools <ArrowRight className="h-4 w-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
