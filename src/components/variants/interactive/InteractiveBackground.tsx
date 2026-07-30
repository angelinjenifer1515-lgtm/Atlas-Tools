import React from "react";
import "@/styles/interactive.css";

export function InteractiveBackground() {
  return (
    <div aria-hidden className="interactive-bg pointer-events-none fixed inset-0 -z-50">
      <div className="bg-layer layer-1" />
      <div className="bg-layer layer-2" />
      <div className="bg-layer layer-3" />
      <div className="bg-layer layer-4" />
    </div>
  );
}
