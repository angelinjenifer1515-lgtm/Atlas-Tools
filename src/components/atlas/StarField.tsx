import { useEffect, useRef } from "react";

/**
 * Cinematic starfield + drifting particles.
 * GPU-friendly single canvas, DPR aware, pauses when offscreen.
 */
export function StarField({ density = 1 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    let raf = 0;
    let stars: { x: number; y: number; z: number; r: number; tw: number; p: number }[] = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((w * h) / 6000 * density);
      stars = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: Math.random() * 1.2 + 0.2,
        tw: 0.4 + Math.random() * 0.6,
        p: Math.random() * Math.PI * 2,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last) / 1000;
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.p += dt * s.tw;
        s.y += dt * (6 + s.z * 12);
        if (s.y > h + 2) { s.y = -2; s.x = Math.random() * w; }
        const a = 0.35 + Math.sin(s.p) * 0.35 + s.z * 0.3;
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.6 + s.z * 0.8), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
