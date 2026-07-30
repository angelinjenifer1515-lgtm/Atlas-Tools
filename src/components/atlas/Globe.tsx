import { useEffect, useRef } from "react";

/**
 * Wireframe globe made of glowing nodes + geodesic lat/lon arcs.
 * Rotates slowly, reacts subtly to pointer. Rim highlighted from top-right
 * to match the reference direction of light.
 */
export function Globe() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, cx = 0, cy = 0, R = 0;
    let raf = 0;
    let yaw = 0;
    const N = 1100;
    type P = { x: number; y: number; z: number };
    const pts: P[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const theta = golden * i;
      pts.push({ x: Math.cos(theta) * rad, y, z: Math.sin(theta) * rad });
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = w / 2;
      cy = h / 2;
      R = Math.min(w, h) * 0.44;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current.tx = (e.clientX - rect.left) / rect.width - 0.5;
      pointer.current.ty = (e.clientY - rect.top) / rect.height - 0.5;
    };
    window.addEventListener("pointermove", onMove);

    const rotate = (p: P, cosY: number, sinY: number, cosX: number, sinX: number) => {
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;
      return { x: x1, y: y2, z: z2 };
    };

    const lonRings: P[][] = [];
    for (let l = 0; l < 14; l++) {
      const ang = (l / 14) * Math.PI * 2;
      const ring: P[] = [];
      for (let i = 0; i <= 96; i++) {
        const t = (i / 96) * Math.PI - Math.PI / 2;
        ring.push({ x: Math.cos(t) * Math.cos(ang), y: Math.sin(t), z: Math.cos(t) * Math.sin(ang) });
      }
      lonRings.push(ring);
    }
    const latRings: P[][] = [];
    for (let l = 1; l < 9; l++) {
      const phi = (l / 9) * Math.PI - Math.PI / 2;
      const ring: P[] = [];
      const r = Math.cos(phi), y = Math.sin(phi);
      for (let i = 0; i <= 120; i++) {
        const t = (i / 120) * Math.PI * 2;
        ring.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r });
      }
      latRings.push(ring);
    }

    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(64, t - last) / 1000;
      last = t;

      pointer.current.x += (pointer.current.tx - pointer.current.x) * 0.05;
      pointer.current.y += (pointer.current.ty - pointer.current.y) * 0.05;

      yaw += (dt * (2 * Math.PI)) / 100;
      const tilt = -0.35 + pointer.current.y * 0.35;
      const yawOffset = pointer.current.x * 0.55;
      const cosY = Math.cos(yaw + yawOffset), sinY = Math.sin(yaw + yawOffset);
      const cosX = Math.cos(tilt), sinX = Math.sin(tilt);

      ctx.clearRect(0, 0, w, h);

      // halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.2, cx, cy, R * 1.5);
      halo.addColorStop(0, "rgba(124,92,240,0.14)");
      halo.addColorStop(0.5, "rgba(124,92,240,0.04)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2); ctx.fill();

      // top-right bright bloom
      const bloom = ctx.createRadialGradient(cx + R * 0.7, cy - R * 0.55, 0, cx + R * 0.7, cy - R * 0.55, R * 0.9);
      bloom.addColorStop(0, "rgba(255,255,255,0.35)");
      bloom.addColorStop(0.4, "rgba(196,181,253,0.15)");
      bloom.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = 1;
      const drawRing = (ring: P[], alpha: number) => {
        ctx.beginPath();
        let started = false;
        for (const p of ring) {
          const r = rotate(p, cosY, sinY, cosX, sinX);
          if (r.z < -0.05) { started = false; continue; }
          const px = cx + r.x * R;
          const py = cy + r.y * R;
          const a = Math.max(0, Math.min(1, (r.z + 0.5) * alpha));
          ctx.strokeStyle = `rgba(200,190,255,${a * 0.28})`;
          if (!started) { ctx.moveTo(px, py); started = true; } else ctx.lineTo(px, py);
        }
        ctx.stroke();
      };
      for (const ring of lonRings) drawRing(ring, 0.85);
      for (const ring of latRings) drawRing(ring, 0.6);

      // nodes
      for (const p of pts) {
        const r = rotate(p, cosY, sinY, cosX, sinX);
        if (r.z < -0.1) continue;
        const px = cx + r.x * R;
        const py = cy + r.y * R;
        const front = (r.z + 1) / 2;
        // Brighter on top-right (lit hemisphere)
        const lit = Math.max(0, r.x * 0.6 - r.y * 0.6);
        const size = 0.4 + front * 1.4 + lit * 0.6;
        const alpha = 0.15 + front * 0.7 + lit * 0.3;
        ctx.fillStyle = lit > 0.5
          ? `rgba(255,255,255,${Math.min(1, alpha)})`
          : `rgba(196,181,253,${Math.min(1, alpha * 0.9)})`;
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // rim + bright arc
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.10)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const arcGrad = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      arcGrad.addColorStop(0, "rgba(255,255,255,0)");
      arcGrad.addColorStop(0.5, "rgba(255,255,255,0.55)");
      arcGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.strokeStyle = arcGrad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, cy, R + 0.5, -Math.PI * 0.7, -Math.PI * 0.2);
      ctx.stroke();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />;
}
