import React from "react";

/* ─────────────────────────────────────────────────────────────
   PracticeModes — the Practice tab.

   Six modes in two groups: four card drills (four across), two full
   papers (two across, tile beside the words). Every card is just a
   tile, a title and one short line — no description, no pips, no level
   tag, no badge. Every class is prefixed `pm-` and scoped under
   `.pm-root`.

   <PracticeModes
     stats={{ cards:50, lessonQuestions:64, examQuestions:40, examMinutes:60 }}
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
  color:var(--pm-ink);line-height:1.5;
}
.pm-root *{box-sizing:border-box}

.pm-root .pm-kick{font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--pm-faint);margin:0 0 5px}
.pm-root .pm-h1{font-size:22px;margin:0 0 5px;letter-spacing:0}
.pm-root .pm-sub{margin:0;font-size:13.5px;color:var(--pm-muted)}

.pm-root .pm-label{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--pm-faint);margin:18px 0 8px}

/* card drills: four across, tile stacked above the words */
.pm-root .pm-grid.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.pm-root .pm-grid.cards .pm-mode{display:flex;flex-direction:column;align-items:flex-start;gap:10px;padding:14px}
.pm-root .pm-grid.cards .pm-art{width:42px;height:36px}

/* full papers: two across, tile beside the words */
.pm-root .pm-grid.papers{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.pm-root .pm-grid.papers .pm-mode{display:grid;grid-template-columns:auto minmax(0,1fr);
  align-items:center;gap:14px;padding:14px 16px}
.pm-root .pm-grid.papers .pm-art{width:56px;height:48px}

.pm-root .pm-mode{position:relative;background:var(--pm-card);border:1px solid var(--pm-line);
  border-radius:16px;box-shadow:var(--pm-shadow);cursor:pointer;text-align:left;
  font:inherit;color:inherit;
  transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease}
.pm-root .pm-mode:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(35,39,31,.10);
  border-color:#DCD7C7}
.pm-root .pm-mode:active{transform:translateY(-1px)}
.pm-root .pm-art{border-radius:12px;display:grid;place-items:center;flex:none}
.pm-root .pm-mode.green .pm-art{background:var(--pm-green-soft)}
.pm-root .pm-mode.blue  .pm-art{background:var(--pm-blue-soft)}
.pm-root .pm-mode.amber .pm-art{background:var(--pm-amber-soft)}
.pm-root .pm-mode.plum  .pm-art{background:var(--pm-plum-soft)}
.pm-root .pm-mode .pm-art svg{width:70%;height:70%}
.pm-root .pm-mode h3{margin:0 0 3px;font-family:var(--pm-kh);font-size:14.5px;
  line-height:1.4;letter-spacing:0}
.pm-root .pm-grid.papers .pm-mode h3{font-size:15.5px}
.pm-root .pm-line{margin:0;font-family:var(--pm-kh);font-size:12.5px;color:var(--pm-muted)}
.pm-root .pm-line b{color:var(--pm-ink);font-weight:600}
.pm-root .pm-arrow{position:absolute;right:12px;top:12px;color:var(--pm-faint);opacity:0;
  transform:translateX(-4px);transition:all .2s ease}
.pm-root .pm-mode:hover .pm-arrow{opacity:1;transform:none}

.pm-root .pm-note{margin-top:14px;display:flex;align-items:center;gap:9px;font-size:12.5px;
  color:var(--pm-muted);background:#FCFBF7;border:1px dashed var(--pm-line);
  border-radius:14px;padding:10px 16px}

@media (max-width:900px){.pm-root .pm-grid.cards{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){
  .pm-root .pm-grid.cards{grid-template-columns:1fr}
  .pm-root .pm-grid.papers{grid-template-columns:1fr}
}
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

const ARROW = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h13M13 6l6 6-6 6"/></svg>;

/** The six modes, with the Khmer copy fixed. Only the stats come from outside. */
export function defaultGroups(stats = {}, num = toKm) {
  const s = { cards: 0, lessonQuestions: 0, examQuestions: 0, examMinutes: 0, ...stats };
  return [
    { label: "កាតហ្វឹកហាត់ · Card drills", layout: "cards", modes: [
      { key:"flip", accent:"green", title:"រំលឹកកាត", line:<>កាត <b>{num(s.cards)}</b></> },
      { key:"mcq", accent:"blue", title:"ជ្រើសរើសចម្លើយ", line:"ជ្រើសពី ៤" },
      { key:"type", accent:"amber", title:"សរសេរចម្លើយ", line:"គ្មានជម្រើស" },
      { key:"match", accent:"plum", title:"ផ្គូផ្គងគូ", line:"ប្រណាំងម៉ោង" },
    ]},
    { label: "ធ្វើតេស្តពេញលេញ · Full papers", layout: "papers", modes: [
      { key:"lesson", accent:"green", title:"លំហាត់អនុវត្ត",
        line:<>សំណួរពីមេរៀន · <b>{num(s.lessonQuestions)}</b></> },
      { key:"mock", accent:"blue", title:"វិញ្ញាសា",
        line:<>សំណួរ <b>{num(s.examQuestions)}</b> · <b>{num(s.examMinutes)}</b> នាទី</> },
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
          <div className={"pm-grid " + g.layout}>
            {g.modes.map(m => (
              <button key={m.key} className={"pm-mode " + m.accent}
                      onClick={() => onStart && onStart(m.key)}>
                <span className="pm-arrow">{ARROW}</span>
                <span className="pm-art">{ART[m.key]}</span>
                <span>
                  <h3>{m.title}</h3>
                  <p className="pm-line">{m.line}</p>
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
