import React from "react";
import "@/styles/interactive.css";
import "@/styles/interactive.extend.css";

export function InteractiveBackground() {
  return (
    <div aria-hidden className="interactive-bg pointer-events-none fixed inset-0 -z-50">
      <div className="bg-layer layer-1" />
      <div className="bg-layer layer-2" />
      <div className="bg-layer layer-3" />
      <div className="bg-layer layer-4" />
      <div className="bg-layer layer-5" />
      {/* feathered ambient light patches */}
      <div
        className="ambient-glow"
        style={{
          top: "18%",
          left: "-8%",
          width: "42vw",
          height: "42vw",
          background: "radial-gradient(closest-side, rgba(124,92,255,0.16), transparent 70%)",
        }}
      />
      <div
        className="ambient-glow"
        style={{
          top: "52%",
          right: "-10%",
          width: "46vw",
          height: "46vw",
          background: "radial-gradient(closest-side, rgba(79,140,255,0.13), transparent 70%)",
        }}
      />
      <div
        className="ambient-glow"
        style={{
          bottom: "-12%",
          left: "28%",
          width: "50vw",
          height: "38vw",
          background: "radial-gradient(closest-side, rgba(26,20,70,0.28), transparent 72%)",
        }}
      />
    </div>
  );
}
