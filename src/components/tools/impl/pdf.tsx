import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { Btn, Grid, Note, Panel, Range, Select, Field, TextInput, Toolbar, UploadArea, downloadBlob } from "../ui";
import type { ToolComponent } from "@/lib/tools/loader";

const pdfBlob = (bytes: Uint8Array) =>
  new Blob([bytes.slice().buffer as ArrayBuffer], { type: "application/pdf" });

function usePdfFiles(multiple = false) {
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Could not process that PDF.");
    }
    setBusy(false);
  };
  return { files, setFiles, busy, run, multiple };
}

function PdfShell({
  hint,
  accept = "application/pdf",
  multiple,
  files,
  setFiles,
  settings,
  action,
  busy,
  note,
}: {
  hint: string;
  accept?: string;
  multiple?: boolean;
  files: File[];
  setFiles: (f: File[]) => void;
  settings?: React.ReactNode;
  action: React.ReactNode;
  busy: boolean;
  note?: string;
}) {
  return (
    <>
      <Panel title="Upload">
        <UploadArea accept={accept} multiple={multiple} hint={hint} onFiles={(f) => setFiles(multiple ? [...files, ...f] : f.slice(0, 1))} files={files} />
      </Panel>
      {settings ? <Panel title="Settings">{settings}</Panel> : null}
      <Panel title="Result">
        <p className="text-[13px] text-white/50">
          {busy ? "Processing your document…" : files.length ? "Ready. Run the tool to get your file." : "Add a document to begin."}
        </p>
        <Toolbar>
          {action}
          <Btn onClick={() => setFiles([])}>Reset</Btn>
        </Toolbar>
        {note ? <Note>{note}</Note> : null}
      </Panel>
    </>
  );
}

function MergePdf() {
  const s = usePdfFiles(true);
  return (
    <PdfShell
      hint="Drop two or more PDFs to merge"
      multiple
      files={s.files}
      setFiles={s.setFiles}
      busy={s.busy}
      action={
        <Btn
          variant="primary"
          disabled={s.files.length < 2 || s.busy}
          onClick={() =>
            s.run(async () => {
              const out = await PDFDocument.create();
              for (const f of s.files) {
                const src = await PDFDocument.load(await f.arrayBuffer());
                const pages = await out.copyPages(src, src.getPageIndices());
                pages.forEach((p) => out.addPage(p));
              }
              downloadBlob(pdfBlob(await out.save()), "merged.pdf");
            })
          }
        >
          Merge PDFs
        </Btn>
      }
    />
  );
}

function SplitPdf() {
  const s = usePdfFiles();
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("1");
  return (
    <PdfShell
      hint="Drop a PDF to split"
      files={s.files}
      setFiles={s.setFiles}
      busy={s.busy}
      settings={
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="From page">
            <TextInput value={from} inputMode="numeric" onChange={(e) => setFrom(e.target.value)} />
          </Field>
          <Field label="To page">
            <TextInput value={to} inputMode="numeric" onChange={(e) => setTo(e.target.value)} />
          </Field>
        </div>
      }
      action={
        <Btn
          variant="primary"
          disabled={!s.files.length || s.busy}
          onClick={() =>
            s.run(async () => {
              const src = await PDFDocument.load(await s.files[0].arrayBuffer());
              const out = await PDFDocument.create();
              const a = Math.max(1, parseInt(from) || 1) - 1;
              const b = Math.min(src.getPageCount(), parseInt(to) || 1) - 1;
              const idx = [];
              for (let i = a; i <= b; i++) idx.push(i);
              const pages = await out.copyPages(src, idx);
              pages.forEach((p) => out.addPage(p));
              downloadBlob(pdfBlob(await out.save()), "split.pdf");
            })
          }
        >
          Extract range
        </Btn>
      }
    />
  );
}

function RotatePdf() {
  const s = usePdfFiles();
  const [angle, setAngle] = useState("90");
  return (
    <PdfShell
      hint="Drop a PDF to rotate"
      files={s.files}
      setFiles={s.setFiles}
      busy={s.busy}
      settings={
        <Field label="Rotation">
          <Select
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            options={[
              { value: "90", label: "90° clockwise" },
              { value: "180", label: "180°" },
              { value: "270", label: "270°" },
            ]}
          />
        </Field>
      }
      action={
        <Btn
          variant="primary"
          disabled={!s.files.length || s.busy}
          onClick={() =>
            s.run(async () => {
              const doc = await PDFDocument.load(await s.files[0].arrayBuffer());
              doc.getPages().forEach((p) => p.setRotation(degrees((p.getRotation().angle + +angle) % 360)));
              downloadBlob(pdfBlob(await doc.save()), "rotated.pdf");
            })
          }
        >
          Rotate PDF
        </Btn>
      }
    />
  );
}

function DeletePages() {
  const s = usePdfFiles();
  const [pages, setPages] = useState("2,3");
  return (
    <PdfShell
      hint="Drop a PDF"
      files={s.files}
      setFiles={s.setFiles}
      busy={s.busy}
      settings={
        <Field label="Pages to delete (comma separated)">
          <TextInput value={pages} onChange={(e) => setPages(e.target.value)} />
        </Field>
      }
      action={
        <Btn
          variant="primary"
          disabled={!s.files.length || s.busy}
          onClick={() =>
            s.run(async () => {
              const doc = await PDFDocument.load(await s.files[0].arrayBuffer());
              const drop = pages
                .split(",")
                .map((p) => parseInt(p.trim()) - 1)
                .filter((n) => n >= 0)
                .sort((a, b) => b - a);
              drop.forEach((i) => i < doc.getPageCount() && doc.removePage(i));
              downloadBlob(pdfBlob(await doc.save()), "edited.pdf");
            })
          }
        >
          Delete pages
        </Btn>
      }
    />
  );
}

function JpgToPdf() {
  const s = usePdfFiles(true);
  return (
    <PdfShell
      hint="Drop JPG or PNG images"
      accept="image/jpeg,image/png"
      multiple
      files={s.files}
      setFiles={s.setFiles}
      busy={s.busy}
      action={
        <Btn
          variant="primary"
          disabled={!s.files.length || s.busy}
          onClick={() =>
            s.run(async () => {
              const doc = await PDFDocument.create();
              for (const f of s.files) {
                const bytes = await f.arrayBuffer();
                const img = f.type === "image/png" ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
                const page = doc.addPage([img.width, img.height]);
                page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
              }
              downloadBlob(pdfBlob(await doc.save()), "images.pdf");
            })
          }
        >
          Create PDF
        </Btn>
      }
    />
  );
}

function PdfViewer() {
  const [url, setUrl] = useState("");
  return (
    <>
      <Panel title="Open a PDF">
        <UploadArea
          accept="application/pdf"
          hint="Drop a PDF to read it"
          onFiles={(f) => f[0] && setUrl(URL.createObjectURL(f[0]))}
        />
      </Panel>
      <Panel title="Viewer">
        {url ? (
          <iframe title="PDF preview" src={url} className="h-[70vh] w-full rounded-xl border border-white/[0.07] bg-black/30" />
        ) : (
          <div className="flex h-[300px] items-center justify-center rounded-xl border border-white/[0.07] bg-black/30 text-[13px] text-white/40">
            Your document will appear here
          </div>
        )}
        <Toolbar>
          <Btn onClick={() => setUrl("")}>Reset</Btn>
        </Toolbar>
      </Panel>
    </>
  );
}

function SimulatedPdf({ label, note }: { label: string; note: string }) {
  const s = usePdfFiles();
  const [done, setDone] = useState(false);
  return (
    <PdfShell
      hint="Drop a PDF"
      files={s.files}
      setFiles={(f) => {
        s.setFiles(f);
        setDone(false);
      }}
      busy={s.busy}
      note={note}
      action={
        <Btn
          variant="primary"
          disabled={!s.files.length || s.busy}
          onClick={() => s.run(async () => { await new Promise((r) => setTimeout(r, 1200)); setDone(true); })}
        >
          {done ? "Done ✓" : label}
        </Btn>
      }
    />
  );
}

function SignPdf() {
  const s = usePdfFiles();
  const [name, setName] = useState("Ada Lovelace");
  return (
    <PdfShell
      hint="Drop the PDF you need to sign"
      files={s.files}
      setFiles={s.setFiles}
      busy={s.busy}
      settings={
        <Field label="Signature text">
          <TextInput value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
      }
      action={
        <Btn
          variant="primary"
          disabled={!s.files.length || s.busy}
          onClick={() =>
            s.run(async () => {
              const doc = await PDFDocument.load(await s.files[0].arrayBuffer());
              const page = doc.getPages().at(-1);
              page?.drawText(name, { x: 60, y: 70, size: 22 });
              downloadBlob(pdfBlob(await doc.save()), "signed.pdf");
            })
          }
        >
          Sign & download
        </Btn>
      }
    />
  );
}

function CompressPdf() {
  const s = usePdfFiles();
  const [level, setLevel] = useState(60);
  return (
    <PdfShell
      hint="Drop a PDF to compress"
      files={s.files}
      setFiles={s.setFiles}
      busy={s.busy}
      settings={<Range label="Compression" min={10} max={90} value={level} suffix="%" onChange={(e) => setLevel(+e.target.value)} />}
      note="Structural optimisation runs locally; deep image recompression needs a server pass."
      action={
        <Btn
          variant="primary"
          disabled={!s.files.length || s.busy}
          onClick={() =>
            s.run(async () => {
              const doc = await PDFDocument.load(await s.files[0].arrayBuffer());
              downloadBlob(pdfBlob(await doc.save({ useObjectStreams: true })), "compressed.pdf");
            })
          }
        >
          Compress PDF
        </Btn>
      }
    />
  );
}

export const tools: Record<string, ToolComponent> = {
  "merge-pdf": MergePdf,
  "split-pdf": SplitPdf,
  "compress-pdf": CompressPdf,
  "rotate-pdf": RotatePdf,
  "delete-pages": DeletePages,
  "jpg-to-pdf": JpgToPdf,
  "pdf-viewer": PdfViewer,
  "sign-pdf": SignPdf,
};

export { Grid };
