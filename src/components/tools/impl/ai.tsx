import { useMemo, useState } from "react";
import { Btn, CopyButton, Field, Grid, Output, Panel, Select, TextArea, Toolbar } from "../ui";
import type { ToolComponent } from "@/lib/tools/loader";

/* --------------------------------- shared --------------------------------- */

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
  const out = useMemo(
    () => (input.trim() ? generate(input.trim(), option) : ""),
    [input, option, generate],
  );

  return (
    <Grid>
      <Panel title={inputLabel}>
        <TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
        />
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
          <Btn onClick={() => setInput("")}>Reset</Btn>
        </Toolbar>
      </Panel>
      <Panel title="Output">
        <Output value={out} mono={false} />
        <Toolbar>
          <CopyButton value={out} />
        </Toolbar>
      </Panel>
    </Grid>
  );
}

const STOP = new Set(
  "the a an and or but if then than that this these those of to in on at for with from by as is are was were be been being it its it's you your we our they their he she his her not no so such can could should would will just very really about into over under after before while there here what which who whom whose how when where why".split(
    " ",
  ),
);

const sentences = (s: string) =>
  s
    .match(/[^.!?\n]+[.!?]*/g)
    ?.map((x) => x.trim())
    .filter(Boolean) ?? [];
const words = (s: string) => s.toLowerCase().match(/[a-z''-]{2,}/g) ?? [];
const titleCase = (s: string) => s.replace(/\b[a-z]/g, (c) => c.toUpperCase());

/** Extractive summariser: term-frequency sentence scoring, original order preserved. */
function summarize(text: string, count: number) {
  const list = sentences(text);
  if (list.length <= count) return list.join(" ");
  const freq = new Map<string, number>();
  for (const w of words(text)) if (!STOP.has(w)) freq.set(w, (freq.get(w) ?? 0) + 1);
  const scored = list.map((s, i) => {
    const ws = words(s).filter((w) => !STOP.has(w));
    const score = ws.reduce((a, w) => a + (freq.get(w) ?? 0), 0) / (ws.length || 1);
    return { s, i, score: score * (i === 0 ? 1.25 : 1) };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s)
    .join(" ");
}

function keyTerms(text: string, n = 6) {
  const freq = new Map<string, number>();
  for (const w of words(text))
    if (!STOP.has(w) && w.length > 3) freq.set(w, (freq.get(w) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w]) => w);
}

/* ------------------------------ grammar engine ----------------------------- */

const MISSPELLINGS: Record<string, string> = {
  teh: "the",
  adn: "and",
  recieve: "receive",
  recieved: "received",
  seperate: "separate",
  definately: "definitely",
  occured: "occurred",
  untill: "until",
  wich: "which",
  becuase: "because",
  alot: "a lot",
  accomodate: "accommodate",
  arguement: "argument",
  calender: "calendar",
  cemetary: "cemetery",
  concious: "conscious",
  embarass: "embarrass",
  enviroment: "environment",
  existance: "existence",
  goverment: "government",
  grammer: "grammar",
  independant: "independent",
  neccessary: "necessary",
  noticable: "noticeable",
  occassion: "occasion",
  persistant: "persistent",
  posession: "possession",
  publically: "publicly",
  refered: "referred",
  relevent: "relevant",
  succesful: "successful",
  tommorow: "tomorrow",
  truely: "truly",
  wierd: "weird",
  writting: "writing",
  thier: "their",
  freind: "friend",
  beleive: "believe",
  acheive: "achieve",
  knowlege: "knowledge",
  begining: "beginning",
  commited: "committed",
  diffrent: "different",
  basicly: "basically",
  everytime: "every time",
  inspite: "in spite",
  occurence: "occurrence",
  priviledge: "privilege",
  wether: "whether",
  youre: "you're",
  dont: "don't",
  cant: "can't",
  wont: "won't",
  isnt: "isn't",
  didnt: "didn't",
  doesnt: "doesn't",
  couldnt: "couldn't",
  shouldnt: "shouldn't",
  wouldnt: "wouldn't",
  havent: "haven't",
  hasnt: "hasn't",
  wasnt: "wasn't",
  werent: "weren't",
  im: "I'm",
  ive: "I've",
  ill: "I'll",
  id: "I'd",
  lets: "let's",
  thats: "that's",
  whats: "what's",
  theres: "there's",
};

export interface GrammarIssue {
  type: string;
  detail: string;
}

export function checkGrammar(raw: string): { fixed: string; issues: GrammarIssue[] } {
  const issues: GrammarIssue[] = [];
  const add = (type: string, detail: string) => issues.push({ type, detail });
  let text = raw;

  // whitespace
  if (/[ \t]{2,}/.test(text)) {
    add("Spacing", "Collapsed repeated spaces.");
    text = text.replace(/[ \t]{2,}/g, " ");
  }
  if (/[ \t]+$/m.test(text)) {
    add("Spacing", "Removed trailing spaces at end of lines.");
    text = text.replace(/[ \t]+$/gm, "");
  }
  // space before punctuation
  if (/\s+([,.;:!?])/.test(text)) {
    add("Punctuation", "Removed space before punctuation.");
    text = text.replace(/\s+([,.;:!?])/g, "$1");
  }
  // missing space after punctuation
  if (/([,;:])(?=[A-Za-z])/.test(text) || /([.!?])(?=[A-Za-z])/.test(text)) {
    add("Punctuation", "Added a missing space after punctuation.");
    text = text.replace(/([,;:])(?=[A-Za-z])/g, "$1 ").replace(/([.!?])(?=[A-Z a-z])/g, "$1 ");
  }
  // repeated punctuation
  if (/([,.!?]){3,}/.test(text)) {
    add("Punctuation", "Reduced repeated punctuation.");
    text = text.replace(/([,.])\1+/g, "$1").replace(/([!?])\1{2,}/g, "$1");
  }
  // misspellings + contractions
  text = text.replace(/\b[A-Za-z']+\b/g, (w) => {
    const lower = w.toLowerCase();
    const fix = MISSPELLINGS[lower];
    if (!fix) return w;
    add("Spelling", `“${w}” → “${w[0] === w[0].toUpperCase() ? titleCase(fix) : fix}”`);
    return w[0] === w[0].toUpperCase() ? fix.charAt(0).toUpperCase() + fix.slice(1) : fix;
  });
  // standalone "i"
  if (/\bi\b/.test(text)) {
    add("Capitalization", "Capitalised the pronoun “I”.");
    text = text.replace(/\bi\b/g, "I");
  }
  // duplicated words
  const dup = text.match(/\b(\w+)\s+\1\b/gi);
  if (dup) {
    dup.forEach((d) => add("Repetition", `Removed duplicated word “${d.split(/\s+/)[0]}”.`));
    text = text.replace(/\b(\w+)(\s+)\1\b/gi, "$1");
  }
  // a / an
  const anFix = text
    .replace(/\ba\s+(?=[aeiouAEIOU])/g, "an ")
    .replace(/\ban\s+(?=[^aeiouAEIOU\s])/g, "a ");
  if (anFix !== text) {
    add("Grammar", "Corrected “a”/“an” before a vowel sound.");
    text = anFix;
  }
  // sentence capitalisation
  const capped = text.replace(/(^|[.!?]\s+|\n)([a-z])/g, (_m, p, c: string) => p + c.toUpperCase());
  if (capped !== text) {
    add("Capitalization", "Capitalised the first letter of sentences.");
    text = capped;
  }
  // terminal punctuation
  const trimmed = text.trimEnd();
  if (trimmed && !/[.!?…"')\]]$/.test(trimmed)) {
    add("Punctuation", "Added missing punctuation at the end.");
    text = `${trimmed}.`;
  } else {
    text = trimmed;
  }
  // readability advisories
  sentences(text).forEach((s) => {
    const n = s.split(/\s+/).length;
    if (n > 32) add("Readability", `Long sentence (${n} words) — consider splitting it.`);
  });
  const passive = text.match(/\b(?:is|are|was|were|been|being)\s+\w+(?:ed|en)\b/gi);
  if (passive)
    add(
      "Style",
      `${passive.length} possible passive construction${passive.length > 1 ? "s" : ""} found.`,
    );
  const fillers = text.match(/\b(very|really|just|actually|basically|literally)\b/gi);
  if (fillers)
    add(
      "Style",
      `Filler words used ${fillers.length}×: ${[...new Set(fillers.map((f) => f.toLowerCase()))].join(", ")}.`,
    );

  return { fixed: text, issues };
}

function GrammarChecker() {
  const [text, setText] = useState("");
  const { fixed, issues } = useMemo(() => checkGrammar(text), [text]);
  return (
    <Grid>
      <Panel title="Your text" hint="Checked live as you type — nothing is uploaded.">
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text to proofread…"
          aria-label="Text to proofread"
        />
        <Toolbar>
          <Btn onClick={() => setText("")}>Reset</Btn>
        </Toolbar>
      </Panel>
      <Panel title="Corrected text">
        <Output value={fixed} mono={false} />
        <Toolbar>
          <CopyButton value={fixed} label="Copy correction" />
        </Toolbar>
        <div className="mt-5">
          <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-white/45">
            {text.trim()
              ? `${issues.length} issue${issues.length === 1 ? "" : "s"} found`
              : "Issues"}
          </div>
          {issues.length ? (
            <ul className="space-y-1.5">
              {issues.map((i, k) => (
                <li
                  key={`${i.type}-${k}`}
                  className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[12.5px] text-white/70"
                >
                  <span className="mr-2 text-[10px] uppercase tracking-[0.16em] text-[color:var(--violet-soft)]">
                    {i.type}
                  </span>
                  {i.detail}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-white/45">
              {text.trim()
                ? "No issues detected — this reads cleanly."
                : "Start typing to see suggestions."}
            </p>
          )}
        </div>
      </Panel>
    </Grid>
  );
}

/* -------------------------------- rewriting -------------------------------- */

const FORMAL: Record<string, string> = {
  "a lot": "considerably",
  kids: "children",
  stuff: "material",
  things: "items",
  get: "obtain",
  got: "received",
  buy: "purchase",
  "find out": "determine",
  "come up with": "develop",
  big: "significant",
  huge: "substantial",
  good: "strong",
  bad: "poor",
  "want to": "intend to",
  "need to": "must",
  so: "therefore",
  but: "however",
  also: "in addition",
};
const EXPAND: Array<[RegExp, string]> = [
  [/\bdon't\b/gi, "do not"],
  [/\bcan't\b/gi, "cannot"],
  [/\bwon't\b/gi, "will not"],
  [/\bit's\b/gi, "it is"],
  [/\bI'm\b/g, "I am"],
  [/\bwe're\b/gi, "we are"],
  [/\byou're\b/gi, "you are"],
  [/\bthat's\b/gi, "that is"],
  [/\bisn't\b/gi, "is not"],
  [/\bdoesn't\b/gi, "does not"],
];
const CONTRACT: Array<[RegExp, string]> = EXPAND.map(([re, full]) => [
  new RegExp(`\\b${full}\\b`, "gi"),
  re.source.replace(/\\b/g, "").replace(/^I/, "I"),
]) as Array<[RegExp, string]>;

function rewrite(text: string, tone: string) {
  let out = checkGrammar(text).fixed;
  if (tone === "Professional") {
    EXPAND.forEach(([re, full]) => (out = out.replace(re, full)));
    for (const [k, v] of Object.entries(FORMAL))
      out = out.replace(new RegExp(`\\b${k}\\b`, "gi"), v);
  } else if (tone === "Friendly") {
    CONTRACT.forEach(([re, short]) => (out = out.replace(re, short)));
    out = out.replace(/\.(\s|$)/g, (m, s) => `!${s}`).replace(/!+/g, "!");
  } else if (tone === "Concise") {
    out = out
      .replace(/\b(very|really|just|actually|basically|literally|quite|in order)\b\s*/gi, "")
      .replace(/\bin order to\b/gi, "to")
      .replace(/\bdue to the fact that\b/gi, "because")
      .replace(/\bat this point in time\b/gi, "now")
      .replace(/\s{2,}/g, " ");
    out = sentences(out)
      .map((s) => s.trim())
      .join(" ");
  } else if (tone === "Persuasive") {
    out = sentences(out)
      .map((s, i) => (i === 0 ? s : s))
      .join(" ");
    out = `${out} Here's why it matters: ${keyTerms(text, 3).join(", ") || "the outcome"} — and the result speaks for itself.`;
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

/* --------------------------------- exports -------------------------------- */

export const tools: Record<string, ToolComponent> = {
  "ai-summarizer": () => (
    <AiTool
      inputLabel="Text to summarize"
      placeholder="Paste an article, report or transcript…"
      options={{ label: "Length", values: ["Short", "Medium", "Detailed"] }}
      generate={(s, o) => {
        const n = o === "Short" ? 1 : o === "Medium" ? 3 : 5;
        const terms = keyTerms(s);
        const w = words(s).length;
        return `${summarize(s, n)}\n\nKey terms: ${terms.join(", ") || "—"}\nCompression: ${w} words → ${words(summarize(s, n)).length} words`;
      }}
    />
  ),
  "grammar-checker": GrammarChecker,
  "rewrite-text": () => (
    <AiTool
      inputLabel="Text to rewrite"
      placeholder="Paste the text you want rephrased…"
      options={{ label: "Tone", values: ["Professional", "Friendly", "Concise", "Persuasive"] }}
      generate={rewrite}
    />
  ),
  "email-writer": () => (
    <AiTool
      inputLabel="What is the email about?"
      placeholder="Follow up with a client about the March invoice"
      options={{ label: "Tone", values: ["Professional", "Warm", "Direct"] }}
      generate={(s, tone) => {
        const topic = s.replace(/\.$/, "");
        const subject = titleCase(
          keyTerms(s, 5).join(" ") || topic.split(" ").slice(0, 6).join(" "),
        );
        const open =
          tone === "Warm"
            ? "Hi there,\n\nI hope your week is going well."
            : tone === "Direct"
              ? "Hi,\n"
              : "Hello,\n";
        const body =
          tone === "Direct"
            ? `I'm writing about ${topic}. Could you confirm the next step by end of week?`
            : `I'm reaching out regarding ${topic}. ${
                tone === "Warm"
                  ? "Whenever you have a moment, I'd love to hear your thoughts."
                  : "Please let me know how you would like to proceed."
              }`;
        const close = tone === "Warm" ? "Thanks so much,\nYour name" : "Best regards,\nYour name";
        return `Subject: ${subject}\n\n${open}\n${body}\n\n${close}`;
      }}
    />
  ),
  "caption-generator": () => (
    <AiTool
      inputLabel="Describe your post"
      placeholder="Sunset run along the coast"
      options={{ label: "Platform", values: ["Instagram", "LinkedIn", "X"] }}
      generate={(s, p) => {
        const core = s.replace(/\.$/, "");
        const terms = keyTerms(s, 3);
        const tags = terms.map((t) => `#${t}`).join(" ");
        if (p === "LinkedIn")
          return [
            `${titleCase(core)}.\n\nThree things this taught me:\n1. Consistency beats intensity.\n2. ${titleCase(terms[0] ?? "Focus")} compounds.\n3. Share the work, not just the result.\n\n${tags}`,
            `Most people overlook ${terms[0] ?? "this"}. Here's what ${core} taught me about it.`,
          ].join("\n\n———\n\n");
        if (p === "X")
          return [
            `${core} — and it delivered.`,
            `${titleCase(core)}. That's the post.`,
            `Nobody talks about ${terms[0] ?? core} enough. ${titleCase(core)}. ${tags}`,
          ].join("\n\n");
        return [
          `${titleCase(core)} ✨`,
          `${titleCase(core)} — saving this one for later. ${tags}`,
          `Little moments, big feelings. ${titleCase(core)}. ${tags}`,
        ].join("\n\n");
      }}
    />
  ),
  "hashtag-generator": () => (
    <AiTool
      inputLabel="Topic"
      placeholder="minimal workspace setup"
      generate={(s) => {
        const terms = keyTerms(s, 8);
        const joined = terms
          .slice(0, 3)
          .map((t) => t)
          .join("");
        const tags = [
          ...terms.map((t) => `#${t}`),
          joined ? `#${joined}` : "",
          ...terms.slice(0, 3).map((t) => `#${t}daily`),
          ...terms.slice(0, 2).map((t) => `#${t}inspiration`),
        ].filter(Boolean);
        return [...new Set(tags)].join(" ");
      }}
    />
  ),
  "blog-title-generator": () => (
    <AiTool
      inputLabel="Topic"
      placeholder="browser based productivity tools"
      generate={(s) => {
        const topic = s.replace(/\.$/, "");
        const T = titleCase(topic);
        return [
          `The Complete Guide to ${T}`,
          `${T}: What Most People Get Wrong`,
          `7 Ways to Master ${T} This Year`,
          `Why ${T} Is Quietly Changing Everything`,
          `${T}, Explained Simply`,
          `I Tried ${T} for 30 Days — Here's What Happened`,
          `The Beginner's Roadmap to ${T}`,
          `Stop Overthinking ${T}`,
        ].join("\n");
      }}
    />
  ),
  "prompt-generator": () => (
    <AiTool
      inputLabel="What do you want the AI to do?"
      placeholder="write landing page copy for a design studio"
      options={{ label: "Style", values: ["Structured", "Creative", "Technical"] }}
      generate={(s, style) => {
        const role =
          style === "Technical"
            ? "a senior engineer who writes precise, testable specifications"
            : style === "Creative"
              ? "an award-winning creative director with a distinctive voice"
              : "an expert assistant who works methodically";
        return [
          `# Role\nYou are ${role}.`,
          `# Task\n${s.replace(/\.$/, "")}.`,
          `# Context\nKey subjects: ${keyTerms(s, 5).join(", ") || "as described above"}.`,
          `# Constraints\n- Be specific and concrete\n- No filler language or preamble\n- ${style === "Technical" ? "Include edge cases and failure modes" : "Vary sentence rhythm"}\n- Ask a clarifying question if a requirement is ambiguous`,
          `# Output format\nMarkdown. ${style === "Structured" ? "Use headings and short bullet lists." : "Prose, no headings."}`,
        ].join("\n\n");
      }}
    />
  ),
  "product-description-generator": () => (
    <AiTool
      inputLabel="Product details"
      placeholder="ceramic pour-over coffee dripper, matte black"
      generate={(s) => {
        const parts = s
          .split(/[,;]/)
          .map((x) => x.trim())
          .filter(Boolean);
        const name = titleCase(parts[0] ?? s);
        const features = parts.slice(1);
        return [
          `${name}`,
          "",
          `${name} is made for people who notice the details. ${
            features.length ? `Finished in ${features.join(" and ")}, it` : "It"
          } is built to last and quietly beautiful on any surface.`,
          "",
          "Highlights",
          ...(features.length ? features : ["Premium materials", "Considered, minimal design"]).map(
            (f) => `• ${titleCase(f)}`,
          ),
          "• Designed for everyday use",
          "",
          `Keywords: ${keyTerms(s, 6).join(", ")}`,
        ].join("\n");
      }}
    />
  ),
};
