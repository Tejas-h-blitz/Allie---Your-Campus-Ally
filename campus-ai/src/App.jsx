import { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

// Fix PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = "llama-3.1-8b-instant";

async function callGroq(prompt) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content || "";
}

function extractJSON(raw) {
  try { return JSON.parse(raw); } catch {}
  const stripped = raw.replace(/```json|```/g, "").trim();
  try { return JSON.parse(stripped); } catch {}
  const match = stripped.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  throw new Error("Could not parse JSON from response");
}

// ── Extract text from PDF using pdfjs ────────────────────────────────────────
async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText.trim();
}

// ── Generate real poster via Pollinations.ai (free, no key needed) ────────────
function generatePosterUrl(prompt) {
  const enhancedPrompt = `${prompt}, vibrant university event poster, professional graphic design, bold typography, high contrast colors, modern design`;
  const encoded = encodeURIComponent(enhancedPrompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #08080f; --surface: #0f0f1a; --card: #13131f; --border: #1e1e2e;
    --accent: #7c6af7; --accent2: #f97316; --accent3: #22d3ee;
    --text: #e2e2f0; --muted: #6b6b8a;
    --font-head: 'Syne', sans-serif; --font-mono: 'DM Mono', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-head); min-height: 100vh; }
  .app { display: flex; min-height: 100vh; }
  .sidebar { width: 220px; min-height: 100vh; background: var(--surface); border-right: 1px solid var(--border); padding: 28px 0; display: flex; flex-direction: column; position: fixed; left: 0; top: 0; }
  .logo { padding: 0 24px 32px; font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
  .logo span { color: var(--accent); }
  .nav-item { padding: 12px 24px; cursor: pointer; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; color: var(--muted); transition: all 0.2s; border-left: 3px solid transparent; display: flex; align-items: center; gap: 10px; }
  .nav-item:hover { color: var(--text); background: var(--card); }
  .nav-item.active { color: var(--accent); border-left-color: var(--accent); background: rgba(124,106,247,0.08); }
  .main { margin-left: 220px; flex: 1; padding: 40px; min-height: 100vh; }
  .page-title { font-size: 32px; font-weight: 800; margin-bottom: 6px; letter-spacing: -1px; }
  .page-sub { color: var(--muted); font-family: var(--font-mono); font-size: 13px; margin-bottom: 36px; }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 24px; }
  .card-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; }
  .upload-zone { border: 2px dashed var(--border); border-radius: 12px; padding: 48px; text-align: center; cursor: pointer; transition: all 0.2s; font-family: var(--font-mono); }
  .upload-zone:hover { border-color: var(--accent); background: rgba(124,106,247,0.04); }
  .upload-zone.active { border-color: var(--accent); background: rgba(124,106,247,0.08); }
  .upload-icon { font-size: 40px; margin-bottom: 16px; }
  .upload-text { color: var(--muted); font-size: 13px; }
  .upload-text strong { color: var(--text); }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-family: var(--font-head); font-size: 13px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #6b59e8; transform: translateY(-1px); }
  .btn-outline { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
  .btn-outline:hover { background: rgba(124,106,247,0.12); }
  .btn-orange { background: var(--accent2); color: white; }
  .btn-orange:hover { background: #ea6a00; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  textarea, input[type=text] { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; color: var(--text); font-family: var(--font-mono); font-size: 13px; resize: vertical; outline: none; transition: border-color 0.2s; }
  textarea:focus, input[type=text]:focus { border-color: var(--accent); }
  textarea { min-height: 100px; }
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-top: 16px; }
  .cal-header { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 4px; }
  .cal-day-name { text-align: center; font-size: 10px; font-weight: 700; color: var(--muted); padding: 4px; letter-spacing: 1px; text-transform: uppercase; }
  .cal-day { aspect-ratio: 1; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 11px; font-weight: 500; background: var(--surface); border: 1px solid var(--border); position: relative; padding: 4px; }
  .cal-day.has-event { border-color: var(--accent); background: rgba(124,106,247,0.15); }
  .cal-day.exam { border-color: #ef4444; background: rgba(239,68,68,0.15); }
  .cal-day-num { font-size: 12px; font-weight: 700; }
  .cal-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); margin-top: 2px; }
  .cal-day.exam .cal-dot { background: #ef4444; }
  .roadmap { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
  .roadmap-week { display: flex; align-items: center; gap: 16px; padding: 14px 18px; background: var(--surface); border-radius: 10px; border: 1px solid var(--border); }
  .week-label { font-family: var(--font-mono); font-size: 11px; color: var(--muted); min-width: 80px; }
  .week-bar-wrap { flex: 1; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
  .week-bar { height: 100%; border-radius: 4px; transition: width 1s ease; }
  .week-events { font-size: 12px; color: var(--muted); font-family: var(--font-mono); min-width: 100px; text-align: right; }
  .chat-messages { display: flex; flex-direction: column; gap: 16px; max-height: 420px; overflow-y: auto; padding: 4px 0 16px; }
  .msg { display: flex; gap: 12px; }
  .msg.user { flex-direction: row-reverse; }
  .msg-avatar { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .msg.bot .msg-avatar { background: rgba(124,106,247,0.2); }
  .msg.user .msg-avatar { background: rgba(249,115,22,0.2); }
  .msg-bubble { max-width: 75%; padding: 12px 16px; border-radius: 12px; font-size: 13px; line-height: 1.6; font-family: var(--font-mono); }
  .msg.bot .msg-bubble { background: var(--surface); border: 1px solid var(--border); border-top-left-radius: 4px; }
  .msg.user .msg-bubble { background: rgba(124,106,247,0.15); border: 1px solid rgba(124,106,247,0.3); border-top-right-radius: 4px; }
  .msg-source { font-size: 10px; color: var(--accent3); margin-top: 6px; font-family: var(--font-mono); }
  .chat-input-row { display: flex; gap: 10px; align-items: flex-end; }
  .chat-input-row textarea { min-height: 44px; max-height: 100px; }
  .output-panel { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
  .output-panel h4 { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 14px; }
  .output-text { font-family: var(--font-mono); font-size: 12px; line-height: 1.7; color: var(--text); white-space: pre-wrap; }
  .poster-placeholder { aspect-ratio: 1; border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; font-size: 13px; font-family: var(--font-mono); color: var(--muted); text-align: center; }
  .poster-img { width: 100%; aspect-ratio: 1; border-radius: 10px; object-fit: cover; border: 1px solid var(--border); display: block; }
  .poster-loading { width: 100%; aspect-ratio: 1; border-radius: 10px; background: var(--surface); border: 1px dashed var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: var(--muted); font-family: var(--font-mono); font-size: 12px; }
  .poster-actions { display: flex; gap: 8px; margin-top: 10px; }
  .deadlines { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
  .deadline-item { display: flex; align-items: center; gap: 14px; padding: 12px 16px; background: var(--surface); border-radius: 8px; border-left: 3px solid var(--accent); }
  .deadline-item.exam { border-left-color: #ef4444; }
  .deadline-item.project { border-left-color: var(--accent2); }
  .deadline-date { font-family: var(--font-mono); font-size: 11px; color: var(--muted); min-width: 70px; }
  .deadline-name { font-size: 13px; font-weight: 700; flex: 1; }
  .deadline-weight { font-family: var(--font-mono); font-size: 11px; color: var(--accent); }
  .badge { display: inline-block; padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
  .badge-purple { background: rgba(124,106,247,0.15); color: var(--accent); }
  .badge-cyan { background: rgba(34,211,238,0.15); color: var(--accent3); }
  .badge-green { background: rgba(34,197,94,0.15); color: #22c55e; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .flex-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .mt-4 { margin-top: 16px; }
  .hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; background: rgba(124,106,247,0.1); border: 1px solid rgba(124,106,247,0.25); font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--accent); margin-bottom: 16px; }
  .loading-pulse { display: inline-block; animation: pulse 1.2s ease-in-out infinite; }
  .file-tag { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(124,106,247,0.12); border: 1px solid rgba(124,106,247,0.3); border-radius: 6px; font-family: var(--font-mono); font-size: 11px; color: var(--accent); }
  @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 24px; height: 24px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
`;

const SAMPLE_SYLLABUS = `CS 401 - Algorithms & Data Structures
Instructor: Dr. Sarah Chen

GRADING:
- Midterm Exam: 20%
- Final Exam: 30%
- 3 Programming Projects: 30% (10% each)
- Weekly Quizzes: 10%
- Participation: 10%

SCHEDULE:
- Jan 15: Course begins
- Feb 3: Quiz 1
- Feb 17: Project 1 Due
- Mar 5: Midterm Exam
- Apr 2: Project 2 Due
- Apr 21: Quiz 2
- May 1: Project 3 Due
- May 12: Final Exam (2:00 PM, Room 201)`;

const CAMPUS_DOCS = `
=== RESIDENCE LIFE HANDBOOK 2024-2025 ===
Section 3.2 Guest Policy: Students may have guests visit between 8 AM and 11 PM on weekdays. Overnight guests require advance approval from the RA and are limited to 2 consecutive nights per month. Guests must be signed in at the front desk. Non-students must show valid ID.
Section 4.1 Quiet Hours: Quiet hours Sunday–Thursday 10 PM to 8 AM, Friday–Saturday midnight to 10 AM.

=== PARKING & TRANSPORTATION ===
Permits cost $180/semester. Apply at parking.university.edu. Freshmen: Lot D/E, Sophomores: Lot C, Juniors/Seniors: Lot A/B. Visitor permits $5/day at Lot F kiosks.

=== FINANCIAL AID ===
FAFSA Priority Deadline: March 1. Must maintain 2.0 GPA and complete 67% of attempted credits to keep aid.

=== REGISTRAR ===
Add/Drop: No penalty first 2 weeks. "W" grade for drops weeks 3–10. After week 10 requires Dean's signature.

=== STUDENT HEALTH CENTER ===
Hours: Mon–Fri 8AM–6PM, Sat 10AM–2PM. Free mental health counseling: up to 8 sessions/year. Telehealth available.

=== DINING SERVICES ===
Plans: Silver (10 meals/wk), Gold (14 meals/wk), Platinum (unlimited). Dining Dollars: $200/semester on Gold & Platinum. Union Cafe open until midnight.
`;

// ─── Syllabus Engine (with PDF support) ──────────────────────────────────────
function SyllabusEngine() {
  const [syllabusText, setSyllabusText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = async (f) => {
    if (!f) return;
    setFile(f);
    setError("");

    if (f.type === "application/pdf" || f.name.endsWith(".pdf")) {
      setPdfLoading(true);
      setSyllabusText("");
      try {
        const text = await extractPdfText(f);
        setSyllabusText(text);
      } catch (e) {
        setError("Could not read PDF. Try copy-pasting the text instead.");
      }
      setPdfLoading(false);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setSyllabusText(e.target.result);
      reader.readAsText(f);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyze = async () => {
    const text = syllabusText || SAMPLE_SYLLABUS;
    setLoading(true); setResult(null); setError("");
    const prompt = `You are a syllabus parser. Extract structured data and return ONLY valid JSON with no markdown fences or extra text.

Return exactly this structure:
{
  "course": "course name",
  "deadlines": [{"date": "Mon DD", "name": "deadline name", "type": "exam or project or quiz or other", "weight": "20% or null"}],
  "busyWeeks": [{"week": "Week of Mon DD", "load": 75, "events": "2 deadlines this week"}]
}

Generate 4-6 busyWeeks with load 0-100. Return ONLY the JSON, nothing else.

SYLLABUS:
${text}`;
    try {
      const raw = await callGroq(prompt);
      setResult(extractJSON(raw));
    } catch (e) {
      setError("Error: " + e.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="hero-badge">⚡ Feature 01</div>
      <div className="page-title">Syllabus-to-Life Engine</div>
      <div className="page-sub">// Upload a PDF or .txt syllabus → get an instant study roadmap</div>
      <div className="card">
        <div className="card-label">Input — Upload PDF or .txt</div>
        <div
          className={`upload-zone${dragOver ? " active" : ""}`}
          onClick={() => fileRef.current.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="upload-icon">{pdfLoading ? "⏳" : "📄"}</div>
          <div className="upload-text">
            {pdfLoading
              ? <strong><span className="loading-pulse">Reading PDF…</span></strong>
              : file
                ? <strong>✅ {file.name}</strong>
                : <strong>Drop your syllabus here or click to upload</strong>
            }
            <br />
            {!pdfLoading && <span>Supports <strong>.pdf</strong> and <strong>.txt</strong> · or paste text below</span>}
          </div>
        </div>
        <input ref={fileRef} type="file" accept=".txt,.pdf" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />

        {file && (
          <div className="flex-row mt-4" style={{ marginBottom: 0 }}>
            <span className="file-tag">
              {file.name.endsWith(".pdf") ? "📕" : "📄"} {file.name}
            </span>
            {syllabusText && <span className="badge badge-green">✓ {syllabusText.split(" ").length} words extracted</span>}
          </div>
        )}

        <textarea
          style={{ marginTop: 16 }}
          placeholder="Or paste syllabus text here… (leave blank to use built-in sample)"
          value={syllabusText}
          onChange={e => setSyllabusText(e.target.value)}
          rows={5}
        />
        <div className="flex-row mt-4">
          <button className="btn btn-primary" onClick={analyze} disabled={loading || pdfLoading}>
            {loading ? <span className="loading-pulse">Analyzing…</span> : "🚀 Generate Roadmap"}
          </button>
          <button className="btn btn-outline" onClick={() => { setSyllabusText(SAMPLE_SYLLABUS); setFile(null); }}>Load Sample</button>
          {file && <button className="btn btn-outline" style={{ fontSize: 11 }} onClick={() => { setFile(null); setSyllabusText(""); setResult(null); }}>Clear</button>}
        </div>
        {error && <div style={{ color: "#ef4444", fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 12 }}>⚠️ {error}</div>}
      </div>

      {result && (
        <>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent)", marginBottom: 16 }}>
            ✓ Parsed: <strong>{result.course}</strong>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="card-label">📋 Extracted Deadlines</div>
              <div className="deadlines">
                {result.deadlines?.map((d, i) => (
                  <div key={i} className={`deadline-item ${d.type}`}>
                    <span className="deadline-date">{d.date}</span>
                    <span className="deadline-name">{d.name}</span>
                    {d.weight && d.weight !== "null" && <span className="deadline-weight">{d.weight}</span>}
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-label">📊 Study Roadmap — Busiest Weeks</div>
              <div className="roadmap">
                {result.busyWeeks?.map((w, i) => (
                  <div key={i} className="roadmap-week">
                    <span className="week-label">{w.week}</span>
                    <div className="week-bar-wrap">
                      <div className="week-bar" style={{ width: `${w.load}%`, background: w.load > 70 ? "#ef4444" : w.load > 40 ? "#f97316" : "#7c6af7" }} />
                    </div>
                    <span className="week-events">{w.events}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="card">
            <div className="card-label">📅 Semester Calendar Preview</div>
            <MiniCalendar deadlines={result.deadlines} />
          </div>
        </>
      )}
    </div>
  );
}

function MiniCalendar({ deadlines = [] }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May"];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const parsed = deadlines.map(d => {
    const parts = d.date?.split(" ");
    return { month: parts?.[0], day: parseInt(parts?.[1]), type: d.type, name: d.name };
  });
  return (
    <div style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 8 }}>
      {months.map(month => (
        <div key={month} style={{ minWidth: 180 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>{month}</div>
          <div className="cal-header">{days.map((d, i) => <div key={i} className="cal-day-name">{d}</div>)}</div>
          <div className="cal-grid">
            {Array.from({ length: 28 }, (_, i) => {
              const day = i + 1;
              const event = parsed.find(e => e.month === month && e.day === day);
              return (
                <div key={i} className={`cal-day${event ? (event.type === "exam" ? " exam" : " has-event") : ""}`} title={event?.name}>
                  <span className="cal-day-num">{day}</span>
                  {event && <div className="cal-dot" />}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Campus Oracle ────────────────────────────────────────────────────────────
function CampusOracle() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey! I'm the Campus Oracle 🔮 Ask me anything about campus — dorms, parking, financial aid, dining, or health.", source: null }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const presets = ["What's the guest policy for dorms?", "How do I get a parking permit?", "When can I drop a class?", "How many counseling sessions do I get?"];

  const ask = async (q) => {
    const question = q || input.trim();
    if (!question) return;
    setMessages(m => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    const prompt = `You are the Campus Oracle. Answer ONLY based on the campus documents below. Be concise and friendly. End with: "📄 Source: [document name and section]". If not in docs, say so.

CAMPUS DOCUMENTS:
${CAMPUS_DOCS}

STUDENT QUESTION: ${question}`;
    try {
      const raw = await callGroq(prompt);
      const sourceMatch = raw.match(/📄 Source: (.+)/);
      const source = sourceMatch?.[1];
      const text = raw.replace(/📄 Source: .+/, "").trim();
      setMessages(m => [...m, { role: "bot", text, source }]);
    } catch (e) {
      setMessages(m => [...m, { role: "bot", text: "Error: " + e.message, source: null }]);
    }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div>
      <div className="hero-badge">🔮 Feature 02</div>
      <div className="page-title">Campus Oracle</div>
      <div className="page-sub">// RAG-powered Q&A from campus handbooks</div>
      <div className="flex-row" style={{ marginBottom: 20 }}>
        {presets.map(p => <button key={p} className="btn btn-outline" style={{ fontSize: 11 }} onClick={() => ask(p)}>{p}</button>)}
      </div>
      <div className="card">
        <div className="card-label">Chat</div>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="msg-avatar">{m.role === "bot" ? "🔮" : "🎓"}</div>
              <div>
                <div className="msg-bubble">{m.text}</div>
                {m.source && <div className="msg-source">📄 {m.source}</div>}
              </div>
            </div>
          ))}
          {loading && <div className="msg bot"><div className="msg-avatar">🔮</div><div className="msg-bubble"><span className="loading-pulse">Searching campus docs…</span></div></div>}
          <div ref={bottomRef} />
        </div>
        <div className="chat-input-row">
          <textarea placeholder="Ask anything… (Enter to send)" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }} rows={2} />
          <button className="btn btn-primary" onClick={() => ask()} disabled={loading || !input.trim()}>Send</button>
        </div>
      </div>
    </div>
  );
}

// ─── Club Creative Suite (with real AI poster) ────────────────────────────────
function ClubCreativeSuite() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [posterUrl, setPosterUrl] = useState(null);
  const [posterLoading, setPosterLoading] = useState(false);

  const examples = ["Chess Club social this Friday at 6 PM", "Debate team tryouts Monday at 4 PM", "Photography Club sunset hike Saturday", "Robotics Club demo day, free pizza!"];

  const generate = async (text) => {
    const event = text || prompt;
    if (!event.trim()) return;
    setLoading(true); setResult(null); setError(""); setPosterUrl(null);
    const p = `You are a creative marketing AI for campus clubs. Generate a campaign for: "${event}"

Return ONLY valid JSON with no markdown:
{
  "caption": "Instagram caption with emojis, 2-3 sentences",
  "email": "Subject: Your Subject\\n\\nEmail body here",
  "posterPrompt": "Visual poster description — colors, imagery, style, 2-3 sentences",
  "videoPrompt": "5-second TikTok/Reel description — scene, motion, vibe",
  "hashtags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;
    try {
      const raw = await callGroq(p);
      const parsed = extractJSON(raw);
      setResult(parsed);
      // Auto-generate the poster image
      generatePoster(parsed.posterPrompt, event);
    } catch (e) {
      setError("Error: " + e.message);
    }
    setLoading(false);
  };

  const generatePoster = (posterPrompt, eventDescription) => {
    setPosterLoading(true);
    setPosterUrl(null);
    const combinedPrompt = `${eventDescription} — ${posterPrompt}`;
    const url = generatePosterUrl(combinedPrompt);
    // Preload image
    const img = new Image();
    img.onload = () => { setPosterUrl(url); setPosterLoading(false); };
    img.onerror = () => { setPosterLoading(false); };
    img.src = url;
  };

  const regeneratePoster = () => {
    if (result?.posterPrompt && prompt) generatePoster(result.posterPrompt, prompt);
  };

  const downloadPoster = () => {
    if (!posterUrl) return;
    const a = document.createElement("a");
    a.href = posterUrl;
    a.download = "campus-poster.jpg";
    a.target = "_blank";
    a.click();
  };

  return (
    <div>
      <div className="hero-badge">🎨 Feature 03</div>
      <div className="page-title">Club Creative Suite</div>
      <div className="page-sub">// One-click campaign generator — real AI poster included!</div>
      <div className="card">
        <div className="card-label">Event Description</div>
        <div className="flex-row" style={{ marginBottom: 12 }}>
          {examples.map(e => <button key={e} className="btn btn-outline" style={{ fontSize: 11 }} onClick={() => setPrompt(e)}>{e.split(" ").slice(0, 3).join(" ")}…</button>)}
        </div>
        <input type="text" placeholder='e.g. "Chess Club social this Friday at 6 PM"' value={prompt} onChange={e => setPrompt(e.target.value)} onKeyDown={e => e.key === "Enter" && generate()} />
        <div className="mt-4">
          <button className="btn btn-orange" onClick={() => generate()} disabled={loading || !prompt.trim()}>
            {loading ? <span className="loading-pulse">⚡ Generating…</span> : "⚡ Generate Campaign Pack"}
          </button>
        </div>
        {error && <div style={{ color: "#ef4444", fontFamily: "var(--font-mono)", fontSize: 12, marginTop: 12 }}>⚠️ {error}</div>}
      </div>

      {result && (
        <>
          <div className="grid-2">
            <div className="output-panel">
              <h4>📸 Instagram Caption</h4>
              <div className="output-text">{result.caption}</div>
              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                {result.hashtags?.map(h => <span key={h} className="badge badge-purple">#{h}</span>)}
              </div>
            </div>
            <div className="output-panel">
              <h4>📧 Member Email</h4>
              <div className="output-text" style={{ fontSize: 11 }}>{result.email}</div>
            </div>
          </div>

          <div className="grid-2" style={{ marginTop: 20 }}>
            {/* Real AI Poster */}
            <div className="output-panel">
              <h4>🖼️ AI Generated Poster</h4>
              {posterLoading && (
                <div className="poster-loading">
                  <div className="spinner" />
                  <span>Generating your poster…</span>
                  <span style={{ fontSize: 10 }}>Powered by Pollinations AI</span>
                </div>
              )}
              {posterUrl && !posterLoading && (
                <>
                  <img src={posterUrl} alt="AI Generated Poster" className="poster-img" />
                  <div className="poster-actions">
                    <button className="btn btn-primary" style={{ fontSize: 11 }} onClick={downloadPoster}>⬇ Download</button>
                    <button className="btn btn-outline" style={{ fontSize: 11 }} onClick={regeneratePoster}>🔄 Regenerate</button>
                  </div>
                </>
              )}
              {!posterLoading && !posterUrl && (
                <div className="poster-placeholder" style={{ background: "linear-gradient(135deg, rgba(124,106,247,0.15), rgba(249,115,22,0.1))", border: "1px dashed rgba(124,106,247,0.4)" }}>
                  <div style={{ fontSize: 32 }}>🎨</div>
                  <div style={{ fontSize: 12, lineHeight: 1.6, padding: "0 12px" }}>{result.posterPrompt}</div>
                </div>
              )}
            </div>

            {/* Video Concept */}
            <div className="output-panel">
              <h4>🎬 Reel / TikTok Concept</h4>
              <div className="poster-placeholder" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(124,106,247,0.1))", border: "1px dashed rgba(34,211,238,0.35)" }}>
                <div style={{ fontSize: 32 }}>🎥</div>
                <div style={{ fontSize: 12, lineHeight: 1.6, padding: "0 12px" }}>{result.videoPrompt}</div>
                <span className="badge badge-cyan">5-Second Concept</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("syllabus");
  const nav = [
    { id: "syllabus", label: "Syllabus Engine", icon: "📄" },
    { id: "oracle", label: "Campus Oracle", icon: "🔮" },
    { id: "creative", label: "Creative Suite", icon: "🎨" },
  ];
  return (
    <>
      <style>{css}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">Campus<span>AI</span></div>
          {nav.map(n => (
            <div key={n.id} className={`nav-item${tab === n.id ? " active" : ""}`} onClick={() => setTab(n.id)}>
              <span className="nav-icon">{n.icon}</span>
              {n.label}
            </div>
          ))}
          <div style={{ marginTop: "auto", padding: "0 24px 16px", fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
            Powered by Groq + Llama 3.1
          </div>
        </aside>
        <main className="main">
          {tab === "syllabus" && <SyllabusEngine />}
          {tab === "oracle" && <CampusOracle />}
          {tab === "creative" && <ClubCreativeSuite />}
        </main>
      </div>
    </>
  );
}
