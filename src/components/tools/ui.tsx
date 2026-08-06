import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Check, Copy, Download, RotateCcw, UploadCloud } from "lucide-react";

/* ---------------------------------- hooks ---------------------------------- */

/** True only after hydration — use to gate random/time-dependent output. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/* ---------------------------------- panels --------------------------------- */

export function Panel({
  title,
  hint,
  children,
  className = "",
}: {
  title?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`card-elev rounded-2xl p-5 sm:p-6 ${className}`}>
      {title ? (
        <header className="mb-4">
          <h2 className="font-display text-[15px] font-semibold tracking-tight text-white">
            {title}
          </h2>
          {hint ? <p className="mt-1 text-[12px] leading-relaxed text-white/50">{hint}</p> : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

export function Grid({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`grid gap-4 lg:grid-cols-2 ${className}`}>{children}</div>;
}

/* --------------------------------- controls -------------------------------- */

const inputBase =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-white placeholder:text-white/30 outline-none transition focus-visible:border-[color:var(--violet)]/60 focus-visible:ring-2 focus-visible:ring-[color:var(--violet)]/25";

export function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`${inputBase} ${className}`} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`${inputBase} min-h-[180px] resize-y font-mono leading-relaxed ${className}`}
    />
  );
}

export function Select({
  options,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: Array<{ value: string; label: string }>;
}) {
  const { className = "", ...props } = rest;
  return (
    <select {...props} className={`${inputBase} appearance-none ${className}`}>
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-[#0b0a14] text-white">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Range({
  label,
  value,
  suffix = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/45">
        <span>{label}</span>
        <span className="font-mono text-white/70">
          {value}
          {suffix}
        </span>
      </div>
      <input
        {...rest}
        type="range"
        value={value}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[color:var(--violet)] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--violet)]/30"
      />
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-white/80 transition hover:border-white/20 focus-visible:ring-2 focus-visible:ring-[color:var(--violet)]/30"
    >
      <span>{label}</span>
      <span
        className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-[color:var(--violet)]" : "bg-white/15"}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${checked ? "left-[18px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

/* --------------------------------- buttons --------------------------------- */

export function Btn({
  children,
  variant = "ghost",
  className = "",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" }) {
  const styles =
    variant === "primary"
      ? "bg-white text-black hover:opacity-90 shadow-[0_10px_40px_-14px_rgba(255,255,255,0.4)]"
      : "glass text-white/85 hover:text-white";
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium tracking-tight transition disabled:cursor-not-allowed disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-[color:var(--violet)]/40 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [done, setDone] = useState(false);
  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* clipboard unavailable */
    }
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  }, [value]);
  return (
    <Btn onClick={copy} disabled={!value}>
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "Copied" : label}
    </Btn>
  );
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function DownloadButton({
  data,
  filename,
  mime = "text/plain",
  label = "Download",
  disabled,
}: {
  data: string | Blob | null;
  filename: string;
  mime?: string;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <Btn
      variant="primary"
      disabled={disabled || !data}
      onClick={() => {
        if (!data) return;
        downloadBlob(typeof data === "string" ? new Blob([data], { type: mime }) : data, filename);
      }}
    >
      <Download className="h-3.5 w-3.5" /> {label}
    </Btn>
  );
}

export function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <Btn onClick={onClick}>
      <RotateCcw className="h-3.5 w-3.5" /> Reset
    </Btn>
  );
}

export function Toolbar({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex flex-wrap items-center gap-2.5">{children}</div>;
}

/* --------------------------------- uploads --------------------------------- */

export function UploadArea({
  accept,
  multiple,
  onFiles,
  hint = "Drop a file here, or click to browse",
  files,
}: {
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  hint?: string;
  files?: File[];
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [over, setOver] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          onFiles(Array.from(e.dataTransfer.files));
        }}
        className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed px-6 py-10 text-center transition focus-visible:ring-2 focus-visible:ring-[color:var(--violet)]/40 ${
          over
            ? "border-[color:var(--violet)]/70 bg-[color:var(--violet)]/10"
            : "border-white/12 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
        }`}
      >
        <UploadCloud className="h-5 w-5 text-[color:var(--violet-soft)]" />
        <span className="text-[13px] text-white/75">{hint}</span>
        <span className="text-[11px] text-white/35">Files never leave your device</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => onFiles(Array.from(e.target.files ?? []))}
      />
      {files && files.length > 0 ? (
        <ul className="mt-3 space-y-1.5 text-[12px] text-white/60">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-1.5"
            >
              <span className="truncate">{f.name}</span>
              <span className="shrink-0 font-mono text-white/40">{formatBytes(f.size)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

/* ---------------------------------- output --------------------------------- */

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</div>
      <div className="mt-1 font-display text-[20px] font-semibold tracking-tight text-white">
        {value}
      </div>
    </div>
  );
}

export function Output({ value, mono = true }: { value: string; mono?: boolean }) {
  return (
    <pre
      className={`max-h-[380px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/[0.07] bg-black/30 p-4 text-[12.5px] leading-relaxed text-white/80 ${
        mono ? "font-mono" : ""
      }`}
    >
      {value || "—"}
    </pre>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 rounded-xl border border-[color:var(--violet)]/20 bg-[color:var(--violet)]/[0.07] px-3.5 py-2.5 text-[12px] leading-relaxed text-white/65">
      {children}
    </p>
  );
}
