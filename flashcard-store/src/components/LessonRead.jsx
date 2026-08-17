import React from "react";

/* ─────────────────────────────────────────────────────────────
   LessonRead — the page a student reads before the exercise.

   Chrome (top bar, hero, reading progress, section chips, the
   self-check accordion, the bottom CTA) is this component.
   The lesson body is your content, passed in as `html`.

   <LessonRead
     lesson={{ title:"តម្រូវប្រសាទ", subtitle:"Nervous Regulation",
               chapterN:3, n:5, minutes:12, questions:14,
               course:"Biology · ជីវវិទ្យា" }}
     html={lessonBodyHtml}          // <section><h2>…</h2>…</section> blocks
     qa={[["សំណួរ…","ចម្លើយ…"]]}     // optional self-check
     nav                            // show the section chips
     numerals="km"                  // or "latin"
     onBack={…} onClose={…} onStart={…}
   />

   Every class is prefixed `lr-` and scoped under `.lr-root`.
   ───────────────────────────────────────────────────────────── */

const CSS = `
.lr-root{
  --lr-card:#FFFFFF; --lr-ink:#23271F; --lr-muted:#8B8877; --lr-faint:#B4B0A2;
  --lr-line:#E7E3D7; --lr-green:#2F3A2E; --lr-green-soft:#EAF0E6;
  --lr-gold:#F2C33C; --lr-gold-soft:#FBEFCC; --lr-red:#C2503C;
  --lr-shadow:0 1px 0 rgba(35,39,31,.04), 0 6px 18px rgba(35,39,31,.05);
  --lr-font:"Siemreap","Khmer OS Siemreap","Noto Sans Khmer",system-ui,sans-serif;
  color:var(--lr-ink);line-height:1.75;font-family:var(--lr-font);
}
.lr-root *{box-sizing:border-box}

/* top bar */
.lr-root .lr-top{position:sticky;top:0;z-index:40;background:rgba(247,245,239,.94);
  backdrop-filter:blur(10px);border-bottom:1px solid var(--lr-line);margin:0 -20px}
.lr-root .lr-tin{max-width:820px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;gap:12px}
.lr-root .lr-ttl{flex:1;min-width:0}
.lr-root .lr-ttl b{display:block;font-size:15.5px;line-height:1.4;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lr-root .lr-ttl span{font-size:11.5px;color:var(--lr-muted)}
.lr-root .lr-read{height:3px;background:#E9E5D9}
.lr-root .lr-read i{display:block;height:100%;background:var(--lr-gold)}
.lr-root .lr-ib{width:40px;height:40px;border-radius:12px;border:1.5px solid var(--lr-line);
  background:#fff;cursor:pointer;display:grid;place-items:center;color:var(--lr-ink);flex:none}
.lr-root .lr-ib:hover{border-color:#D6D1C1}
.lr-root .lr-ib.x{background:var(--lr-red);border-color:var(--lr-red);color:#fff}

/* hero */
.lr-root .lr-page{max-width:820px;margin:0 auto;padding:26px 0 130px}
.lr-root .lr-hero{background:var(--lr-card);border:1px solid var(--lr-line);border-radius:20px;
  padding:24px;box-shadow:var(--lr-shadow);margin-bottom:22px}
.lr-root .lr-kick{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;
  color:var(--lr-faint);margin:0}
.lr-root .lr-hero h1{margin:6px 0 4px;font-size:24px;line-height:1.4;letter-spacing:0}
.lr-root .lr-hero .lr-en{margin:0;font-size:13px;color:var(--lr-muted)}
.lr-root .lr-facts{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.lr-root .lr-fact{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;
  color:var(--lr-muted);background:#F4F1E7;border-radius:99px;padding:5px 12px}
.lr-root .lr-fact b{color:var(--lr-ink)}

/* chips */
.lr-root .lr-nav{display:flex;gap:8px;overflow-x:auto;padding:2px 0 12px;margin-bottom:12px;
  scrollbar-width:none}
.lr-root .lr-nav::-webkit-scrollbar{display:none}
.lr-root .lr-nav button{white-space:nowrap;font:inherit;font-size:12.5px;color:var(--lr-muted);
  background:#fff;border:1px solid var(--lr-line);border-radius:99px;padding:6px 14px;
  cursor:pointer;transition:all .15s ease}
.lr-root .lr-nav button:hover{border-color:#D6D1C1;color:var(--lr-ink)}
.lr-root .lr-nav button.on{background:var(--lr-green);border-color:var(--lr-green);color:#fff}

/* ── the lesson body ─────────────────────────────────────── */
.lr-root .lr-md section{background:var(--lr-card);border:1px solid var(--lr-line);
  border-radius:20px;padding:22px;box-shadow:var(--lr-shadow);margin-bottom:16px;scroll-margin-top:96px}
.lr-root .lr-md section > h2{display:flex;align-items:center;gap:11px;margin:0 0 14px;
  font-size:17px;line-height:1.45;letter-spacing:0}
.lr-root .lr-md section > h2 .n{width:30px;height:30px;border-radius:9px;flex:none;
  display:grid;place-items:center;background:var(--lr-green-soft);color:var(--lr-green);font-size:13px}
.lr-root .lr-md h3{margin:18px 0 8px;font-size:14.5px;color:var(--lr-muted);letter-spacing:0}
.lr-root .lr-md p{margin:0 0 12px;font-size:15px}
.lr-root .lr-md p:last-child{margin-bottom:0}
.lr-root .lr-md .en-i{color:var(--lr-muted);font-size:.92em}
.lr-root .lr-md ul.b{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.lr-root .lr-md ul.b li{display:flex;gap:10px;font-size:14.5px;align-items:flex-start}
.lr-root .lr-md ul.b li::before{content:"";width:7px;height:7px;border-radius:2px;
  background:var(--lr-gold);flex:none;margin-top:10px}
.lr-root .lr-md .call{border-radius:14px;padding:14px 16px;font-size:14.5px;margin:14px 0 0}
.lr-root .lr-md .call.ex{background:var(--lr-gold-soft)}
.lr-root .lr-md .call.key{background:var(--lr-green-soft)}
.lr-root .lr-md .call b{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--lr-muted);margin-bottom:5px}
.lr-root .lr-md table{width:100%;border-collapse:collapse;font-size:14px;margin-top:6px}
.lr-root .lr-md th{text-align:left;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--lr-faint);font-weight:400;padding:0 10px 8px;border-bottom:1px solid var(--lr-line)}
.lr-root .lr-md td{padding:11px 10px;border-bottom:1px solid #F1EEE4;vertical-align:top;line-height:1.65}
.lr-root .lr-md tr:last-child td{border-bottom:0}
.lr-root .lr-md td:first-child{white-space:nowrap}
.lr-root .lr-md .tw{overflow-x:auto}
.lr-root .lr-md .trio{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:4px}
.lr-root .lr-md .trio div{background:#FBFAF6;border:1px solid var(--lr-line);border-radius:14px;padding:14px}
.lr-root .lr-md .trio b{display:block;font-size:14px;margin-bottom:5px}
.lr-root .lr-md .trio span{font-size:13px;color:var(--lr-muted);line-height:1.6}
.lr-root .lr-md .flow{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px}
.lr-root .lr-md .flow span{background:#fff;border:1.5px solid var(--lr-line);border-radius:11px;
  padding:7px 13px;font-size:13.5px}
.lr-root .lr-md .flow span.hot{background:var(--lr-gold-soft);border-color:var(--lr-gold)}
.lr-root .lr-md .flow i{color:var(--lr-faint);font-style:normal}
.lr-root .lr-md ol.steps{counter-reset:s;list-style:none;margin:0;padding:0;display:grid;gap:9px}
.lr-root .lr-md ol.steps li{counter-increment:s;display:flex;gap:11px;font-size:14.5px;align-items:flex-start}
.lr-root .lr-md ol.steps li::before{content:counter(s);width:24px;height:24px;border-radius:8px;
  flex:none;background:#F2EFE5;color:var(--lr-muted);font-size:12px;display:grid;place-items:center;margin-top:3px}
.lr-root .lr-md figure{margin:0}
.lr-root .lr-md figure svg{width:100%;height:auto;display:block}
.lr-root .lr-md figcaption{font-size:12.5px;color:var(--lr-faint);text-align:center;margin-top:6px}
.lr-root .lr-md .gl{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lr-root .lr-md .gl div{display:flex;justify-content:space-between;gap:10px;background:#FBFAF6;
  border:1px solid var(--lr-line);border-radius:12px;padding:9px 13px;font-size:13.5px}
.lr-root .lr-md .gl span{color:var(--lr-muted);font-size:12.5px;text-align:right}

/* self check */
.lr-root .lr-qa{background:var(--lr-card);border:1px solid var(--lr-line);border-radius:20px;
  padding:22px;box-shadow:var(--lr-shadow);margin-bottom:16px;scroll-margin-top:96px}
.lr-root .lr-qa > h2{display:flex;align-items:center;gap:11px;margin:0 0 6px;font-size:17px;letter-spacing:0}
.lr-root .lr-qa > h2 .n{width:30px;height:30px;border-radius:9px;flex:none;display:grid;
  place-items:center;background:var(--lr-green-soft);color:var(--lr-green);font-size:13px}
.lr-root .lr-qa > p{margin:0 0 14px;font-size:13.5px;color:var(--lr-muted)}
.lr-root .lr-item{border:1px solid var(--lr-line);border-radius:14px;overflow:hidden;
  margin-bottom:8px;background:#FBFAF6}
.lr-root .lr-item button{width:100%;text-align:left;background:none;border:0;cursor:pointer;
  font:inherit;font-size:14.5px;color:var(--lr-ink);padding:13px 15px;display:flex;gap:10px;align-items:flex-start}
.lr-root .lr-item button .c{margin-left:auto;color:var(--lr-faint);flex:none;transition:transform .2s ease}
.lr-root .lr-item.on button .c{transform:rotate(180deg)}
.lr-root .lr-item .a{display:grid;grid-template-rows:0fr;
  transition:grid-template-rows .28s cubic-bezier(.22,1,.36,1)}
.lr-root .lr-item.on .a{grid-template-rows:1fr}
.lr-root .lr-item .a > div{overflow:hidden}
.lr-root .lr-item .a p{margin:0;padding:0 15px 14px 44px;font-size:14px;color:var(--lr-muted)}

/* bottom bar */
.lr-root .lr-cta{position:fixed;left:0;right:0;bottom:0;z-index:40;
  background:rgba(247,245,239,.94);backdrop-filter:blur(10px);border-top:1px solid var(--lr-line)}
.lr-root .lr-cin{max-width:820px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;gap:14px}
.lr-root .lr-ctxt{flex:1;min-width:0}
.lr-root .lr-ctxt b{display:block;font-size:14px}
.lr-root .lr-ctxt span{font-size:12px;color:var(--lr-muted)}
.lr-root .lr-go{font:inherit;font-size:14.5px;padding:0 24px;height:48px;border-radius:14px;
  border:1.5px solid #C8931B;background:var(--lr-gold);color:#3A2E08;cursor:pointer;
  display:inline-flex;align-items:center;gap:9px;white-space:nowrap;
  transition:transform .12s ease,background .15s ease}
.lr-root .lr-go:hover{background:#F6CE55}
.lr-root .lr-go:active{transform:translateY(1px)}

@media (max-width:640px){
  .lr-root .lr-hero h1{font-size:20px}
  .lr-root .lr-md section,.lr-root .lr-qa{padding:18px 16px;border-radius:18px}
  .lr-root .lr-md .trio{grid-template-columns:1fr}
  .lr-root .lr-md .gl{grid-template-columns:1fr}
  .lr-root .lr-ctxt{display:none}
  .lr-root .lr-go{width:100%;justify-content:center}
  .lr-root .lr-ttl b{font-size:14px}
}
`;

const KD = "០១២៣៤៥៦៧៨៩";
const toKm = n => String(n).replace(/[0-9]/g, d => KD[+d]);

const I = {
  back : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7"/></svg>,
  x    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  play : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5l13 7.5-13 7.5z"/></svg>,
  caret: <svg className="c" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l7 7 7-7"/></svg>,
};

export default function LessonRead({
  lesson = {}, html = "", qa = [], nav = true, numerals = "km",
  onBack, onClose, onStart, labels = {},
}) {
  const num = numerals === "km" ? toKm : String;
  const L = {
    sections: "ផ្នែក", read: "អាន", min: "នាទី", ex: "លំហាត់", q: "សំណួរ",
    selfCheck: "ឆ្លើយដោយខ្លួនឯង",
    selfHint: "សាកល្បងឆ្លើយក្នុងចិត្តសិន ទើបចុចមើលចម្លើយ។",
    ready: "រួចរាល់ហើយឬនៅ?", start: "ចាប់ផ្តើមលំហាត់", ...labels,
  };

  const bodyRef = React.useRef(null);
  const [chips, setChips] = React.useState([]);
  const [here, setHere]   = React.useState(null);
  const [open, setOpen]   = React.useState({});
  const [pct, setPct]     = React.useState(0);

  /* give every section an id and build the chip row from its h2 */
  React.useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    const found = [];
    root.querySelectorAll("section").forEach((s, i) => {
      if (!s.id) s.id = "lr-s" + i;
      const h2 = s.querySelector("h2");
      const label = s.dataset.nav
        || (h2 ? h2.textContent.replace(/^\s*[\d០-៩.]+\s*/, "").split(/[·(]/)[0].trim() : "");
      if (label) found.push({ id: s.id, label });
    });
    setChips(found);
  }, [html]);

  /* reading progress, and which chip is lit */
  React.useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? Math.min(100, window.scrollY / h * 100) : 0);
      const root = bodyRef.current;
      if (!root) return;
      let cur = null;
      root.querySelectorAll("section").forEach(s => {
        if (s.getBoundingClientRect().top <= 140) cur = s.id;
      });
      setHere(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [chips]);

  const jump = id => document.getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="lr-root">
      <style>{CSS}</style>

      <div className="lr-top">
        <div className="lr-tin">
          <button className="lr-ib" onClick={onBack} aria-label="Back">{I.back}</button>
          <span className="lr-ttl">
            <b>{lesson.title}</b>
            <span>
              {lesson.chapterN != null && `ជំពូកទី ${num(lesson.chapterN)} · `}
              {lesson.n != null && `មេរៀនទី ${num(lesson.n)} · `}
              {lesson.course}
            </span>
          </span>
          {onClose && <button className="lr-ib x" onClick={onClose} aria-label="Close">{I.x}</button>}
        </div>
        <div className="lr-read"><i style={{ width: pct + "%" }} /></div>
      </div>

      <div className="lr-page">
        <div className="lr-hero">
          {lesson.course && <p className="lr-kick">{lesson.course}</p>}
          <h1>{lesson.title}</h1>
          {lesson.subtitle && <p className="lr-en">{lesson.subtitle}</p>}
          <div className="lr-facts">
            {chips.length > 0 && <span className="lr-fact">📖 <b>{num(chips.length)}</b> {L.sections}</span>}
            {lesson.minutes && <span className="lr-fact">⏱️ {L.read} <b>{num(lesson.minutes)}</b> {L.min}</span>}
            {lesson.questions && <span className="lr-fact">✍️ {L.ex} <b>{num(lesson.questions)}</b> {L.q}</span>}
          </div>
        </div>

        {nav && chips.length > 1 && (
          <div className="lr-nav">
            {chips.map(c => (
              <button key={c.id} className={here === c.id ? "on" : ""}
                      onClick={() => jump(c.id)}>{c.label}</button>
            ))}
          </div>
        )}

        {/* your lesson body */}
        <div className="lr-md" ref={bodyRef} dangerouslySetInnerHTML={{ __html: html }} />

        {qa.length > 0 && (
          <div className="lr-qa">
            <h2><span className="n">?</span> {L.selfCheck}</h2>
            <p>{L.selfHint}</p>
            {qa.map(([q, a], i) => (
              <div key={i} className={"lr-item" + (open[i] ? " on" : "")}>
                <button onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))}>
                  <span>{num(i + 1)}. {q}</span>{I.caret}
                </button>
                <div className="a"><div><p>{a}</p></div></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lr-cta">
        <div className="lr-cin">
          <span className="lr-ctxt">
            <b>{L.ready}</b>
            <span>{L.ex} {num(lesson.questions || 0)} {L.q}{lesson.exerciseMinutes
              ? ` · ${num(lesson.exerciseMinutes)} ${L.min}` : ""}</span>
          </span>
          <button className="lr-go" onClick={onStart}>{I.play} {L.start}</button>
        </div>
      </div>
    </div>
  );
}
