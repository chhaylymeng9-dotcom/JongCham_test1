import React from "react";

/* ─────────────────────────────────────────────────────────────
   PracticeModes — the Practice tab.

   Six modes in two groups: four card drills, two full papers.
   Every class is prefixed `pm-` and scoped under `.pm-root`.

   <PracticeModes
     stats={{ cards:50, lastMcq:"ម្សិលមិញ", bestType:82, bestMatch:"0:48",
              lessons:7, lessonQuestions:64, examQuestions:40, examMinutes:60 }}
     numerals="km"
     onStart={key => …}   // "flip" | "mcq" | "type" | "match" | "lesson" | "mock"
   />
   ───────────────────────────────────────────────────────────── */

const CSS = `
.pm-root{
  --pm-card:#FFFFFF; --pm-ink:#23271F; --pm-muted:#8B8877; --pm-faint:#B4B0A2;
  --pm-line:#E7E3D7; --pm-green:#2F3A2E; --pm-green-soft:#EAF0E6;
  --pm-gold:#F2C33C; --pm-gold-soft:#FBEFCC; --pm-amber:#E2A13A; --pm-amber-soft:#FBF1DF;
  --pm-blue:#4A6B78; --pm-blue-soft:#E7F0F2; --pm-plum:#7A5A6E; --pm-plum-soft:#F4EBF1;
  --pm-shadow:0 1px 0 rgba(35,39,31,.04), 0 6px 18px rgba(35,39,31,.05);
  --pm-kh:"Siemreap","Khmer OS Siemreap","Noto Sans Khmer",system-ui,sans-serif;
  color:var(--pm-ink);line-height:1.6;
}
.pm-root *{box-sizing:border-box}

.pm-root .pm-kick{font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--pm-faint);margin:0 0 6px}
.pm-root .pm-h1{font-size:27px;margin:0 0 8px;letter-spacing:0}
.pm-root .pm-sub{margin:0 0 4px;font-size:14.5px;color:var(--pm-muted)}

.pm-root .pm-label{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--pm-faint);margin:26px 0 10px}
.pm-root .pm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}

.pm-root .pm-mode{position:relative;background:var(--pm-card);border:1px solid var(--pm-line);
  border-radius:20px;padding:18px;box-shadow:var(--pm-shadow);cursor:pointer;text-align:left;
  font:inherit;color:inherit;display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;
  align-items:start;transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease}
.pm-root .pm-mode:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(35,39,31,.10);
  border-color:#DCD7C7}
.pm-root .pm-mode:active{transform:translateY(-1px)}
.pm-root .pm-art{width:78px;height:66px;border-radius:14px;display:grid;place-items:center;flex:none}
.pm-root .pm-mode.green .pm-art{background:var(--pm-green-soft)}
.pm-root .pm-mode.blue  .pm-art{background:var(--pm-blue-soft)}
.pm-root .pm-mode.amber .pm-art{background:var(--pm-amber-soft)}
.pm-root .pm-mode.plum  .pm-art{background:var(--pm-plum-soft)}
.pm-root .pm-mode h3{margin:2px 0 5px;font-family:var(--pm-kh);font-size:16.5px;
  line-height:1.55;letter-spacing:0}
.pm-root .pm-d{margin:0;font-family:var(--pm-kh);font-size:13.5px;color:var(--pm-muted);line-height:1.7}
.pm-root .pm-foot{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:12px}
.pm-root .pm-pips{display:flex;gap:4px;align-items:center}
.pm-root .pm-pips i{width:14px;height:5px;border-radius:99px;background:#E4E0D2;display:block}
.pm-root .green .pm-pips i.on{background:var(--pm-green)}
.pm-root .blue  .pm-pips i.on{background:var(--pm-blue)}
.pm-root .amber .pm-pips i.on{background:var(--pm-amber)}
.pm-root .plum  .pm-pips i.on{background:var(--pm-plum)}
.pm-root .pm-lvl{font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--pm-faint)}
.pm-root .pm-stat{font-family:var(--pm-kh);font-size:12.5px;color:var(--pm-muted);
  margin-left:auto;display:inline-flex;align-items:center;gap:6px}
.pm-root .pm-stat b{color:var(--pm-ink)}
.pm-root .pm-arrow{position:absolute;right:16px;top:16px;color:var(--pm-faint);opacity:0;
  transform:translateX(-4px);transition:all .2s ease}
.pm-root .pm-mode:hover .pm-arrow{opacity:1;transform:none}
.pm-root .pm-badge{position:absolute;right:14px;top:14px;font-size:9.5px;letter-spacing:.12em;
  text-transform:uppercase;background:var(--pm-gold-soft);color:#6B4E06;border-radius:5px;padding:3px 7px}
.pm-root .pm-mode:hover .pm-badge{opacity:0}

.pm-root .pm-note{margin-top:20px;display:flex;align-items:center;gap:10px;font-size:13px;
  color:var(--pm-muted);background:#FCFBF7;border:1px dashed var(--pm-line);
  border-radius:16px;padding:14px 18px}

@media (max-width:780px){.pm-root .pm-grid{grid-template-columns:1fr}}
`;

const KD = "០១២៣៤៥៦៧៨៩";
const toKm = n => String(n).replace(/[0-9]/g, d => KD[+d]);

const ART = {
  flip: <svg width="54" height="46" viewBox="0 0 54 46" fill="none">
    <rect x="4" y="9" width="34" height="26" rx="6" fill="#fff" stroke="#2F3A2E" strokeWidth="2.4"/>
    <rect x="15" y="14" width="34" height="26" rx="6" fill="#fff" stroke="#2F3A2E" strokeWidth="2.4"/>
    <path d="M22 22h20M22 28h13" stroke="#2F3A2E" strokeWidth="2.4" strokeLinecap="round"/></svg>,
  mcq: <svg width="54" height="46" viewBox="0 0 54 46" fill="none">
    <circle cx="12" cy="12" r="5.4" fill="#fff" stroke="#4A6B78" strokeWidth="2.4"/>
    <circle cx="12" cy="26" r="5.4" fill="#4A6B78"/>
    <circle cx="12" cy="40" r="5.4" fill="#fff" stroke="#4A6B78" strokeWidth="2.4"/>
    <path d="M24 12h22M24 26h16M24 40h22" stroke="#4A6B78" strokeWidth="2.6" strokeLinecap="round"/></svg>,
  type: <svg width="54" height="46" viewBox="0 0 54 46" fill="none">
    <rect x="3" y="12" width="48" height="22" rx="7" fill="#fff" stroke="#E2A13A" strokeWidth="2.4"/>
    <path d="M12 18v10" stroke="#23271F" strokeWidth="2.6" strokeLinecap="round"/>
    <path d="M19 23h13" stroke="#E2A13A" strokeWidth="2.6" strokeLinecap="round" opacity=".55"/></svg>,
  match: <svg width="54" height="46" viewBox="0 0 54 46" fill="none">
    <g fill="#7A5A6E"><circle cx="9" cy="10" r="4.4"/><circle cx="9" cy="23" r="4.4"/><circle cx="9" cy="36" r="4.4"/>
    <circle cx="45" cy="10" r="4.4"/><circle cx="45" cy="23" r="4.4"/><circle cx="45" cy="36" r="4.4"/></g>
    <path d="M13 10C26 10 32 23 41 23M13 23C24 23 30 36 41 36M13 36C26 36 32 10 41 10"
          stroke="#7A5A6E" strokeWidth="2.4" fill="none" opacity=".55"/></svg>,
  lesson: <svg width="54" height="46" viewBox="0 0 54 46" fill="none">
    <rect x="6" y="3" width="34" height="40" rx="6" fill="#fff" stroke="#2F3A2E" strokeWidth="2.4"/>
    <path d="M14 14h18M14 22h18M14 30h11" stroke="#2F3A2E" strokeWidth="2.4" strokeLinecap="round"/>
    <path d="M33 33.5l4.5 4.5L48 27" stroke="#F2C33C" strokeWidth="4"
          strokeLinecap="round" strokeLinejoin="round"/></svg>,
  mock: <svg width="54" height="46" viewBox="0 0 54 46" fill="none">
    <rect x="3" y="3" width="30" height="40" rx="5" fill="#fff" stroke="#4A6B78" strokeWidth="2.4"/>
    <path d="M10 13h16M10 21h16M10 29h10" stroke="#4A6B78" strokeWidth="2.2" strokeLinecap="round"/>
    <circle cx="41" cy="31" r="11" fill="#fff" stroke="#4A6B78" strokeWidth="2.4"/>
    <path d="M41 25v6.4l4 2.4" stroke="#23271F" strokeWidth="2.4" strokeLinecap="round"/></svg>,
};

const ARROW = <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>;

/** The six modes, with the Khmer copy fixed. Only the stats come from outside. */
export function defaultGroups(stats = {}, num = toKm) {
  const s = {
    cards: 0, lastMcq: "—", bestType: 0, bestMatch: "—",
    lessons: 0, lessonQuestions: 0, examQuestions: 0, examMinutes: 0, ...stats,
  };
  return [
    { label: "កាតហ្វឹកហាត់ · Card drills", modes: [
      { key:"flip", accent:"green", badge:"Easiest", level:"Warm up", pips:1,
        title:"រំលឹកកាត",
        desc:"អានម្ខាង រួចចាំម្ខាងទៀត។ គ្មានពិន្ទុ គ្មានសម្ពាធ។",
        stat:<>កាត <b>{num(s.cards)}</b></> },
      { key:"mcq", accent:"blue", level:"Steady", pips:2,
        title:"ជ្រើសរើសចម្លើយ",
        desc:"ជ្រើសចម្លើយត្រូវពីក្នុងបួន។ ចម្លើយខុសនឹងវិលមកម្តងទៀត។",
        stat:<>លើកមុន · <b>{s.lastMcq}</b></> },
      { key:"type", accent:"amber", level:"Hardest", pips:3,
        title:"សរសេរចម្លើយ",
        desc:"គ្មានជម្រើសឱ្យជ្រើសទេ — ដឹង ឬមិនដឹង។",
        stat:<>ល្អបំផុត <b>{num(s.bestType)}%</b></> },
      { key:"match", accent:"plum", level:"Quick", pips:2,
        title:"ផ្គូផ្គងគូ",
        desc:"ភ្ជាប់ពាក្យនីមួយៗទៅចម្លើយរបស់វា ប្រណាំងនឹងម៉ោង។",
        stat:<>ល្អបំផុត <b>{num(s.bestMatch)}</b></> },
    ]},
    { label: "ធ្វើតេស្តពេញលេញ · Full papers", modes: [
      { key:"lesson", accent:"green", level:"Lesson set", pips:2,
        title:"លំហាត់អនុវត្ត",
        desc:"សំណួរដូចក្នុងមេរៀន — ធ្វើម្តងទៀតបានគ្រប់ពេល ដោយពិន្ទុមិនត្រូវបានកត់ត្រា។",
        stat:<>មេរៀន <b>{num(s.lessons)}</b> · សំណួរ <b>{num(s.lessonQuestions)}</b></> },
      { key:"mock", accent:"blue", level:"Mock exam", pips:3,
        title:"វិញ្ញាសា",
        desc:"វិញ្ញាសាពេញលេញ ដូចថ្ងៃប្រឡង — មានកំណត់ម៉ោង តែពិន្ទុមិនត្រូវបានកត់ត្រា។",
        stat:<>សំណួរ <b>{num(s.examQuestions)}</b> · <b>{num(s.examMinutes)}</b> នាទី</> },
    ]},
  ];
}

export default function PracticeModes({
  stats, groups, numerals = "km", onStart,
  title = "Drill the material.",
  kicker = "Practice",
  sub = "Nothing here is recorded — practise as often as you like before the exam.",
  note = "Practice never touches your course progress or your best exam score — only the exam does.",
}) {
  const num = numerals === "km" ? toKm : String;
  const list = groups || defaultGroups(stats, num);

  return (
    <div className="pm-root">
      <style>{CSS}</style>

      {kicker && <p className="pm-kick">{kicker}</p>}
      {title && <h1 className="pm-h1">{title}</h1>}
      {sub && <p className="pm-sub">{sub}</p>}

      {list.map(g => (
        <React.Fragment key={g.label}>
          <p className="pm-label">{g.label}</p>
          <div className="pm-grid">
            {g.modes.map(m => (
              <button key={m.key} className={"pm-mode " + m.accent}
                      onClick={() => onStart && onStart(m.key)}>
                {m.badge && <span className="pm-badge">{m.badge}</span>}
                <span className="pm-arrow">{ARROW}</span>
                <span className="pm-art">{ART[m.key]}</span>
                <span>
                  <h3>{m.title}</h3>
                  <p className="pm-d">{m.desc}</p>
                  <span className="pm-foot">
                    <span className="pm-pips">
                      {[0,1,2].map(i => <i key={i} className={i < m.pips ? "on" : ""} />)}
                    </span>
                    <span className="pm-lvl">{m.level}</span>
                    <span className="pm-stat">{m.stat}</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </React.Fragment>
      ))}

      {note && (
        <p className="pm-note">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#B4B0A2"
               strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1"/></svg>
          {note}
        </p>
      )}
    </div>
  );
}
