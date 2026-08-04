import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Btn,
  CopyButton,
  DownloadButton,
  Field,
  Grid,
  Note,
  Output,
  Panel,
  Range,
  Select,
  TextArea,
  TextInput,
  Toolbar,
  UploadArea,
  downloadBlob,
  formatBytes,
} from "../ui";
import type { ToolComponent } from "@/lib/tools/loader";

function useImage() {
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (!file) return setImg(null);
    const url = URL.createObjectURL(file);
    const el = new Image();
    el.onload = () => setImg(el);
    el.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return { file, setFile, img };
}

/** Generic canvas image tool: draws source through a transform and outputs a blob. */
function CanvasTool({
  settings,
  draw,
  type = "image/png",
  quality = 0.9,
  filename = "atlas-image",
  deps = [] as unknown[],
}: {
  settings?: React.ReactNode;
  draw: (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => void;
  type?: string;
  quality?: number;
  filename?: string;
  deps?: unknown[];
}) {
  const { file, setFile, img } = useImage();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [out, setOut] = useState<{ url: string; size: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    draw(ctx, img, canvas);
    canvas.toBlob(
      (b) => {
        if (!b) return;
        setOut((prev) => {
          if (prev) URL.revokeObjectURL(prev.url);
          return { url: URL.createObjectURL(b), size: b.size };
        });
      },
      type,
      quality,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, type, quality, ...deps]);

  const ext = type.split("/")[1].replace("jpeg", "jpg");

  return (
    <>
      <Panel title="Upload">
        <UploadArea accept="image/*" onFiles={(f) => setFile(f[0] ?? null)} files={file ? [file] : []} />
      </Panel>
      {settings ? <Panel title="Settings">{settings}</Panel> : null}
      <Grid>
        <Panel title="Live preview">
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-white/[0.07] bg-black/30 p-3">
            <canvas ref={canvasRef} className="max-h-[340px] max-w-full rounded-lg" />
            {!img ? <span className="text-[13px] text-white/40">Upload an image to preview</span> : null}
          </div>
        </Panel>
        <Panel title="Result">
          {out ? (
            <div className="space-y-3 text-[13px] text-white/60">
              <div className="flex justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                <span>Original</span>
                <span className="font-mono">{file ? formatBytes(file.size) : "—"}</span>
              </div>
              <div className="flex justify-between rounded-xl bg-white/[0.03] px-3 py-2">
                <span>Output</span>
                <span className="font-mono text-white/85">{formatBytes(out.size)}</span>
              </div>
            </div>
          ) : (
            <p className="text-[13px] text-white/40">Your processed image appears here.</p>
          )}
          <Toolbar>
            <Btn
              variant="primary"
              disabled={!out}
              onClick={async () => {
                if (!out) return;
                downloadBlob(await (await fetch(out.url)).blob(), `${filename}.${ext}`);
              }}
            >
              Download
            </Btn>
            <Btn onClick={() => setFile(null)}>Reset</Btn>
          </Toolbar>
        </Panel>
      </Grid>
    </>
  );
}

const fit = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, canvas: HTMLCanvasElement) => {
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
};

function Compressor() {
  const [q, setQ] = useState(70);
  return (
    <CanvasTool
      type="image/jpeg"
      quality={q / 100}
      filename="compressed"
      deps={[q]}
      draw={fit}
      settings={<Range label="Quality" min={10} max={100} value={q} suffix="%" onChange={(e) => setQ(+e.target.value)} />}
    />
  );
}

function Resizer() {
  const [w, setW] = useState(1200);
  const [ratio, setRatio] = useState(true);
  return (
    <CanvasTool
      filename="resized"
      deps={[w, ratio]}
      draw={(ctx, img, canvas) => {
        const scale = w / img.naturalWidth;
        canvas.width = w;
        canvas.height = ratio ? Math.round(img.naturalHeight * scale) : img.naturalHeight;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }}
      settings={
        <div className="grid gap-4 sm:grid-cols-2">
          <Range label="Width" min={64} max={4000} step={8} value={w} suffix="px" onChange={(e) => setW(+e.target.value)} />
          <Field label="Aspect ratio">
            <Select
              value={ratio ? "lock" : "free"}
              onChange={(e) => setRatio(e.target.value === "lock")}
              options={[
                { value: "lock", label: "Keep aspect ratio" },
                { value: "free", label: "Keep original height" },
              ]}
            />
          </Field>
        </div>
      }
    />
  );
}

function Cropper() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [w, setW] = useState(80);
  const [h, setH] = useState(80);
  return (
    <CanvasTool
      filename="cropped"
      deps={[x, y, w, h]}
      draw={(ctx, img, canvas) => {
        const sx = (img.naturalWidth * x) / 100;
        const sy = (img.naturalHeight * y) / 100;
        const sw = Math.max(1, (img.naturalWidth * w) / 100);
        const sh = Math.max(1, (img.naturalHeight * h) / 100);
        canvas.width = sw;
        canvas.height = sh;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      }}
      settings={
        <div className="grid gap-4 sm:grid-cols-2">
          <Range label="Offset X" min={0} max={95} value={x} suffix="%" onChange={(e) => setX(+e.target.value)} />
          <Range label="Offset Y" min={0} max={95} value={y} suffix="%" onChange={(e) => setY(+e.target.value)} />
          <Range label="Width" min={5} max={100} value={w} suffix="%" onChange={(e) => setW(+e.target.value)} />
          <Range label="Height" min={5} max={100} value={h} suffix="%" onChange={(e) => setH(+e.target.value)} />
        </div>
      }
    />
  );
}

function Converter({ fixed }: { fixed?: string }) {
  const [type, setType] = useState(fixed ?? "image/png");
  return (
    <CanvasTool
      type={type}
      filename="converted"
      deps={[type]}
      draw={fit}
      settings={
        fixed ? undefined : (
          <Field label="Output format">
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={[
                { value: "image/png", label: "PNG" },
                { value: "image/jpeg", label: "JPG" },
                { value: "image/webp", label: "WebP" },
              ]}
            />
          </Field>
        )
      }
    />
  );
}

function Filter({ css, label, min, max, unit, def }: { css: (v: number) => string; label: string; min: number; max: number; unit: string; def: number }) {
  const [v, setV] = useState(def);
  return (
    <CanvasTool
      filename="filtered"
      deps={[v]}
      draw={(ctx, img, canvas) => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.filter = css(v);
        ctx.drawImage(img, 0, 0);
        ctx.filter = "none";
      }}
      settings={<Range label={label} min={min} max={max} value={v} suffix={unit} onChange={(e) => setV(+e.target.value)} />}
    />
  );
}

function Rotate() {
  const [angle, setAngle] = useState(90);
  return (
    <CanvasTool
      filename="rotated"
      deps={[angle]}
      draw={(ctx, img, canvas) => {
        const rad = (angle * Math.PI) / 180;
        const cos = Math.abs(Math.cos(rad));
        const sin = Math.abs(Math.sin(rad));
        canvas.width = img.naturalWidth * cos + img.naturalHeight * sin;
        canvas.height = img.naturalWidth * sin + img.naturalHeight * cos;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }}
      settings={<Range label="Angle" min={0} max={360} value={angle} suffix="°" onChange={(e) => setAngle(+e.target.value)} />}
    />
  );
}

function Flip() {
  const [mode, setMode] = useState("h");
  return (
    <CanvasTool
      filename="flipped"
      deps={[mode]}
      draw={(ctx, img, canvas) => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.save();
        ctx.translate(mode === "h" ? canvas.width : 0, mode === "v" ? canvas.height : 0);
        ctx.scale(mode === "h" ? -1 : 1, mode === "v" ? -1 : 1);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      }}
      settings={
        <Field label="Direction">
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            options={[
              { value: "h", label: "Horizontal" },
              { value: "v", label: "Vertical" },
            ]}
          />
        </Field>
      }
    />
  );
}

function Watermark() {
  const [text, setText] = useState("© Atlas Tools");
  const [size, setSize] = useState(5);
  const [opacity, setOpacity] = useState(55);
  return (
    <CanvasTool
      filename="watermarked"
      deps={[text, size, opacity]}
      draw={(ctx, img, canvas) => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        const fs = (canvas.width * size) / 100;
        ctx.font = `600 ${fs}px system-ui, sans-serif`;
        ctx.fillStyle = `rgba(255,255,255,${opacity / 100})`;
        ctx.textAlign = "right";
        ctx.fillText(text, canvas.width - fs * 0.5, canvas.height - fs * 0.5);
      }}
      settings={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Watermark text">
            <TextInput value={text} onChange={(e) => setText(e.target.value)} />
          </Field>
          <Range label="Size" min={2} max={20} value={size} suffix="%" onChange={(e) => setSize(+e.target.value)} />
          <Range label="Opacity" min={5} max={100} value={opacity} suffix="%" onChange={(e) => setOpacity(+e.target.value)} />
        </div>
      }
    />
  );
}

function MemeGenerator() {
  const [top, setTop] = useState("WHEN THE BUILD PASSES");
  const [bottom, setBottom] = useState("ON THE FIRST TRY");
  return (
    <CanvasTool
      filename="meme"
      deps={[top, bottom]}
      draw={(ctx, img, canvas) => {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        const fs = canvas.width * 0.09;
        ctx.font = `800 ${fs}px Impact, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.lineWidth = fs * 0.09;
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#fff";
        const line = (t: string, y: number) => {
          ctx.strokeText(t.toUpperCase(), canvas.width / 2, y);
          ctx.fillText(t.toUpperCase(), canvas.width / 2, y);
        };
        line(top, fs * 1.15);
        line(bottom, canvas.height - fs * 0.45);
      }}
      settings={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Top text">
            <TextInput value={top} onChange={(e) => setTop(e.target.value)} />
          </Field>
          <Field label="Bottom text">
            <TextInput value={bottom} onChange={(e) => setBottom(e.target.value)} />
          </Field>
        </div>
      }
    />
  );
}

function ColorPicker() {
  const [color, setColor] = useState("#7C5CFF");
  const rgb = useMemo(() => {
    const n = parseInt(color.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }, [color]);
  return (
    <Grid>
      <Panel title="Pick a color">
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="h-40 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
        />
      </Panel>
      <Panel title="Values">
        <Output value={`HEX  ${color.toUpperCase()}\nRGB  rgb(${rgb.join(", ")})\nCSS  color: ${color};`} />
        <Toolbar>
          <CopyButton value={color.toUpperCase()} label="Copy HEX" />
          <CopyButton value={`rgb(${rgb.join(", ")})`} label="Copy RGB" />
        </Toolbar>
      </Panel>
    </Grid>
  );
}

function ImageToBase64() {
  const [data, setData] = useState("");
  return (
    <>
      <Panel title="Upload">
        <UploadArea
          accept="image/*"
          onFiles={(f) => {
            const file = f[0];
            if (!file) return;
            const r = new FileReader();
            r.onload = () => setData(String(r.result));
            r.readAsDataURL(file);
          }}
        />
      </Panel>
      <Panel title="Base64 data URL">
        <Output value={data} />
        <Toolbar>
          <CopyButton value={data} />
          <DownloadButton data={data} filename="image-base64.txt" />
          <Btn onClick={() => setData("")}>Reset</Btn>
        </Toolbar>
      </Panel>
    </>
  );
}

function Base64ToImage() {
  const [data, setData] = useState("");
  const valid = data.trim().startsWith("data:image");
  return (
    <Grid>
      <Panel title="Base64 input">
        <TextArea value={data} onChange={(e) => setData(e.target.value)} placeholder="data:image/png;base64,…" />
        <Toolbar>
          <Btn onClick={() => setData("")}>Reset</Btn>
        </Toolbar>
      </Panel>
      <Panel title="Preview">
        <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-white/[0.07] bg-black/30 p-3">
          {valid ? (
            <img src={data.trim()} alt="Decoded result" className="max-h-[300px] max-w-full rounded-lg" />
          ) : (
            <span className="text-[13px] text-white/40">Paste a valid image data URL</span>
          )}
        </div>
        <Toolbar>
          <Btn
            variant="primary"
            disabled={!valid}
            onClick={async () => downloadBlob(await (await fetch(data.trim())).blob(), "decoded.png")}
          >
            Download
          </Btn>
        </Toolbar>
      </Panel>
    </Grid>
  );
}

export function QrTool() {
  const [text, setText] = useState("https://atlas.tools");
  const [size, setSize] = useState(320);
  const [dark, setDark] = useState("#0b0a14");
  const [url, setUrl] = useState("");
  useEffect(() => {
    QRCode.toDataURL(text || " ", { width: size, margin: 2, color: { dark, light: "#ffffff" } })
      .then(setUrl)
      .catch(() => setUrl(""));
  }, [text, size, dark]);
  return (
    <Grid>
      <Panel title="Content">
        <Field label="Text or URL">
          <TextInput value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Range label="Size" min={128} max={1024} step={16} value={size} suffix="px" onChange={(e) => setSize(+e.target.value)} />
          <Field label="Foreground">
            <input
              type="color"
              value={dark}
              onChange={(e) => setDark(e.target.value)}
              className="h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent"
            />
          </Field>
        </div>
      </Panel>
      <Panel title="Your QR code">
        <div className="flex min-h-[240px] items-center justify-center rounded-xl border border-white/[0.07] bg-black/30 p-4">
          {url ? <img src={url} alt="Generated QR code" className="max-h-[280px] rounded-lg" /> : null}
        </div>
        <Toolbar>
          <Btn variant="primary" disabled={!url} onClick={async () => downloadBlob(await (await fetch(url)).blob(), "qr-code.png")}>
            Download PNG
          </Btn>
          <Btn onClick={() => setText("")}>Reset</Btn>
        </Toolbar>
      </Panel>
    </Grid>
  );
}

/* -------------------------- interface-only previews ------------------------- */

function SimulatedImageTool({ label, note }: { label: string; note: string }) {
  const { file, setFile, img } = useImage();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const src = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  return (
    <>
      <Panel title="Upload">
        <UploadArea accept="image/*" onFiles={(f) => { setFile(f[0] ?? null); setDone(false); }} files={file ? [file] : []} />
      </Panel>
      <Grid>
        <Panel title="Source">
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-white/[0.07] bg-black/30 p-3">
            {src ? <img src={src} alt="Uploaded source" className="max-h-[300px] max-w-full rounded-lg" /> : <span className="text-[13px] text-white/40">No image yet</span>}
          </div>
        </Panel>
        <Panel title="Result">
          <div
            className="flex min-h-[220px] items-center justify-center rounded-xl border border-white/[0.07] p-3"
            style={{
              backgroundImage:
                "conic-gradient(from 45deg at 25% 25%, #1a1a1e 0 25%, #131316 0 50%, #1a1a1e 0 75%, #131316 0)",
              backgroundSize: "20px 20px",
            }}
          >
            {busy ? (
              <span className="text-[13px] text-white/60">Processing…</span>
            ) : done && src ? (
              <img src={src} alt="Processed preview" className="max-h-[300px] max-w-full rounded-lg" />
            ) : (
              <span className="text-[13px] text-white/40">Run {label} to preview</span>
            )}
          </div>
          <Toolbar>
            <Btn
              variant="primary"
              disabled={!img || busy}
              onClick={() => {
                setBusy(true);
                setTimeout(() => {
                  setBusy(false);
                  setDone(true);
                }, 1400);
              }}
            >
              {busy ? "Working…" : label}
            </Btn>
            <Btn onClick={() => { setFile(null); setDone(false); }}>Reset</Btn>
          </Toolbar>
          <Note>{note}</Note>
        </Panel>
      </Grid>
    </>
  );
}

export const tools: Record<string, ToolComponent> = {
  "image-compressor": Compressor,
  "image-resizer": Resizer,
  "image-cropper": Cropper,
  "image-converter": () => <Converter />,
  "jpg-to-png": () => <Converter fixed="image/png" />,
  "webp-converter": () => <Converter fixed="image/webp" />,
  "svg-converter": () => (
    <>
      <Converter fixed="image/png" />
      <Note>Upload an .svg file to rasterize it into a high-quality PNG.</Note>
    </>
  ),
  "image-blur": () => <Filter label="Blur" css={(v) => `blur(${v}px)`} min={0} max={40} unit="px" def={6} />,
  "image-sharpen": () => <Filter label="Sharpen" css={(v) => `contrast(${100 + v}%) saturate(${100 + v / 2}%)`} min={0} max={100} unit="%" def={30} />,
  "image-rotate": Rotate,
  "image-flip": Flip,
  "color-picker": ColorPicker,
  "watermark-tool": Watermark,
  "image-to-base64": ImageToBase64,
  "base64-to-image": Base64ToImage,
  "qr-code-generator": QrTool,
  "meme-generator": MemeGenerator,
};
