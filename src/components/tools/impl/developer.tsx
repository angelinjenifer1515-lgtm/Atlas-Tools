import { useEffect, useMemo, useState } from "react";
import { Btn, CopyButton, Field, Grid, Output, Panel, Range, Select, TextArea, TextInput, Toolbar } from "../ui";
import type { ToolComponent } from "@/lib/tools/loader";

function CssTool({ preview, css, controls }: { preview: React.CSSProperties; css: string; controls: React.ReactNode }) {
  return (
    <>
      <Panel title="Settings">{controls}</Panel>
      <Grid>
        <Panel title="Live preview">
          <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-white/[0.07] bg-black/30 p-6">
            <div style={preview} className="h-32 w-48" />
          </div>
        </Panel>
        <Panel title="CSS">
          <Output value={css} />
          <Toolbar>
            <CopyButton value={css} />
          </Toolbar>
        </Panel>
      </Grid>
    </>
  );
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHsl([r, g, b]: number[]) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    h = max === R ? ((G - B) / d) % 6 : max === G ? (B - R) / d + 2 : (R - G) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function ColorConverter() {
  const [hex, setHex] = useState("#7C5CFF");
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);
  return (
    <Grid>
      <Panel title="Color">
        <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-32 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent" />
        <div className="mt-4">
          <Field label="HEX"><TextInput value={hex} onChange={(e) => setHex(e.target.value)} /></Field>
        </div>
      </Panel>
      <Panel title="Values">
        <Output value={`HEX  ${hex.toUpperCase()}\nRGB  rgb(${rgb.join(", ")})\nHSL  hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} />
        <Toolbar><CopyButton value={`rgb(${rgb.join(", ")})`} label="Copy RGB" /><CopyButton value={`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} label="Copy HSL" /></Toolbar>
      </Panel>
    </Grid>
  );
}

function GradientGenerator() {
  const [a, setA] = useState("#7C5CFF");
  const [b, setB] = useState("#4F8CFF");
  const [angle, setAngle] = useState(135);
  const css = `background: linear-gradient(${angle}deg, ${a}, ${b});`;
  return (
    <CssTool
      preview={{ background: `linear-gradient(${angle}deg, ${a}, ${b})`, borderRadius: 16 }}
      css={css}
      controls={
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Color A"><input type="color" value={a} onChange={(e) => setA(e.target.value)} className="h-10 w-full rounded-xl border border-white/10 bg-transparent" /></Field>
          <Field label="Color B"><input type="color" value={b} onChange={(e) => setB(e.target.value)} className="h-10 w-full rounded-xl border border-white/10 bg-transparent" /></Field>
          <Range label="Angle" min={0} max={360} value={angle} suffix="°" onChange={(e) => setAngle(+e.target.value)} />
        </div>
      }
    />
  );
}

function RadiusGenerator() {
  const [tl, setTl] = useState(24), [tr, setTr] = useState(24), [br, setBr] = useState(24), [bl, setBl] = useState(24);
  const value = `${tl}px ${tr}px ${br}px ${bl}px`;
  return (
    <CssTool
      preview={{ borderRadius: value, background: "linear-gradient(135deg,#7C5CFF,#4F8CFF)" }}
      css={`border-radius: ${value};`}
      controls={
        <div className="grid gap-4 sm:grid-cols-4">
          <Range label="Top left" min={0} max={100} value={tl} suffix="px" onChange={(e) => setTl(+e.target.value)} />
          <Range label="Top right" min={0} max={100} value={tr} suffix="px" onChange={(e) => setTr(+e.target.value)} />
          <Range label="Bottom right" min={0} max={100} value={br} suffix="px" onChange={(e) => setBr(+e.target.value)} />
          <Range label="Bottom left" min={0} max={100} value={bl} suffix="px" onChange={(e) => setBl(+e.target.value)} />
        </div>
      }
    />
  );
}

function ShadowGenerator() {
  const [x, setX] = useState(0), [y, setY] = useState(20), [blur, setBlur] = useState(40), [spread, setSpread] = useState(-12), [alpha, setAlpha] = useState(50);
  const value = `${x}px ${y}px ${blur}px ${spread}px rgba(0,0,0,${alpha / 100})`;
  return (
    <CssTool
      preview={{ boxShadow: value, background: "#15131f", borderRadius: 16 }}
      css={`box-shadow: ${value};`}
      controls={
        <div className="grid gap-4 sm:grid-cols-3">
          <Range label="Offset X" min={-50} max={50} value={x} suffix="px" onChange={(e) => setX(+e.target.value)} />
          <Range label="Offset Y" min={-50} max={50} value={y} suffix="px" onChange={(e) => setY(+e.target.value)} />
          <Range label="Blur" min={0} max={120} value={blur} suffix="px" onChange={(e) => setBlur(+e.target.value)} />
          <Range label="Spread" min={-50} max={50} value={spread} suffix="px" onChange={(e) => setSpread(+e.target.value)} />
          <Range label="Opacity" min={0} max={100} value={alpha} suffix="%" onChange={(e) => setAlpha(+e.target.value)} />
        </div>
      }
    />
  );
}

function FlexboxGenerator() {
  const [dir, setDir] = useState("row");
  const [justify, setJustify] = useState("center");
  const [align, setAlign] = useState("center");
  const [gap, setGap] = useState(12);
  const css = `display: flex;\nflex-direction: ${dir};\njustify-content: ${justify};\nalign-items: ${align};\ngap: ${gap}px;`;
  const sel = (v: string, set: (s: string) => void, opts: string[], label: string) => (
    <Field label={label}><Select value={v} onChange={(e) => set(e.target.value)} options={opts.map((o) => ({ value: o, label: o }))} /></Field>
  );
  return (
    <>
      <Panel title="Settings">
        <div className="grid gap-4 sm:grid-cols-4">
          {sel(dir, setDir, ["row", "row-reverse", "column", "column-reverse"], "Direction")}
          {sel(justify, setJustify, ["flex-start", "center", "flex-end", "space-between", "space-around"], "Justify")}
          {sel(align, setAlign, ["stretch", "flex-start", "center", "flex-end"], "Align")}
          <Range label="Gap" min={0} max={48} value={gap} suffix="px" onChange={(e) => setGap(+e.target.value)} />
        </div>
      </Panel>
      <Grid>
        <Panel title="Live preview">
          <div
            className="min-h-[220px] rounded-xl border border-white/[0.07] bg-black/30 p-4"
            style={{ display: "flex", flexDirection: dir as never, justifyContent: justify, alignItems: align, gap }}
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 w-14 rounded-lg bg-[linear-gradient(135deg,#7C5CFF,#4F8CFF)]" />
            ))}
          </div>
        </Panel>
        <Panel title="CSS">
          <Output value={css} />
          <Toolbar><CopyButton value={css} /></Toolbar>
        </Panel>
      </Grid>
    </>
  );
}

function GridGenerator() {
  const [cols, setCols] = useState(3), [rows, setRows] = useState(2), [gap, setGap] = useState(12);
  const css = `display: grid;\ngrid-template-columns: repeat(${cols}, 1fr);\ngrid-template-rows: repeat(${rows}, 1fr);\ngap: ${gap}px;`;
  return (
    <>
      <Panel title="Settings">
        <div className="grid gap-4 sm:grid-cols-3">
          <Range label="Columns" min={1} max={8} value={cols} onChange={(e) => setCols(+e.target.value)} />
          <Range label="Rows" min={1} max={8} value={rows} onChange={(e) => setRows(+e.target.value)} />
          <Range label="Gap" min={0} max={40} value={gap} suffix="px" onChange={(e) => setGap(+e.target.value)} />
        </div>
      </Panel>
      <Grid>
        <Panel title="Live preview">
          <div
            className="min-h-[220px] rounded-xl border border-white/[0.07] bg-black/30 p-4"
            style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)`, gap }}
          >
            {Array.from({ length: cols * rows }, (_, i) => (
              <div key={i} className="rounded-lg bg-[linear-gradient(135deg,#7C5CFF,#4F8CFF)] opacity-80" />
            ))}
          </div>
        </Panel>
        <Panel title="CSS">
          <Output value={css} />
          <Toolbar><CopyButton value={css} /></Toolbar>
        </Panel>
      </Grid>
    </>
  );
}

function MetaTagGenerator() {
  const [title, setTitle] = useState("Atlas Tools");
  const [desc, setDesc] = useState("Every digital tool, under one roof.");
  const [url, setUrl] = useState("https://example.com");
  const out = `<title>${title}</title>\n<meta name="description" content="${desc}" />\n<link rel="canonical" href="${url}" />\n<meta property="og:title" content="${title}" />\n<meta property="og:description" content="${desc}" />\n<meta property="og:type" content="website" />\n<meta property="og:url" content="${url}" />\n<meta name="twitter:card" content="summary_large_image" />`;
  return (
    <Grid>
      <Panel title="Page details">
        <div className="space-y-4">
          <Field label="Title"><TextInput value={title} onChange={(e) => setTitle(e.target.value)} /></Field>
          <Field label="Description"><TextInput value={desc} onChange={(e) => setDesc(e.target.value)} /></Field>
          <Field label="Canonical URL"><TextInput value={url} onChange={(e) => setUrl(e.target.value)} /></Field>
        </div>
      </Panel>
      <Panel title="Meta tags">
        <Output value={out} />
        <Toolbar><CopyButton value={out} /></Toolbar>
      </Panel>
    </Grid>
  );
}

function RobotsGenerator() {
  const [allow, setAllow] = useState(true);
  const [disallow, setDisallow] = useState("/admin\n/private");
  const [sitemap, setSitemap] = useState("https://example.com/sitemap.xml");
  const out = `User-agent: *\n${allow ? "Allow: /" : "Disallow: /"}\n${disallow.split("\n").filter(Boolean).map((p) => `Disallow: ${p}`).join("\n")}\n\nSitemap: ${sitemap}`;
  return (
    <Grid>
      <Panel title="Rules">
        <div className="space-y-4">
          <Field label="Crawling">
            <Select value={allow ? "allow" : "block"} onChange={(e) => setAllow(e.target.value === "allow")} options={[{ value: "allow", label: "Allow all" }, { value: "block", label: "Block all" }]} />
          </Field>
          <Field label="Disallowed paths"><TextArea value={disallow} onChange={(e) => setDisallow(e.target.value)} className="min-h-[120px]" /></Field>
          <Field label="Sitemap URL"><TextInput value={sitemap} onChange={(e) => setSitemap(e.target.value)} /></Field>
        </div>
      </Panel>
      <Panel title="robots.txt">
        <Output value={out} />
        <Toolbar><CopyButton value={out} /></Toolbar>
      </Panel>
    </Grid>
  );
}

function SitemapGenerator() {
  const [urls, setUrls] = useState("https://example.com/\nhttps://example.com/about");
  const out = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .split("\n")
    .filter(Boolean)
    .map((u) => `  <url>\n    <loc>${u.trim()}</loc>\n  </url>`)
    .join("\n")}\n</urlset>`;
  return (
    <Grid>
      <Panel title="URLs (one per line)">
        <TextArea value={urls} onChange={(e) => setUrls(e.target.value)} />
      </Panel>
      <Panel title="sitemap.xml">
        <Output value={out} />
        <Toolbar><CopyButton value={out} /></Toolbar>
      </Panel>
    </Grid>
  );
}

function JwtDecoder() {
  const [token, setToken] = useState("");
  const decoded = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return "";
    const dec = (p: string) => {
      try {
        return JSON.stringify(JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/"))), null, 2);
      } catch {
        return "⚠ Could not decode this segment";
      }
    };
    return `HEADER\n${dec(parts[0])}\n\nPAYLOAD\n${dec(parts[1])}`;
  }, [token]);
  return (
    <Grid>
      <Panel title="JWT">
        <TextArea value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOi…" />
        <Toolbar><Btn onClick={() => setToken("")}>Reset</Btn></Toolbar>
      </Panel>
      <Panel title="Decoded">
        <Output value={decoded} />
        <Toolbar><CopyButton value={decoded} /></Toolbar>
      </Panel>
    </Grid>
  );
}

function TimestampConverter() {
  const [ts, setTs] = useState("");
  useEffect(() => setTs(String(Math.floor(Date.now() / 1000))), []);
  const d = new Date(Number(ts) * (ts.length > 11 ? 1 : 1000));
  const out = !ts || Number.isNaN(+d) ? "—" : `ISO       ${d.toISOString()}\nLocal     ${d.toLocaleString()}\nUTC       ${d.toUTCString()}\nRelative  ${Math.round((+d - Date.now()) / 86400000)} days`;
  return (
    <Grid>
      <Panel title="Unix timestamp">
        <Field label="Seconds or milliseconds"><TextInput value={ts} onChange={(e) => setTs(e.target.value)} inputMode="numeric" /></Field>
        <Toolbar><Btn onClick={() => setTs(String(Math.floor(Date.now() / 1000)))}>Now</Btn></Toolbar>
      </Panel>
      <Panel title="Human time">
        <Output value={out} />
        <Toolbar><CopyButton value={out} /></Toolbar>
      </Panel>
    </Grid>
  );
}

function UnixTimeConverter() {
  const [date, setDate] = useState("");
  useEffect(() => setDate(new Date().toISOString().slice(0, 16)), []);
  const d = new Date(date);
  const out = !ts || Number.isNaN(+d) ? "—" : `Seconds       ${Math.floor(+d / 1000)}\nMilliseconds  ${+d}`;
  return (
    <Grid>
      <Panel title="Date & time">
        <Field label="Local"><TextInput type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
      </Panel>
      <Panel title="Unix time">
        <Output value={out} />
        <Toolbar><CopyButton value={String(Math.floor(+d / 1000))} label="Copy seconds" /></Toolbar>
      </Panel>
    </Grid>
  );
}

function HashGenerator() {
  const [text, setText] = useState("");
  const [algo, setAlgo] = useState("SHA-256");
  const [hash, setHash] = useState("");
  useEffect(() => {
    let cancelled = false;
    if (!text) return setHash("");
    crypto.subtle.digest(algo, new TextEncoder().encode(text)).then((buf) => {
      if (cancelled) return;
      setHash(Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join(""));
    });
    return () => { cancelled = true; };
  }, [text, algo]);
  return (
    <Grid>
      <Panel title="Input">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Text to hash…" />
        <div className="mt-4">
          <Field label="Algorithm">
            <Select value={algo} onChange={(e) => setAlgo(e.target.value)} options={["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((a) => ({ value: a, label: a }))} />
          </Field>
        </div>
      </Panel>
      <Panel title="Hash">
        <Output value={hash} />
        <Toolbar><CopyButton value={hash} /></Toolbar>
      </Panel>
    </Grid>
  );
}

function CronGenerator() {
  const [min, setMin] = useState("0");
  const [hour, setHour] = useState("9");
  const [dom, setDom] = useState("*");
  const [mon, setMon] = useState("*");
  const [dow, setDow] = useState("1-5");
  const expr = `${min} ${hour} ${dom} ${mon} ${dow}`;
  return (
    <Grid>
      <Panel title="Schedule">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Minute"><TextInput value={min} onChange={(e) => setMin(e.target.value)} /></Field>
          <Field label="Hour"><TextInput value={hour} onChange={(e) => setHour(e.target.value)} /></Field>
          <Field label="Day of month"><TextInput value={dom} onChange={(e) => setDom(e.target.value)} /></Field>
          <Field label="Month"><TextInput value={mon} onChange={(e) => setMon(e.target.value)} /></Field>
          <Field label="Day of week"><TextInput value={dow} onChange={(e) => setDow(e.target.value)} /></Field>
        </div>
      </Panel>
      <Panel title="Cron expression">
        <Output value={`${expr}\n\nRuns at minute ${min}, hour ${hour}, on day-of-month ${dom}, month ${mon}, day-of-week ${dow}.`} />
        <Toolbar><CopyButton value={expr} /></Toolbar>
      </Panel>
    </Grid>
  );
}

export const tools: Record<string, ToolComponent> = {
  "color-converter": ColorConverter,
  "gradient-generator": GradientGenerator,
  "border-radius-generator": RadiusGenerator,
  "css-shadow-generator": ShadowGenerator,
  "flexbox-generator": FlexboxGenerator,
  "grid-generator": GridGenerator,
  "meta-tag-generator": MetaTagGenerator,
  "robots-txt-generator": RobotsGenerator,
  "sitemap-generator": SitemapGenerator,
  "jwt-decoder": JwtDecoder,
  "timestamp-converter": TimestampConverter,
  "unix-time-converter": UnixTimeConverter,
  "hash-generator": HashGenerator,
  "cron-generator": CronGenerator,
};
