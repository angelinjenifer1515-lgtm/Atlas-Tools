import { useMemo, useState } from "react";
import { Btn, CopyButton, Field, Grid, Note, Output, Panel, Select, Stat, TextInput, Toolbar } from "../ui";
import type { ToolComponent } from "@/lib/tools/loader";

function Calc({ inputs, result }: { inputs: React.ReactNode; result: React.ReactNode }) {
  return (
    <Grid>
      <Panel title="Inputs">{inputs}</Panel>
      <Panel title="Result">{result}</Panel>
    </Grid>
  );
}

const num = (v: string) => (v.trim() === "" ? NaN : Number(v));
const money = (n: number) => (Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—");

function AgeCalculator() {
  const [dob, setDob] = useState("1995-06-15");
  const r = useMemo(() => {
    const d = new Date(dob);
    if (Number.isNaN(+d)) return null;
    const now = new Date();
    let y = now.getFullYear() - d.getFullYear();
    let m = now.getMonth() - d.getMonth();
    let day = now.getDate() - d.getDate();
    if (day < 0) { m--; day += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    const days = Math.floor((+now - +d) / 86400000);
    return { y, m, day, days };
  }, [dob]);
  return (
    <Calc
      inputs={
        <Field label="Date of birth">
          <TextInput type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        </Field>
      }
      result={
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Years" value={r?.y ?? "—"} />
          <Stat label="Months" value={r?.m ?? "—"} />
          <Stat label="Days" value={r?.day ?? "—"} />
          <Stat label="Total days" value={r ? r.days.toLocaleString() : "—"} />
        </div>
      }
    />
  );
}

function BmiCalculator() {
  const [kg, setKg] = useState("70");
  const [cm, setCm] = useState("175");
  const bmi = num(kg) / (num(cm) / 100) ** 2;
  const band = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Healthy" : bmi < 30 ? "Overweight" : "Obese";
  return (
    <Calc
      inputs={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Weight (kg)"><TextInput value={kg} inputMode="decimal" onChange={(e) => setKg(e.target.value)} /></Field>
          <Field label="Height (cm)"><TextInput value={cm} inputMode="decimal" onChange={(e) => setCm(e.target.value)} /></Field>
        </div>
      }
      result={
        <div className="grid grid-cols-2 gap-3">
          <Stat label="BMI" value={Number.isFinite(bmi) ? bmi.toFixed(1) : "—"} />
          <Stat label="Category" value={Number.isFinite(bmi) ? band : "—"} />
        </div>
      }
    />
  );
}

function PercentageCalculator() {
  const [a, setA] = useState("25");
  const [b, setB] = useState("200");
  return (
    <Calc
      inputs={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Value A"><TextInput value={a} inputMode="decimal" onChange={(e) => setA(e.target.value)} /></Field>
          <Field label="Value B"><TextInput value={b} inputMode="decimal" onChange={(e) => setB(e.target.value)} /></Field>
        </div>
      }
      result={
        <div className="grid grid-cols-1 gap-3">
          <Stat label={`${a}% of ${b}`} value={money((num(a) / 100) * num(b))} />
          <Stat label={`${a} is what % of ${b}`} value={`${money((num(a) / num(b)) * 100)}%`} />
          <Stat label="Change A → B" value={`${money(((num(b) - num(a)) / num(a)) * 100)}%`} />
        </div>
      }
    />
  );
}

function ScientificCalculator() {
  const [expr, setExpr] = useState("sqrt(144) + sin(pi/2) * 10");
  const value = useMemo(() => {
    if (!expr.trim()) return "";
    const safe = expr.replace(/[^0-9+\-*/(). ,a-z^]/gi, "");
    const js = safe
      .replace(/\bpi\b/g, "Math.PI")
      .replace(/\be\b/g, "Math.E")
      .replace(/\b(sqrt|sin|cos|tan|log|abs|round|floor|ceil|pow|min|max)\(/g, "Math.$1(")
      .replace(/\^/g, "**");
    try {
      // eslint-disable-next-line no-new-func
      const out = Function(`"use strict";return (${js})`)();
      return typeof out === "number" && Number.isFinite(out) ? String(out) : "—";
    } catch {
      return "—";
    }
  }, [expr]);
  return (
    <Calc
      inputs={
        <>
          <Field label="Expression"><TextInput value={expr} onChange={(e) => setExpr(e.target.value)} /></Field>
          <Note>Supports + - * / ^, parentheses, pi, e, sqrt, sin, cos, tan, log, abs, round, pow.</Note>
        </>
      }
      result={
        <>
          <Stat label="Result" value={value} />
          <Toolbar><CopyButton value={value} /></Toolbar>
        </>
      }
    />
  );
}

function LoanCalculator({ title = "Monthly payment" }: { title?: string }) {
  const [amount, setAmount] = useState("250000");
  const [rate, setRate] = useState("7.5");
  const [years, setYears] = useState("20");
  const r = num(rate) / 100 / 12;
  const n = num(years) * 12;
  const pmt = r === 0 ? num(amount) / n : (num(amount) * r) / (1 - Math.pow(1 + r, -n));
  return (
    <Calc
      inputs={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount"><TextInput value={amount} inputMode="decimal" onChange={(e) => setAmount(e.target.value)} /></Field>
          <Field label="Interest rate (%)"><TextInput value={rate} inputMode="decimal" onChange={(e) => setRate(e.target.value)} /></Field>
          <Field label="Term (years)"><TextInput value={years} inputMode="decimal" onChange={(e) => setYears(e.target.value)} /></Field>
        </div>
      }
      result={
        <div className="grid grid-cols-1 gap-3">
          <Stat label={title} value={money(pmt)} />
          <Stat label="Total repaid" value={money(pmt * n)} />
          <Stat label="Total interest" value={money(pmt * n - num(amount))} />
        </div>
      }
    />
  );
}

function GstCalculator() {
  const [amount, setAmount] = useState("1000");
  const [rate, setRate] = useState("18");
  const [mode, setMode] = useState("add");
  const a = num(amount);
  const p = num(rate) / 100;
  const base = mode === "add" ? a : a / (1 + p);
  const tax = mode === "add" ? a * p : a - base;
  return (
    <Calc
      inputs={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount"><TextInput value={amount} inputMode="decimal" onChange={(e) => setAmount(e.target.value)} /></Field>
          <Field label="Rate (%)"><TextInput value={rate} inputMode="decimal" onChange={(e) => setRate(e.target.value)} /></Field>
          <Field label="Mode">
            <Select value={mode} onChange={(e) => setMode(e.target.value)} options={[{ value: "add", label: "Add GST" }, { value: "remove", label: "Remove GST" }]} />
          </Field>
        </div>
      }
      result={
        <div className="grid grid-cols-1 gap-3">
          <Stat label="Base amount" value={money(base)} />
          <Stat label="Tax" value={money(tax)} />
          <Stat label="Total" value={money(base + tax)} />
        </div>
      }
    />
  );
}

function DiscountCalculator() {
  const [price, setPrice] = useState("2400");
  const [off, setOff] = useState("30");
  const final = num(price) * (1 - num(off) / 100);
  return (
    <Calc
      inputs={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Original price"><TextInput value={price} inputMode="decimal" onChange={(e) => setPrice(e.target.value)} /></Field>
          <Field label="Discount (%)"><TextInput value={off} inputMode="decimal" onChange={(e) => setOff(e.target.value)} /></Field>
        </div>
      }
      result={
        <div className="grid grid-cols-1 gap-3">
          <Stat label="Final price" value={money(final)} />
          <Stat label="You save" value={money(num(price) - final)} />
        </div>
      }
    />
  );
}

const RATES: Record<string, number> = { USD: 1, EUR: 0.92, GBP: 0.78, INR: 83.2, JPY: 151.4, AUD: 1.52, CAD: 1.36 };

function CurrencyConverter() {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const out = (num(amount) / RATES[from]) * RATES[to];
  const opts = Object.keys(RATES).map((c) => ({ value: c, label: c }));
  return (
    <Calc
      inputs={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount"><TextInput value={amount} inputMode="decimal" onChange={(e) => setAmount(e.target.value)} /></Field>
          <Field label="From"><Select value={from} onChange={(e) => setFrom(e.target.value)} options={opts} /></Field>
          <Field label="To"><Select value={to} onChange={(e) => setTo(e.target.value)} options={opts} /></Field>
        </div>
      }
      result={
        <>
          <Stat label={`${amount} ${from} =`} value={`${money(out)} ${to}`} />
          <Note>Indicative static rates for planning only — not live market data.</Note>
        </>
      }
    />
  );
}

function DateDifference() {
  const [a, setA] = useState("2024-01-01");
  const [b, setB] = useState("2026-01-01");
  const days = Math.round((+new Date(b) - +new Date(a)) / 86400000);
  return (
    <Calc
      inputs={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Start date"><TextInput type="date" value={a} onChange={(e) => setA(e.target.value)} /></Field>
          <Field label="End date"><TextInput type="date" value={b} onChange={(e) => setB(e.target.value)} /></Field>
        </div>
      }
      result={
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Days" value={Number.isFinite(days) ? days.toLocaleString() : "—"} />
          <Stat label="Weeks" value={Number.isFinite(days) ? (days / 7).toFixed(1) : "—"} />
          <Stat label="Months" value={Number.isFinite(days) ? (days / 30.44).toFixed(1) : "—"} />
          <Stat label="Years" value={Number.isFinite(days) ? (days / 365.25).toFixed(2) : "—"} />
        </div>
      }
    />
  );
}

const ZONES = ["UTC", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Kolkata", "Asia/Tokyo", "Australia/Sydney"];

function TimezoneConverter() {
  const [time, setTime] = useState(() => new Date().toISOString().slice(0, 16));
  const d = new Date(time);
  return (
    <Calc
      inputs={<Field label="Local date & time"><TextInput type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} /></Field>}
      result={
        <div className="space-y-2 text-[13px]">
          {ZONES.map((z) => (
            <div key={z} className="flex justify-between rounded-xl bg-white/[0.03] px-3 py-2">
              <span className="text-white/60">{z.replace("_", " ")}</span>
              <span className="font-mono text-white/85">
                {Number.isNaN(+d) ? "—" : d.toLocaleString(undefined, { timeZone: z, dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
          ))}
        </div>
      }
    />
  );
}

const UNITS: Record<string, Record<string, number>> = {
  Length: { Metres: 1, Kilometres: 1000, Centimetres: 0.01, Miles: 1609.34, Feet: 0.3048, Inches: 0.0254 },
  Weight: { Kilograms: 1, Grams: 0.001, Pounds: 0.453592, Ounces: 0.0283495, Tonnes: 1000 },
  Area: { "Square metres": 1, Hectares: 10000, "Square feet": 0.092903, Acres: 4046.86 },
  Volume: { Litres: 1, Millilitres: 0.001, "Cubic metres": 1000, Gallons: 3.78541 },
  Speed: { "m/s": 1, "km/h": 0.277778, mph: 0.44704, Knots: 0.514444 },
  Pressure: { Pascal: 1, Bar: 100000, PSI: 6894.76, Atmosphere: 101325 },
  Storage: { Bytes: 1, KB: 1024, MB: 1048576, GB: 1073741824, TB: 1099511627776 },
  Power: { Watts: 1, Kilowatts: 1000, Horsepower: 745.7 },
};

function UnitConverter() {
  const [cat, setCat] = useState("Length");
  const [from, setFrom] = useState("Metres");
  const [to, setTo] = useState("Feet");
  const [value, setValue] = useState("1");
  const isTemp = cat === "Temperature";
  const map = UNITS[cat] ?? UNITS.Length;
  const opts = Object.keys(map).map((k) => ({ value: k, label: k }));
  const converted = isTemp ? NaN : (num(value) * (map[from] ?? 1)) / (map[to] ?? 1);
  return (
    <Calc
      inputs={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <Select
              value={cat}
              onChange={(e) => {
                const c = e.target.value;
                setCat(c);
                const keys = Object.keys(UNITS[c]);
                setFrom(keys[0]);
                setTo(keys[1] ?? keys[0]);
              }}
              options={Object.keys(UNITS).map((k) => ({ value: k, label: k }))}
            />
          </Field>
          <Field label="Value"><TextInput value={value} inputMode="decimal" onChange={(e) => setValue(e.target.value)} /></Field>
          <Field label="From"><Select value={from} onChange={(e) => setFrom(e.target.value)} options={opts} /></Field>
          <Field label="To"><Select value={to} onChange={(e) => setTo(e.target.value)} options={opts} /></Field>
        </div>
      }
      result={<Stat label={`${value} ${from} =`} value={`${money(converted)} ${to}`} />}
    />
  );
}

function TemperatureNote() {
  const [c, setC] = useState("25");
  const v = num(c);
  return (
    <Calc
      inputs={<Field label="Celsius"><TextInput value={c} inputMode="decimal" onChange={(e) => setC(e.target.value)} /></Field>}
      result={
        <div className="grid grid-cols-1 gap-3">
          <Stat label="Fahrenheit" value={money(v * 1.8 + 32)} />
          <Stat label="Kelvin" value={money(v + 273.15)} />
        </div>
      }
    />
  );
}

export const tools: Record<string, ToolComponent> = {
  "age-calculator": AgeCalculator,
  "bmi-calculator": BmiCalculator,
  "percentage-calculator": PercentageCalculator,
  "scientific-calculator": ScientificCalculator,
  "loan-calculator": () => <LoanCalculator />,
  "emi-calculator": () => <LoanCalculator title="EMI" />,
  "gst-calculator": GstCalculator,
  "discount-calculator": DiscountCalculator,
  "currency-converter": CurrencyConverter,
  "date-difference": DateDifference,
  "timezone-converter": TimezoneConverter,
  "unit-converter": () => (
    <>
      <UnitConverter />
      <Panel title="Temperature">
        <TemperatureNote />
      </Panel>
    </>
  ),
};

export { Output };
