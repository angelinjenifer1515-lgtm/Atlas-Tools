import { useEffect } from "react";

const FLOAT_SELECTORS = [
  ".anim-drift",
  ".floatable",
  ".glass",
  ".card",
  ".card-elev",
  ".tool-card",
  ".feature-card",
  ".category-card",
  ".testimonial-card",
  ".option-box",
  '[role="card"]',
].join(",");

const PATHS = ["float-3d-a", "float-3d-b", "float-3d-c", "float-3d-d", "float-3d-e"];

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
const px = (n: number) => `${Math.round(n * 10) / 10}px`;
const deg = (n: number) => `${Math.round(n * 100) / 100}deg`;
const s = (n: number) => `${Math.round(n * 10) / 10}s`;

export function useAssignFloating() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(FLOAT_SELECTORS));
    els.forEach((el, i) => {
      if (el.dataset.floatingAssigned) return;

      // depth plane: 0 = far (moves less), 1 = near (moves more)
      const depth = rand(0.35, 1);

      el.style.setProperty("--float-path", PATHS[Math.floor(Math.random() * PATHS.length)]);
      el.style.setProperty("--float-duration", s(rand(13, 24) / depth ** 0.25));
      el.style.setProperty("--float-delay", s(-rand(0, 18)));
      el.style.setProperty("--fx", px(rand(1.5, 4) * depth));
      el.style.setProperty("--fy", px(rand(2.5, 6) * depth));
      el.style.setProperty("--fz", px(rand(4, 14) * depth));
      el.style.setProperty("--rx", deg(rand(0.15, 0.6) * depth));
      el.style.setProperty("--ry", deg(rand(0.2, 0.8) * depth));

      if (!el.classList.contains("anim-drift") && !el.classList.contains("floatable")) {
        el.classList.add("floatable");
      }
      el.dataset.floatingAssigned = String(i + 1);
    });
  }, []);
}
