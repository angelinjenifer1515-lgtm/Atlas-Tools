export function AtlasMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="atlas-violet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c4b5fd" />
          <stop offset="1" stopColor="#7c5cf0" />
        </linearGradient>
      </defs>
      <path d="M20 3 L34 34 L20 27 L6 34 Z" fill="url(#atlas-violet)" />
      <path d="M20 18 L22.5 24 L20 22.5 L17.5 24 Z" fill="#050505" />
    </svg>
  );
}

export function AtlasWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <AtlasMark className="h-[22px] w-[22px]" />
      <span className="font-display text-[15px] font-semibold tracking-tight text-white">
        Atlas<span className="font-medium text-white/70">Tools</span>
      </span>
    </div>
  );
}
