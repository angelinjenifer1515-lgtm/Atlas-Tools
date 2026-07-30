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

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function useAssignFloating() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>(FLOAT_SELECTORS));
    els.forEach((el) => {
      if (el.dataset.floatingAssigned) return;
      const amp = `${(Math.round(rand(2,5) * 10) / 10).toString()}px`;
      const dur = `${(Math.round(rand(6,10) * 10) / 10).toString()}s`;
      const delay = `${(Math.round(rand(0,5) * 10) / 10).toString()}s`;
      el.style.setProperty("--float-amp", amp);
      el.style.setProperty("--float-duration", dur);
      el.style.setProperty("--float-delay", delay);
      if (!el.classList.contains("anim-drift") && !el.classList.contains("floatable")) {
        el.classList.add("floatable");
      }
      el.dataset.floatingAssigned = "1";
    });
  }, []);
}
