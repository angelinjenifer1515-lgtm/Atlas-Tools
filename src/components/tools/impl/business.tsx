import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import {
  Btn,
  CopyButton,
  Field,
  Note,
  Output,
  Panel,
  Range,
  Select,
  Stat,
  TextArea,
  TextInput,
  Toolbar,
  downloadBlob,
} from "../ui";
import type { ToolComponent } from "@/lib/tools/loader";

/* ------------------------------- shared bits ------------------------------ */

interface Line {
  desc: string;
  qty: number;
  price: number;
}

const money = (n: number, cur: string) =>
  `${cur}${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function printHtml(title: string, body: string) {
  const w = window.open("", "_blank", "width=880,height=1000");
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>${title}</title><style>
    *{box-sizing:border-box} body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;padding:48px;color:#111}
    h1{font-size:26px;margin:0 0 4px} h2{font-size:15px;margin:24px 0 8px;letter-spacing:.04em;text-transform:uppercase;color:#666}
    table{width:100%;border-collapse:collapse;margin-top:12px;font-size:14px}
    th,td{text-align:left;padding:9px 8px;border-bottom:1px solid #e6e6e6} th{color:#666;font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.05em}
    td.n,th.n{text-align:right} .muted{color:#666;font-size:13px;line-height:1.6} .tot{font-size:18px;font-weight:700}
    .row{display:flex;justify-content:space-between;gap:32px;align-items:flex-start}
  </style></head><body>${body}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 350);
}

function LineItems({ lines, setLines }: { lines: Line[]; setLines: (l: Line[]) => void }) {
  const update = (i: number, patch: Partial<Line>) =>
    setLines(lines.map((l, x) => (x === i ? { ...l, ...patch } : l)));
  return (
    <div className="space-y-2.5">
      {lines.map((l, i) => (
        <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_90px_110px_auto]">
          <TextInput
            aria-label="Description"
            placeholder="Description"
            value={l.desc}
            onChange={(e) => update(i, { desc: e.target.value })}
          />
          <TextInput
            aria-label="Quantity"
            inputMode="decimal"
            placeholder="Qty"
            value={String(l.qty)}
            onChange={(e) => update(i, { qty: Number(e.target.value) || 0 })}
          />
          <TextInput
            aria-label="Unit price"
            inputMode="decimal"
            placeholder="Price"
            value={String(l.price)}
            onChange={(e) => update(i, { price: Number(e.target.value) || 0 })}
          />
          <Btn onClick={() => setLines(lines.filter((_, x) => x !== i))} aria-label="Remove line">
            Remove
          </Btn>
        </div>
      ))}
      <Btn onClick={() => setLines([...lines, { desc: "", qty: 1, price: 0 }])}>Add line</Btn>
    </div>
  );
}

/* ------------------------------ document tools ---------------------------- */

function DocTool({
  kind,
  heading,
  partyLabel,
}: {
  kind: string;
  heading: string;
  partyLabel: string;
}) {
  const [from, setFrom] = useState("Atlas Studio\n12 Orbit Lane\nhello@atlas.tools");
  const [to, setTo] = useState("Northwind Ltd\n8 Harbour Road\naccounts@northwind.co");
  const [ref, setRef] = useState(`${kind.toUpperCase()}-1042`);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [cur, setCur] = useState("$");
  const [taxRate, setTaxRate] = useState(10);
  const [notes, setNotes] = useState("Payment due within 14 days.");
  const [lines, setLines] = useState<Line[]>([
    { desc: "Brand identity design", qty: 1, price: 2400 },
    { desc: "Landing page build", qty: 1, price: 1800 },
  ]);

  const sub = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const tax = (sub * taxRate) / 100;
  const total = sub + tax;

  const html = `
    <div class="row"><div><h1>${heading}</h1><div class="muted">${ref} · ${date}</div></div>
    <div class="muted" style="text-align:right;white-space:pre-line">${from}</div></div>
    <h2>${partyLabel}</h2><div class="muted" style="white-space:pre-line">${to}</div>
    <table><thead><tr><th>Description</th><th class="n">Qty</th><th class="n">Unit</th><th class="n">Amount</th></tr></thead><tbody>
    ${lines
      .map(
        (l) =>
          `<tr><td>${l.desc || "—"}</td><td class="n">${l.qty}</td><td class="n">${money(l.price, cur)}</td><td class="n">${money(l.qty * l.price, cur)}</td></tr>`,
      )
      .join("")}
    </tbody></table>
    <table style="margin-top:16px"><tbody>
      <tr><td>Subtotal</td><td class="n">${money(sub, cur)}</td></tr>
      <tr><td>Tax (${taxRate}%)</td><td class="n">${money(tax, cur)}</td></tr>
      <tr><td class="tot">Total</td><td class="n tot">${money(total, cur)}</td></tr>
    </tbody></table>
    <h2>Notes</h2><div class="muted" style="white-space:pre-line">${notes}</div>`;

  return (
    <>
      <Panel title="Details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Reference">
            <TextInput value={ref} onChange={(e) => setRef(e.target.value)} />
          </Field>
          <Field label="Date">
            <TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
          <Field label="From">
            <TextArea className="min-h-[110px] font-sans" value={from} onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label={partyLabel}>
            <TextArea className="min-h-[110px] font-sans" value={to} onChange={(e) => setTo(e.target.value)} />
          </Field>
          <Field label="Currency symbol">
            <TextInput value={cur} onChange={(e) => setCur(e.target.value)} />
          </Field>
          <Range label="Tax rate" min={0} max={30} value={taxRate} suffix="%" onChange={(e) => setTaxRate(+e.target.value)} />
        </div>
      </Panel>

      <Panel title="Line items">
        <LineItems lines={lines} setLines={setLines} />
        <Field label="Notes" className="mt-4">
          <TextArea className="min-h-[90px] font-sans" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </Panel>

      <Panel title="Preview">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Subtotal" value={money(sub, cur)} />
          <Stat label={`Tax ${taxRate}%`} value={money(tax, cur)} />
          <Stat label="Total" value={money(total, cur)} />
        </div>
        <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.07] bg-white">
          <div className="max-h-[520px] overflow-auto p-6 text-black" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <Toolbar>
          <Btn variant="primary" onClick={() => printHtml(`${heading} ${ref}`, html)}>
            Print / Save as PDF
          </Btn>
          <Btn
            onClick={() =>
              downloadBlob(
                new Blob([`<!doctype html><meta charset="utf-8">${html}`], { type: "text/html" }),
                `${ref.toLowerCase()}.html`,
              )
            }
          >
            Download HTML
          </Btn>
        </Toolbar>
      </Panel>
    </>
  );
}

/* -------------------------------- resume ---------------------------------- */

function ResumeBuilder() {
  const [name, setName] = useState("Ada Lovelace");
  const [role, setRole] = useState("Senior Product Engineer");
  const [contact, setContact] = useState("ada@atlas.tools · +1 555 0142 · London");
  const [summary, setSummary] = useState(
    "Product engineer with 8 years building performant, beautiful interfaces for design-led teams.",
  );
  const [experience, setExperience] = useState(
    "Lead Engineer — Northwind (2021–now)\nShipped the design system used across 14 products.\n\nEngineer — Cobalt (2018–2021)\nBuilt the analytics dashboard from zero to 40k users.",
  );
  const [skills, setSkills] = useState("TypeScript, React, Design Systems, Motion, Accessibility");
  const [education, setEducation] = useState("BSc Computer Science — University of Manchester");

  const html = `
    <h1>${name}</h1><div class="muted">${role}<br/>${contact}</div>
    <h2>Summary</h2><div class="muted" style="white-space:pre-line">${summary}</div>
    <h2>Experience</h2><div class="muted" style="white-space:pre-line">${experience}</div>
    <h2>Skills</h2><div class="muted">${skills}</div>
    <h2>Education</h2><div class="muted" style="white-space:pre-line">${education}</div>`;

  return (
    <>
      <Panel title="Your details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Role">
            <TextInput value={role} onChange={(e) => setRole(e.target.value)} />
          </Field>
          <Field label="Contact line" className="sm:col-span-2">
            <TextInput value={contact} onChange={(e) => setContact(e.target.value)} />
          </Field>
          <Field label="Summary" className="sm:col-span-2">
            <TextArea className="min-h-[90px] font-sans" value={summary} onChange={(e) => setSummary(e.target.value)} />
          </Field>
          <Field label="Experience" className="sm:col-span-2">
            <TextArea className="min-h-[160px] font-sans" value={experience} onChange={(e) => setExperience(e.target.value)} />
          </Field>
          <Field label="Skills">
            <TextArea className="min-h-[80px] font-sans" value={skills} onChange={(e) => setSkills(e.target.value)} />
          </Field>
          <Field label="Education">
            <TextArea className="min-h-[80px] font-sans" value={education} onChange={(e) => setEducation(e.target.value)} />
          </Field>
        </div>
      </Panel>
      <Panel title="Preview">
        <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-white">
          <div className="max-h-[560px] overflow-auto p-6 text-black" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <Toolbar>
          <Btn variant="primary" onClick={() => printHtml(`${name} — Resume`, html)}>
            Print / Save as PDF
          </Btn>
          <Btn
            onClick={() =>
              downloadBlob(new Blob([`<!doctype html><meta charset="utf-8">${html}`], { type: "text/html" }), "resume.html")
            }
          >
            Download HTML
          </Btn>
        </Toolbar>
      </Panel>
    </>
  );
}

/* ---------------------------- business card ------------------------------- */

function BusinessCardMaker() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [name, setName] = useState("Ada Lovelace");
  const [role, setRole] = useState("Product Engineer");
  const [company, setCompany] = useState("Atlas Studio");
  const [details, setDetails] = useState("ada@atlas.tools · +1 555 0142");
  const [accent, setAccent] = useState("#7C5CFF");

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    c.width = 1050;
    c.height = 600;
    const g = ctx.createLinearGradient(0, 0, 1050, 600);
    g.addColorStop(0, "#0b0a14");
    g.addColorStop(1, "#161232");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1050, 600);
    ctx.fillStyle = accent;
    ctx.fillRect(0, 0, 12, 600);
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 58px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(name, 70, 260);
    ctx.fillStyle = accent;
    ctx.font = "500 30px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(role, 70, 312);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.font = "400 26px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(company, 70, 372);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "400 24px ui-sans-serif, system-ui, sans-serif";
    ctx.fillText(details, 70, 500);
  }, [name, role, company, details, accent]);

  return (
    <>
      <Panel title="Card details">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Role">
            <TextInput value={role} onChange={(e) => setRole(e.target.value)} />
          </Field>
          <Field label="Company">
            <TextInput value={company} onChange={(e) => setCompany(e.target.value)} />
          </Field>
          <Field label="Contact details">
            <TextInput value={details} onChange={(e) => setDetails(e.target.value)} />
          </Field>
          <Field label="Accent colour">
            <TextInput type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-11 p-1" />
          </Field>
        </div>
      </Panel>
      <Panel title="Preview">
        <canvas ref={ref} className="w-full rounded-xl border border-white/[0.07]" />
        <Toolbar>
          <Btn
            variant="primary"
            onClick={() => ref.current?.toBlob((b) => b && downloadBlob(b, "business-card.png"), "image/png")}
          >
            Download PNG
          </Btn>
        </Toolbar>
      </Panel>
    </>
  );
}

/* --------------------------------- codes ---------------------------------- */

function BarcodeGenerator() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [value, setValue] = useState("ATLAS-2026");
  const [format, setFormat] = useState("CODE128");
  const [error, setError] = useState("");

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    try {
      JsBarcode(el, value || " ", {
        format,
        background: "#ffffff",
        lineColor: "#000000",
        width: 2,
        height: 90,
        displayValue: true,
      });
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "That value is not valid for this format.");
    }
  }, [value, format]);

  const download = () => {
    const el = svgRef.current;
    if (!el) return;
    downloadBlob(new Blob([new XMLSerializer().serializeToString(el)], { type: "image/svg+xml" }), "barcode.svg");
  };

  return (
    <>
      <Panel title="Barcode">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Value">
            <TextInput value={value} onChange={(e) => setValue(e.target.value)} />
          </Field>
          <Field label="Format">
            <Select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              options={[
                { value: "CODE128", label: "CODE128" },
                { value: "CODE39", label: "CODE39" },
                { value: "EAN13", label: "EAN-13 (13 digits)" },
                { value: "EAN8", label: "EAN-8 (8 digits)" },
                { value: "UPC", label: "UPC (12 digits)" },
                { value: "ITF14", label: "ITF-14" },
              ]}
            />
          </Field>
        </div>
      </Panel>
      <Panel title="Result">
        <div className="flex min-h-[160px] items-center justify-center rounded-xl bg-white p-4">
          <svg ref={svgRef} />
        </div>
        {error ? <Note>{error}</Note> : null}
        <Toolbar>
          <Btn variant="primary" onClick={download} disabled={!!error}>
            Download SVG
          </Btn>
        </Toolbar>
      </Panel>
    </>
  );
}

function QrGenerator() {
  const [text, setText] = useState("https://atlas.tools");
  const [size, setSize] = useState(320);
  const [url, setUrl] = useState("");

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(text || " ", { width: size, margin: 1, color: { dark: "#000000", light: "#ffffff" } })
      .then((d) => alive && setUrl(d))
      .catch(() => alive && setUrl(""));
    return () => {
      alive = false;
    };
  }, [text, size]);

  return (
    <>
      <Panel title="Content">
        <Field label="Text or URL">
          <TextArea className="min-h-[100px]" value={text} onChange={(e) => setText(e.target.value)} />
        </Field>
        <div className="mt-4">
          <Range label="Size" min={160} max={720} step={20} value={size} suffix="px" onChange={(e) => setSize(+e.target.value)} />
        </div>
      </Panel>
      <Panel title="Result">
        <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-white p-4">
          {url ? <img src={url} alt="QR code" className="max-w-full" width={size} height={size} /> : null}
        </div>
        <Toolbar>
          <Btn
            variant="primary"
            disabled={!url}
            onClick={async () => {
              const blob = await (await fetch(url)).blob();
              downloadBlob(blob, "qr-code.png");
            }}
          >
            Download PNG
          </Btn>
          <CopyButton value={text} label="Copy content" />
        </Toolbar>
      </Panel>
    </>
  );
}

/* ------------------------------- calculators ------------------------------ */

function ProfitCalculator() {
  const [cost, setCost] = useState("40");
  const [price, setPrice] = useState("65");
  const [units, setUnits] = useState("100");
  const c = +cost || 0;
  const p = +price || 0;
  const u = +units || 0;
  const profitUnit = p - c;
  const margin = p ? (profitUnit / p) * 100 : 0;
  const markup = c ? (profitUnit / c) * 100 : 0;
  return (
    <>
      <Panel title="Inputs">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Cost per unit">
            <TextInput inputMode="decimal" value={cost} onChange={(e) => setCost(e.target.value)} />
          </Field>
          <Field label="Selling price">
            <TextInput inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} />
          </Field>
          <Field label="Units sold">
            <TextInput inputMode="decimal" value={units} onChange={(e) => setUnits(e.target.value)} />
          </Field>
        </div>
      </Panel>
      <Panel title="Result">
        <div className="grid gap-3 sm:grid-cols-4">
          <Stat label="Profit / unit" value={profitUnit.toFixed(2)} />
          <Stat label="Margin" value={`${margin.toFixed(1)}%`} />
          <Stat label="Markup" value={`${markup.toFixed(1)}%`} />
          <Stat label="Total profit" value={(profitUnit * u).toFixed(2)} />
        </div>
      </Panel>
    </>
  );
}

function TaxCalculator() {
  const [amount, setAmount] = useState("5000");
  const [rate, setRate] = useState(20);
  const a = +amount || 0;
  const tax = (a * rate) / 100;
  return (
    <>
      <Panel title="Inputs">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Gross amount">
            <TextInput inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Range label="Tax rate" min={0} max={60} value={rate} suffix="%" onChange={(e) => setRate(+e.target.value)} />
        </div>
      </Panel>
      <Panel title="Result">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Tax" value={tax.toFixed(2)} />
          <Stat label="Net after tax" value={(a - tax).toFixed(2)} />
          <Stat label="Effective rate" value={`${rate.toFixed(1)}%`} />
        </div>
      </Panel>
    </>
  );
}

function GstCalculator() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState("add");
  const a = +amount || 0;
  const r = +rate || 0;
  const { base, gst, total } = useMemo(() => {
    if (mode === "add") {
      const g = (a * r) / 100;
      return { base: a, gst: g, total: a + g };
    }
    const b = a / (1 + r / 100);
    return { base: b, gst: a - b, total: a };
  }, [a, r, mode]);
  return (
    <>
      <Panel title="Inputs">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Amount">
            <TextInput inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <Field label="GST rate %">
            <TextInput inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} />
          </Field>
          <Field label="Mode">
            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              options={[
                { value: "add", label: "Add GST (exclusive)" },
                { value: "remove", label: "Remove GST (inclusive)" },
              ]}
            />
          </Field>
        </div>
      </Panel>
      <Panel title="Result">
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Base amount" value={base.toFixed(2)} />
          <Stat label="GST" value={gst.toFixed(2)} />
          <Stat label="Total" value={total.toFixed(2)} />
        </div>
        <Output value={`Base: ${base.toFixed(2)}\nGST (${r}%): ${gst.toFixed(2)}\nTotal: ${total.toFixed(2)}`} />
      </Panel>
    </>
  );
}

export const tools: Record<string, ToolComponent> = {
  "invoice-generator": () => <DocTool kind="INV" heading="Invoice" partyLabel="Bill to" />,
  "receipt-generator": () => <DocTool kind="RCP" heading="Receipt" partyLabel="Received from" />,
  "quotation-generator": () => <DocTool kind="QTE" heading="Quotation" partyLabel="Prepared for" />,
  "resume-builder": ResumeBuilder,
  "business-card-maker": BusinessCardMaker,
  "barcode-generator": BarcodeGenerator,
  "qr-generator": QrGenerator,
  "profit-calculator": ProfitCalculator,
  "tax-calculator": TaxCalculator,
  "business-gst-calculator": GstCalculator,
};
