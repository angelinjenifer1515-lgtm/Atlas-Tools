import { useMemo, useState } from "react";
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
  Stat,
  TextArea,
  TextInput,
  Toggle,
  Toolbar,
  UploadArea,
  useMounted,
} from "../ui";
import type { ToolComponent } from "@/lib/tools/loader";

/* --------------------------- generic transform tool ------------------------- */

function TransformTool({
  transform,
  placeholder = "Paste your text here…",
  filename = "output.txt",
  settings,
  sample = "",
}: {
  transform: (input: string) => string;
  placeholder?: string;
  filename?: string;
  settings?: React.ReactNode;
  sample?: string;
}) {
  const [input, setInput] = useState(sample);
  let output = "";
  let error = "";
  try {
    output = transform(input);
  } catch (e) {
    error = e instanceof Error ? e.message : String(e);
  }

  return (
    <>
      {settings ? <Panel title="Settings">{settings}</Panel> : null}
      <Grid>
        <Panel title="Input">
          <TextArea value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} />
          <Toolbar>
            <Btn onClick={() => setInput("")}>Reset</Btn>
          </Toolbar>
        </Panel>
        <Panel title="Result">
          <Output value={error ? `⚠ ${error}` : output} />
          <Toolbar>
            <CopyButton value={output} />
            <DownloadButton data={output} filename={filename} />
          </Toolbar>
        </Panel>
      </Grid>
    </>
  );
}

/* ---------------------------------- counters -------------------------------- */

function WordCounter() {
  const [text, setText] = useState("");
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+/g) ?? [text]).length : 0;
    const paragraphs = text.trim() ? text.split(/\n{2,}/).filter((p) => p.trim()).length : 0;
    return {
      words,
      sentences,
      paragraphs,
      chars: text.length,
      reading: `${Math.max(1, Math.round(words / 220))} min`,
    };
  }, [text]);

  return (
    <Grid>
      <Panel title="Your text">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing or paste text…" />
        <Toolbar>
          <Btn onClick={() => setText("")}>Reset</Btn>
          <CopyButton value={text} />
        </Toolbar>
      </Panel>
      <Panel title="Live analysis">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Words" value={stats.words.toLocaleString()} />
          <Stat label="Characters" value={stats.chars.toLocaleString()} />
          <Stat label="Sentences" value={stats.sentences} />
          <Stat label="Paragraphs" value={stats.paragraphs} />
          <Stat label="Reading time" value={stats.reading} />
          <Stat label="Speaking time" value={`${Math.max(1, Math.round(stats.words / 130))} min`} />
        </div>
      </Panel>
    </Grid>
  );
}

function CharacterCounter() {
  const [text, setText] = useState("");
  const bytes = useMemo(() => new TextEncoder().encode(text).length, [text]);
  return (
    <Grid>
      <Panel title="Your text">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Type to count characters…" />
        <Toolbar>
          <Btn onClick={() => setText("")}>Reset</Btn>
          <CopyButton value={text} />
        </Toolbar>
      </Panel>
      <Panel title="Counts">
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Characters" value={text.length.toLocaleString()} />
          <Stat label="No spaces" value={text.replace(/\s/g, "").length.toLocaleString()} />
          <Stat label="Lines" value={text ? text.split("\n").length : 0} />
          <Stat label="UTF-8 bytes" value={bytes.toLocaleString()} />
        </div>
      </Panel>
    </Grid>
  );
}

/* -------------------------------- converters -------------------------------- */

const CASES: Record<string, (s: string) => string> = {
  UPPERCASE: (s) => s.toUpperCase(),
  lowercase: (s) => s.toLowerCase(),
  "Title Case": (s) => s.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()),
  "Sentence case": (s) => s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()),
  "camelCase": (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, ""),
  "snake_case": (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
  "kebab-case": (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  "aLtErNaTiNg": (s) => s.split("").map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join(""),
};

function CaseConverter() {
  const [mode, setMode] = useState("UPPERCASE");
  return (
    <TransformTool
      transform={(s) => CASES[mode](s)}
      settings={
        <Field label="Target case">
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            options={Object.keys(CASES).map((k) => ({ value: k, label: k }))}
          />
        </Field>
      }
    />
  );
}

function LoremIpsum() {
  const [paras, setParas] = useState(3);
  const [sentences, setSentences] = useState(5);
  const words =
    "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur".split(
      " ",
    );
  const text = useMemo(() => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    const out: string[] = [];
    for (let p = 0; p < paras; p++) {
      const s: string[] = [];
      for (let i = 0; i < sentences; i++) {
        const len = 8 + Math.floor(rnd() * 10);
        const w = Array.from({ length: len }, () => words[Math.floor(rnd() * words.length)]);
        s.push(w.join(" ").replace(/^./, (c) => c.toUpperCase()) + ".");
      }
      out.push(s.join(" "));
    }
    return out.join("\n\n");
  }, [paras, sentences]);

  return (
    <>
      <Panel title="Settings">
        <div className="grid gap-4 sm:grid-cols-2">
          <Range label="Paragraphs" min={1} max={12} value={paras} onChange={(e) => setParas(+e.target.value)} />
          <Range
            label="Sentences each"
            min={1}
            max={12}
            value={sentences}
            onChange={(e) => setSentences(+e.target.value)}
          />
        </div>
      </Panel>
      <Panel title="Generated text">
        <Output value={text} mono={false} />
        <Toolbar>
          <CopyButton value={text} />
          <DownloadButton data={text} filename="lorem-ipsum.txt" />
        </Toolbar>
      </Panel>
    </>
  );
}

/* ---------------------------------- code ------------------------------------ */

function formatXml(xml: string) {
  if (!xml.trim()) return "";
  const tokens = xml.replace(/>\s*</g, "><").replace(/></g, ">\n<").split("\n");
  let pad = 0;
  return tokens
    .map((line) => {
      if (/^<\/\w/.test(line)) pad = Math.max(0, pad - 1);
      const out = "  ".repeat(pad) + line;
      if (/^<\w[^>]*[^/]?>$/.test(line) && !/^<(\?|!)/.test(line) && !/<\/\w/.test(line)) pad++;
      return out;
    })
    .join("\n");
}

function csvParse(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < csv.length; i++) {
    const c = csv[i];
    if (quoted) {
      if (c === '"' && csv[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (c !== "\r") cell += c;
  }
  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((x) => x !== ""));
}

function CsvViewer() {
  const [csv, setCsv] = useState("name,role,city\nAda,Engineer,London\nGrace,Admiral,New York");
  const rows = useMemo(() => csvParse(csv), [csv]);
  return (
    <>
      <Panel title="CSV input">
        <UploadArea
          accept=".csv,text/csv"
          onFiles={async (f) => f[0] && setCsv(await f[0].text())}
          hint="Drop a .csv file, or paste below"
        />
        <div className="mt-4">
          <TextArea value={csv} onChange={(e) => setCsv(e.target.value)} />
        </div>
      </Panel>
      <Panel title="Table preview" hint={`${Math.max(0, rows.length - 1)} rows`}>
        <div className="overflow-auto rounded-xl border border-white/[0.07]">
          <table className="w-full text-left text-[12.5px]">
            <thead className="bg-white/[0.04] text-white/70">
              <tr>
                {(rows[0] ?? []).map((h, i) => (
                  <th key={i} className="whitespace-nowrap px-3 py-2 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-white/60">
              {rows.slice(1).map((r, i) => (
                <tr key={i} className="border-t border-white/[0.05]">
                  {r.map((c, j) => (
                    <td key={j} className="whitespace-nowrap px-3 py-2">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function markdownToHtml(md: string) {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return esc(md)
    .replace(/^###### (.*)$/gm, "<h6>$1</h6>")
    .replace(/^##### (.*)$/gm, "<h5>$1</h5>")
    .replace(/^#### (.*)$/gm, "<h4>$1</h4>")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^&gt; (.*)$/gm, "<blockquote>$1</blockquote>")
    .replace(/```([\s\S]*?)```/g, "<pre>$1</pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/^[-*] (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>')
    .replace(/^(?!<[uhpblc])(.+)$/gm, "<p>$1</p>");
}

function MarkdownPreview() {
  const [md, setMd] = useState("# Hello Atlas\n\nWrite **markdown** and see it *render* instantly.\n\n- Fast\n- Private\n- Free");
  const html = useMemo(() => markdownToHtml(md), [md]);
  return (
    <Grid>
      <Panel title="Markdown">
        <TextArea value={md} onChange={(e) => setMd(e.target.value)} />
        <Toolbar>
          <Btn onClick={() => setMd("")}>Reset</Btn>
          <CopyButton value={html} label="Copy HTML" />
          <DownloadButton data={html} filename="markdown.html" mime="text/html" />
        </Toolbar>
      </Panel>
      <Panel title="Preview">
        <div
          className="prose-atlas max-h-[380px] overflow-auto rounded-xl border border-white/[0.07] bg-black/30 p-4 text-[13.5px] leading-relaxed text-white/80 [&_a]:text-[color:var(--violet-soft)] [&_blockquote]:border-l-2 [&_blockquote]:border-white/20 [&_blockquote]:pl-3 [&_code]:font-mono [&_h1]:mb-2 [&_h1]:text-[22px] [&_h1]:font-semibold [&_h1]:text-white [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-[18px] [&_h2]:font-semibold [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_p]:my-2 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:bg-black/50 [&_pre]:p-3"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Panel>
    </Grid>
  );
}

function JsonFormatter() {
  const [indent, setIndent] = useState(2);
  const [minify, setMinify] = useState(false);
  return (
    <TransformTool
      filename="formatted.json"
      placeholder='{"hello":"world"}'
      transform={(s) => (s.trim() ? JSON.stringify(JSON.parse(s), null, minify ? 0 : indent) : "")}
      settings={
        <div className="grid gap-4 sm:grid-cols-2">
          <Range label="Indent" min={0} max={8} value={indent} onChange={(e) => setIndent(+e.target.value)} />
          <Toggle label="Minify output" checked={minify} onChange={setMinify} />
        </div>
      }
    />
  );
}

function JsonValidator() {
  const [text, setText] = useState("");
  let status: { ok: boolean; msg: string } = { ok: true, msg: "Waiting for input…" };
  if (text.trim()) {
    try {
      JSON.parse(text);
      status = { ok: true, msg: "Valid JSON ✓" };
    } catch (e) {
      status = { ok: false, msg: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }
  return (
    <Grid>
      <Panel title="JSON input">
        <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste JSON to validate…" />
        <Toolbar>
          <Btn onClick={() => setText("")}>Reset</Btn>
        </Toolbar>
      </Panel>
      <Panel title="Validation">
        <div
          className={`rounded-xl border px-4 py-4 text-[13px] ${
            status.ok
              ? "border-emerald-400/25 bg-emerald-400/[0.07] text-emerald-200/90"
              : "border-red-400/25 bg-red-400/[0.07] text-red-200/90"
          }`}
        >
          {status.msg}
        </div>
      </Panel>
    </Grid>
  );
}

/* ------------------------------- generators --------------------------------- */

function PasswordGenerator() {
  const [len, setLen] = useState(20);
  const [upper, setUpper] = useState(true);
  const [nums, setNums] = useState(true);
  const [syms, setSyms] = useState(true);
  const [seed, setSeed] = useState(0);

  const pwd = useMemo(() => {
    void seed;
    let chars = "abcdefghijklmnopqrstuvwxyz";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (nums) chars += "0123456789";
    if (syms) chars += "!@#$%^&*()-_=+[]{};:,.?";
    const buf = new Uint32Array(len);
    crypto.getRandomValues(buf);
    return Array.from(buf, (n) => chars[n % chars.length]).join("");
  }, [len, upper, nums, syms, seed]);

  const strength = Math.min(100, Math.round((len * (upper ? 1.2 : 1) * (nums ? 1.15 : 1) * (syms ? 1.25 : 1)) * 2.6));

  return (
    <>
      <Panel title="Settings">
        <div className="grid gap-4 sm:grid-cols-2">
          <Range label="Length" min={6} max={64} value={len} onChange={(e) => setLen(+e.target.value)} />
          <Toggle label="Uppercase letters" checked={upper} onChange={setUpper} />
          <Toggle label="Numbers" checked={nums} onChange={setNums} />
          <Toggle label="Symbols" checked={syms} onChange={setSyms} />
        </div>
      </Panel>
      <Panel title="Your password">
        <div className="break-all rounded-xl border border-white/[0.07] bg-black/30 p-4 font-mono text-[15px] text-white" aria-live="polite">
          {mounted ? pwd : "—"}
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#7C5CFF,#4F8CFF)] transition-all duration-500"
            style={{ width: `${strength}%` }}
          />
        </div>
        <Toolbar>
          <Btn onClick={() => setSeed((s) => s + 1)} variant="primary">
            Regenerate
          </Btn>
          <CopyButton value={mounted ? pwd : ""} />
        </Toolbar>
      </Panel>
    </>
  );
}

function UuidGenerator() {
  const mounted = useMounted();
  const [count, setCount] = useState(5);
  const [seed, setSeed] = useState(0);
  const ids = useMemo(() => {
    void seed;
    return Array.from({ length: count }, () => crypto.randomUUID()).join("\n");
  }, [count, seed]);
  return (
    <>
      <Panel title="Settings">
        <Range label="How many" min={1} max={100} value={count} onChange={(e) => setCount(+e.target.value)} />
      </Panel>
      <Panel title="UUID v4">
        <Output value={mounted ? ids : "—"} />
        <Toolbar>
          <Btn variant="primary" onClick={() => setSeed((s) => s + 1)}>
            Regenerate
          </Btn>
          <CopyButton value={ids} />
          <DownloadButton data={ids} filename="uuids.txt" />
        </Toolbar>
      </Panel>
    </>
  );
}

/* ---------------------------------- exports --------------------------------- */

const sortTool = () => {
  const [dir, setDir] = useState("asc");
  const [numeric, setNumeric] = useState(false);
  return { dir, setDir, numeric, setNumeric };
};

function TextSorter() {
  const { dir, setDir, numeric, setNumeric } = sortTool();
  return (
    <TransformTool
      transform={(s) => {
        const lines = s.split("\n").filter((l) => l.length);
        lines.sort((a, b) => (numeric ? parseFloat(a) - parseFloat(b) : a.localeCompare(b)));
        if (dir === "desc") lines.reverse();
        return lines.join("\n");
      }}
      settings={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Direction">
            <Select
              value={dir}
              onChange={(e) => setDir(e.target.value)}
              options={[
                { value: "asc", label: "Ascending" },
                { value: "desc", label: "Descending" },
              ]}
            />
          </Field>
          <Toggle label="Numeric sort" checked={numeric} onChange={setNumeric} />
        </div>
      }
    />
  );
}

function TextReverser() {
  const [mode, setMode] = useState("characters");
  return (
    <TransformTool
      transform={(s) =>
        mode === "characters"
          ? s.split("").reverse().join("")
          : mode === "words"
            ? s.split(/\s+/).reverse().join(" ")
            : s.split("\n").reverse().join("\n")
      }
      settings={
        <Field label="Reverse by">
          <Select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            options={[
              { value: "characters", label: "Characters" },
              { value: "words", label: "Words" },
              { value: "lines", label: "Lines" },
            ]}
          />
        </Field>
      }
    />
  );
}

function SlugGenerator() {
  return (
    <TransformTool
      placeholder="My Great Blog Post Title"
      transform={(s) =>
        s
          .split("\n")
          .map((line) =>
            line
              .normalize("NFKD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .trim()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, ""),
          )
          .join("\n")
      }
    />
  );
}

function minifyCss(css: string) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function minifyJs(js: string) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1")
    .replace(/\n\s*/g, "\n")
    .replace(/\s*([{}();,=+\-*/<>])\s*/g, "$1")
    .trim();
}

function formatHtml(html: string) {
  return formatXml(html);
}

export const tools: Record<string, ToolComponent> = {
  "word-counter": WordCounter,
  "character-counter": CharacterCounter,
  "case-converter": CaseConverter,
  "lorem-ipsum-generator": LoremIpsum,
  "remove-duplicate-lines": () => (
    <TransformTool transform={(s) => Array.from(new Set(s.split("\n"))).join("\n")} />
  ),
  "text-sorter": TextSorter,
  "text-reverser": TextReverser,
  "whitespace-cleaner": () => (
    <TransformTool
      transform={(s) =>
        s
          .split("\n")
          .map((l) => l.replace(/[ \t]+/g, " ").trim())
          .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
          .join("\n")
          .trim()
      }
    />
  ),
  "markdown-preview": MarkdownPreview,
  "json-formatter": JsonFormatter,
  "json-validator": JsonValidator,
  "xml-formatter": () => <TransformTool transform={formatXml} filename="formatted.xml" placeholder="<root><a>1</a></root>" />,
  "html-formatter": () => <TransformTool transform={formatHtml} filename="formatted.html" />,
  "html-minifier": () => (
    <TransformTool
      filename="minified.html"
      transform={(s) => s.replace(/<!--[\s\S]*?-->/g, "").replace(/>\s+</g, "><").replace(/\s{2,}/g, " ").trim()}
    />
  ),
  "css-minifier": () => <TransformTool transform={minifyCss} filename="styles.min.css" />,
  "js-minifier": () => (
    <>
      <TransformTool transform={minifyJs} filename="script.min.js" />
      <Note>Whitespace and comment stripping only — safe for simple scripts, not a full compiler.</Note>
    </>
  ),
  "csv-viewer": CsvViewer,
  "csv-to-json": () => (
    <TransformTool
      filename="data.json"
      placeholder="name,city&#10;Ada,London"
      transform={(s) => {
        const rows = csvParse(s);
        if (!rows.length) return "";
        const [head, ...body] = rows;
        return JSON.stringify(
          body.map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""]))),
          null,
          2,
        );
      }}
    />
  ),
  "json-to-csv": () => (
    <TransformTool
      filename="data.csv"
      placeholder='[{"name":"Ada","city":"London"}]'
      transform={(s) => {
        if (!s.trim()) return "";
        const data = JSON.parse(s);
        const arr: Record<string, unknown>[] = Array.isArray(data) ? data : [data];
        const keys = Array.from(new Set(arr.flatMap((o) => Object.keys(o ?? {}))));
        const cell = (v: unknown) => {
          const t = v == null ? "" : String(v);
          return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
        };
        return [keys.join(","), ...arr.map((o) => keys.map((k) => cell(o?.[k])).join(","))].join("\n");
      }}
    />
  ),
  "password-generator": PasswordGenerator,
  "uuid-generator": UuidGenerator,
  "slug-generator": SlugGenerator,
  "base64-encoder": () => (
    <TransformTool
      transform={(s) => (s ? btoa(String.fromCharCode(...new TextEncoder().encode(s))) : "")}
      filename="encoded.txt"
    />
  ),
  "base64-decoder": () => (
    <TransformTool
      transform={(s) => (s.trim() ? new TextDecoder().decode(Uint8Array.from(atob(s.trim()), (c) => c.charCodeAt(0))) : "")}
      filename="decoded.txt"
    />
  ),
  "url-encoder": () => <TransformTool transform={(s) => encodeURIComponent(s)} />,
  "url-decoder": () => <TransformTool transform={(s) => decodeURIComponent(s)} />,
};

export { TransformTool, csvParse, formatXml, TextInput };
