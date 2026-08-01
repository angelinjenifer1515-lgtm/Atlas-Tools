import { useState } from "react";
import { Btn, CopyButton, Field, Grid, Note, Output, Panel, Select, TextArea, TextInput, Toolbar } from "../ui";
import type { ToolComponent } from "@/lib/tools/loader";

function AiTool({
  inputLabel,
  placeholder,
  options,
  generate,
}: {
  inputLabel: string;
  placeholder: string;
  options?: { label: string; values: string[] };
  generate: (input: string, option: string) => string;
}) {
  const [input, setInput] = useState("");
  const [option, setOption] = useState(options?.values[0] ?? "");
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState("");

  return (
    <Grid>
      <Panel title={inputLabel}>
        <TextArea value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} />
        {options ? (
          <div className="mt-4">
            <Field label={options.label}>
              <Select
                value={option}
                onChange={(e) => setOption(e.target.value)}
                options={options.values.map((v) => ({ value: v, label: v }))}
              />
            </Field>
          </div>
        ) : null}
        <Toolbar>
          <Btn
            variant="primary"
            disabled={!input.trim() || busy}
            onClick={() => {
              setBusy(true);
              setOut("");
              setTimeout(() => {
                setOut(generate(input.trim(), option));
                setBusy(false);
              }, 1200);
            }}
          >
            {busy ? "Generating…" : "Generate"}
          </Btn>
          <Btn onClick={() => { setInput(""); setOut(""); }}>Reset</Btn>
        </Toolbar>
      </Panel>
      <Panel title="Output">
        {busy ? (
          <div className="space-y-2">
            {[100, 92, 80, 96, 64].map((w, i) => (
              <div key={i} className="h-3 animate-pulse rounded bg-white/10" style={{ width: `${w}%` }} />
            ))}
          </div>
        ) : (
          <Output value={out} mono={false} />
        )}
        <Toolbar>
          <CopyButton value={out} />
        </Toolbar>
        <Note>Interface preview — output is generated locally from your input, with no AI service involved.</Note>
      </Panel>
    </Grid>
  );
}

const firstSentences = (s: string, n: number) =>
  (s.match(/[^.!?]+[.!?]*/g) ?? [s]).slice(0, n).map((x) => x.trim()).join(" ");

const keywords = (s: string, n = 6) =>
  Array.from(new Set(s.toLowerCase().match(/[a-z]{4,}/g) ?? [])).slice(0, n);

export const tools: Record<string, ToolComponent> = {
  "ai-summarizer": () => (
    <AiTool
      inputLabel="Text to summarize"
      placeholder="Paste an article, report or transcript…"
      options={{ label: "Length", values: ["Short", "Medium", "Detailed"] }}
      generate={(s, o) =>
        `Summary (${o.toLowerCase()}):\n\n${firstSentences(s, o === "Short" ? 1 : o === "Medium" ? 3 : 5)}\n\nKey points:\n${keywords(s)
          .map((k) => `• ${k.charAt(0).toUpperCase() + k.slice(1)}`)
          .join("\n")}`
      }
    />
  ),
  "grammar-checker": () => (
    <AiTool
      inputLabel="Text to check"
      placeholder="Paste text to proofread…"
      generate={(s) =>
        `Suggested revision:\n\n${s.replace(/\s{2,}/g, " ").replace(/\bi\b/g, "I").replace(/([.!?])\s*([a-z])/g, (_, p, c) => `${p} ${c.toUpperCase()}`)}\n\nNotes:\n• Sentence casing normalised\n• Double spacing collapsed\n• Readability: ${s.split(/\s+/).length > 40 ? "consider shorter sentences" : "clear"}`
      }
    />
  ),
  "rewrite-text": () => (
    <AiTool
      inputLabel="Text to rewrite"
      placeholder="Paste the text you want rephrased…"
      options={{ label: "Tone", values: ["Professional", "Friendly", "Concise", "Persuasive"] }}
      generate={(s, tone) => `${tone} rewrite:\n\n${s}\n\n(Adjusted for a ${tone.toLowerCase()} tone.)`}
    />
  ),
  "email-writer": () => (
    <AiTool
      inputLabel="What is the email about?"
      placeholder="Follow up with a client about the invoice…"
      options={{ label: "Tone", values: ["Professional", "Warm", "Direct"] }}
      generate={(s, tone) =>
        `Subject: ${s.split(" ").slice(0, 6).join(" ")}\n\nHi there,\n\nI'm reaching out regarding ${s}. ${tone === "Direct" ? "Could you confirm the next step?" : "I'd love to hear your thoughts when you get a moment."}\n\nBest regards,\nYour name`
      }
    />
  ),
  "caption-generator": () => (
    <AiTool
      inputLabel="Describe your post"
      placeholder="Sunset run along the coast…"
      options={{ label: "Platform", values: ["Instagram", "LinkedIn", "X"] }}
      generate={(s, p) => [1, 2, 3].map((i) => `${i}. ${s} — ${p === "LinkedIn" ? "lessons from the day." : "and it felt unreal. ✨"}`).join("\n")}
    />
  ),
  "hashtag-generator": () => (
    <AiTool
      inputLabel="Topic"
      placeholder="minimal workspace setup"
      generate={(s) => keywords(s, 10).map((k) => `#${k}`).join(" ") + " #atlastools #productivity #design"}
    />
  ),
  "blog-title-generator": () => (
    <AiTool
      inputLabel="Topic"
      placeholder="browser based productivity tools"
      generate={(s) =>
        [
          `The Complete Guide to ${s}`,
          `${s}: What Most People Get Wrong`,
          `7 Ways to Master ${s} This Year`,
          `Why ${s} Is Quietly Changing Everything`,
          `${s}, Explained Simply`,
        ].join("\n")
      }
    />
  ),
  "prompt-generator": () => (
    <AiTool
      inputLabel="What do you want the AI to do?"
      placeholder="write landing page copy for a design studio"
      options={{ label: "Style", values: ["Structured", "Creative", "Technical"] }}
      generate={(s, style) =>
        `Role: You are an expert assistant.\nTask: ${s}.\nStyle: ${style}.\nConstraints:\n• Be specific and concrete\n• Avoid filler language\n• Return the result only\nOutput format: markdown`
      }
    />
  ),
  "product-description-generator": () => (
    <AiTool
      inputLabel="Product details"
      placeholder="ceramic pour-over coffee dripper, matte black"
      generate={(s) =>
        `${s.charAt(0).toUpperCase() + s.slice(1)}.\n\nDesigned for people who care about the details. Built to last, easy to live with, and quietly beautiful on any surface.\n\n• Premium materials\n• Thoughtful, minimal design\n• Made for everyday use`
      }
    />
  ),
  translator: () => (
    <AiTool
      inputLabel="Text to translate"
      placeholder="Type something to translate…"
      options={{ label: "Target language", values: ["Spanish", "French", "German", "Hindi", "Japanese"] }}
      generate={(s, lang) => `[${lang}]\n\n${s}\n\n(Translation preview — connect a translation service for live results.)`}
    />
  ),
};

export { TextInput };
