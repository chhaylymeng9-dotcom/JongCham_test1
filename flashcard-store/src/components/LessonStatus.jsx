import React from "react";

/* ─────────────────────────────────────────────────────────────
   LessonStatus — the lesson list on the deck page's Lessons tab.

   Ported from the "lesson status" mockup, in full this time: lessons
   grouped into chapters (rounded badge, pips row, fold/unfold), five
   row states (done, now, rev, next, lock), the gold/grey rail between
   rows, and the exam footer. A chapter starts folded once it's fully
   done or fully locked, open otherwise — same as the reference.

   <LessonStatus
     chapters={[{ n, title, lessons: [{ id, n, title, state, q, min,
                                         score?, at?, needs? }] }]}
     exam={{ label, note, unlocked }}
     numerals="km"                 // or "latin"
     onOpen={lesson => …}          // never fires for state:"lock"
   />

   Every class is prefixed `ls-` and scoped under `.ls-root`.
   ───────────────────────────────────────────────────────────── */

const CSS = `
.ls-root{
  --ls-card:#FFFFFF; --ls-ink:#23271F; --ls-muted:#8B8877; --ls-faint:#B4B0A2;
  --ls-line:#E7E3D7; --ls-green:#2F3A2E; --ls-green-soft:#EAF0E6;
  --ls-gold:#F2C33C; --ls-gold-deep:#C8931B; --ls-amber:#E2A13A; --ls-amber-soft:#FBF1DF;
  --ls-shadow:0 1px 0 rgba(35,39,31,.04), 0 6px 18px rgba(35,39,31,.05);
  --ls-font:"Siemreap","Khmer OS Siemreap","Noto Sans Khmer",system-ui,sans-serif;
  color:var(--ls-ink);font-family:var(--ls-font);
}
.ls-root *{box-sizing:border-box}

.ls-head{display:flex;align-items:baseline;justify-content:space-between;gap:16px}
.ls-head h2{font-size:19px;font-weight:700;margin:0}
.ls-head .of{font-size:14px;color:var(--ls-muted)}
.ls-bar{height:6px;border-radius:99px;background:#E9E5D9;margin:14px 0 6px;overflow:hidden}
.ls-bar i{display:block;height:100%;border-radius:99px;background:var(--ls-green);
  transition:width 1.1s cubic-bezier(.22,1,.36,1)}
.ls-legend{display:flex;flex-wrap:wrap;gap:6px 18px;margin:12px 0 6px;font-size:12.5px;color:var(--ls-muted)}
.ls-legend span{display:inline-flex;align-items:center;gap:7px}
.ls-legend i{width:9px;height:9px;border-radius:99px;display:block}
.ls-legend .k-done{background:var(--ls-green)}
.ls-legend .k-now{background:var(--ls-gold)}
.ls-legend .k-rev{background:var(--ls-amber)}
.ls-legend .k-next{background:#fff;box-shadow:inset 0 0 0 2px var(--ls-green)}
.ls-legend .k-lock{background:#D3CFC1}

/* ---------- a chapter ---------- */
.ls-chap{margin-top:26px;padding-top:24px;border-top:1px dashed var(--ls-line)}
.ls-chap:first-of-type{margin-top:20px;padding-top:0;border-top:0}
.ls-chap-head{width:100%;display:grid;grid-template-columns:44px minmax(0,1fr) auto 20px;
  align-items:center;gap:16px;background:none;border:0;padding:8px 12px 8px 8px;margin:0 -8px 12px;
  border-radius:16px;font:inherit;color:inherit;text-align:left;cursor:pointer;transition:background .15s ease}
.ls-chap-head:hover{background:#F1EEE4}
.ls-ch-badge{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;
  font-size:15px;font-weight:700;background:#fff;border:1.5px solid var(--ls-line);color:var(--ls-muted);
  transition:transform .16s ease}
.ls-chap-head:hover .ls-ch-badge{transform:translateY(-1px)}
.ls-chap.done .ls-ch-badge{background:var(--ls-green);border-color:var(--ls-green);color:#fff}
.ls-chap.open .ls-ch-badge{background:#FDF6E0;border-color:var(--ls-gold);color:#6B4E06}
.ls-chap.locked .ls-ch-badge{background:#F1EEE4;border-color:#E0DCCE;color:#B9B5A6}
.ls-ch-t{min-width:0}
.ls-ch-t .n{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--ls-faint);
  display:block;margin-bottom:3px}
.ls-ch-t h3{font-size:17px;font-weight:700;margin:0;line-height:1.4}
.ls-chap.locked .ls-ch-t h3{color:#8F8B7C}
.ls-pips{display:flex;gap:4px;align-items:center}
.ls-pips i{width:16px;height:6px;border-radius:99px;background:#E4E0D2;display:block}
.ls-pips i.d{background:var(--ls-green)}
.ls-pips i.p{background:var(--ls-gold)}
.ls-pips i.r{background:var(--ls-amber)}
.ls-ch-of{font-size:12.5px;color:var(--ls-muted);margin-left:10px}
.ls-ch-right{display:flex;align-items:center}
.ls-caret{color:var(--ls-faint);display:grid;place-items:center;transition:transform .22s cubic-bezier(.22,1,.36,1)}
.ls-chap.shut .ls-caret{transform:rotate(-90deg)}
.ls-chap-body{display:grid;grid-template-rows:1fr;transition:grid-template-rows .3s cubic-bezier(.22,1,.36,1), opacity .22s ease}
.ls-chap.shut .ls-chap-body{grid-template-rows:0fr;opacity:0}
.ls-chap-body > .ls-inner{overflow:hidden;min-height:0}
.ls-ch-note{margin-top:12px;margin-left:70px;font-size:12.5px;color:var(--ls-faint);
  display:flex;align-items:center;gap:8px;font-style:italic}

/* ---------- the list ---------- */
.ls-list{display:grid;gap:12px;position:relative}
.ls-les{position:relative;display:grid;grid-template-columns:52px minmax(0,1fr) auto;
  align-items:center;gap:18px;background:var(--ls-card);border:1px solid var(--ls-line);
  border-radius:18px;padding:18px;box-shadow:var(--ls-shadow);
  opacity:0;transform:translateY(10px);animation:ls-rise .5s cubic-bezier(.22,1,.36,1) forwards;
  transition:transform .18s ease, box-shadow .18s ease}
@keyframes ls-rise{to{opacity:1;transform:none}}
.ls-les.open:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(35,39,31,.09);cursor:pointer}
.ls-les.lock{background:#FBFAF6;border-style:dashed}

.ls-les::before,.ls-les::after{content:"";position:absolute;left:44px;width:2px;
  background-image:linear-gradient(#D8D4C6 0 0);background-size:2px 4px;background-repeat:repeat-y}
.ls-les::before{top:-13px;height:13px}
.ls-les::after{bottom:-13px;height:13px}
.ls-les:first-child::before,.ls-les:last-child::after{display:none}
.ls-les.done::after,.ls-les.done + .ls-les::before{background-image:linear-gradient(var(--ls-gold) 0 0)}

.ls-med{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;
  font-size:15px;font-weight:700;border:2px solid var(--ls-line);background:#fff;color:var(--ls-faint);position:relative}
.ls-les.done .ls-med{background:var(--ls-green);border-color:var(--ls-green);color:#fff}
.ls-les.now  .ls-med{background:var(--ls-gold);border-color:var(--ls-gold-deep);color:#3A2E08}
.ls-les.rev  .ls-med{background:var(--ls-amber-soft);border-color:var(--ls-amber);color:var(--ls-amber)}
.ls-les.next .ls-med{background:#fff;border-color:var(--ls-green);color:var(--ls-green)}
.ls-les.lock .ls-med{background:#F1EEE4;border-color:#E0DCCE;color:#B9B5A6}
.ls-les.now .ls-med::after{content:"";position:absolute;inset:-6px;border-radius:50%;
  border:2px solid var(--ls-gold);opacity:.55;animation:ls-ping 2.2s ease-out infinite}
@keyframes ls-ping{0%{transform:scale(.86);opacity:.55}70%{transform:scale(1.12);opacity:0}100%{opacity:0}}

.ls-body{min-width:0}
.ls-tag{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;display:inline-block;
  margin:0 0 5px;padding:3px 8px;border-radius:5px}
.ls-les.done .ls-tag{color:var(--ls-green);background:var(--ls-green-soft)}
.ls-les.now  .ls-tag{color:#6B4E06;background:#FBEFCC}
.ls-les.rev  .ls-tag{color:#9A6B14;background:var(--ls-amber-soft)}
.ls-les.next .ls-tag{color:var(--ls-muted);background:#F2EFE5}
.ls-les.lock .ls-tag{color:var(--ls-faint);background:#F1EEE4}

.ls-body h3{font-size:16px;font-weight:700;margin:0;line-height:1.5;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.ls-les.lock .ls-body h3{color:#8F8B7C}
.ls-meta{margin:6px 0 0;font-size:13px;color:var(--ls-muted);
  display:flex;flex-wrap:wrap;align-items:center;gap:5px 10px;line-height:1.7}
.ls-meta b{font-weight:700;color:var(--ls-ink)}
.ls-meta .ls-mini{flex-basis:100%;max-width:240px}
.ls-dot{width:3px;height:3px;border-radius:99px;background:var(--ls-faint);display:inline-block}
.ls-mini{margin-top:9px;height:5px;border-radius:99px;background:#EEEADE;overflow:hidden}
.ls-mini i{display:block;height:100%;border-radius:99px;background:var(--ls-gold);
  transition:width 1.2s cubic-bezier(.22,1,.36,1) .3s}

.ls-side{display:flex;align-items:center;gap:14px}
.ls-score{display:flex;align-items:center;gap:7px;font-size:15px;font-weight:700}
.ls-score.low{color:var(--ls-amber)}
.ls-btn{font-size:13px;font-weight:700;padding:0 18px;height:42px;border-radius:12px;cursor:pointer;
  border:1.5px solid var(--ls-line);background:#fff;color:var(--ls-ink);
  display:inline-flex;align-items:center;gap:7px;white-space:nowrap;
  transition:transform .12s ease, background .15s ease, border-color .15s ease}
.ls-btn:hover{border-color:#D6D1C1}
.ls-btn:active{transform:translateY(1px)}
.ls-btn.solid{background:var(--ls-green);border-color:var(--ls-green);color:#fff}
.ls-btn.solid:hover{background:#3B4A38;border-color:#3B4A38}
.ls-btn.gold{background:var(--ls-gold);border-color:var(--ls-gold-deep);color:#3A2E08}
.ls-btn.gold:hover{background:#F6CE55}
.ls-btn[disabled]{cursor:not-allowed;background:#F1EEE4;border-color:#E5E1D3;color:#B4B0A2}
.ls-btn[disabled]:active{transform:none}

.ls-after{margin-top:22px;border:1px dashed var(--ls-line);border-radius:18px;background:#FCFBF7;
  padding:18px 20px;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.ls-after p{margin:0;font-size:13.5px;color:var(--ls-muted)}
.ls-after b{color:var(--ls-ink);display:block;font-size:14px;margin-bottom:3px}

@media (max-width:640px){
  .ls-chap-head{grid-template-columns:40px minmax(0,1fr) 20px;row-gap:10px}
  .ls-ch-badge{width:40px;height:40px;border-radius:12px}
  .ls-chap-head .ls-caret{grid-column:3;grid-row:1}
  .ls-ch-right{grid-column:1 / -1;grid-row:2;justify-content:flex-start}
  .ls-les{grid-template-columns:44px minmax(0,1fr);row-gap:12px;padding:15px}
  .ls-les::before,.ls-les::after{left:37px}
  .ls-med{width:38px;height:38px;font-size:13px}
  .ls-side{grid-column:1 / -1;justify-content:space-between}
  .ls-btn{flex:1;justify-content:center}
  .ls-body h3{white-space:normal}
  .ls-ch-note{margin-left:0}
}
`;

const KD = "០១២៣៤៥៦៧៨៩";
const toKm = (n) => String(n).replace(/[0-9]/g, (d) => KD[+d]);

let starId = 0;
function Star({ pct }) {
  const id = React.useMemo(() => "ls-sg" + ++starId, []);
  const p = Math.max(0, Math.min(100, pct));
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset={`${p}%`} stopColor="#F2C33C" />
          <stop offset={`${p}%`} stopColor="#FFFFFF" />
        </linearGradient>
      </defs>
      <path
        d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z"
        fill={`url(#${id})`}
        stroke="#23271F"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ICON = {
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.5 10 17.5 19 7" />
    </svg>
  ),
  play: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4.5l13 7.5-13 7.5z" />
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <rect x="5" y="10.5" width="14" height="10" rx="2.4" />
      <path d="M8.4 10.5V8a3.6 3.6 0 017.2 0v2.5" />
    </svg>
  ),
  redo: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 11a8 8 0 10-2.3 5.6" />
      <path d="M20 4.5V11h-6.4" />
    </svg>
  ),
  caret: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9l7 7 7-7" />
    </svg>
  ),
  lockS: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
      <rect x="5" y="10.5" width="14" height="10" rx="2.4" />
      <path d="M8.4 10.5V8a3.6 3.6 0 017.2 0v2.5" />
    </svg>
  ),
};
const Dot = () => <span className="ls-dot" />;

function chapState(c) {
  if (c.lessons.every((l) => l.state === "done")) return "done";
  if (c.lessons.every((l) => l.state === "lock")) return "locked";
  return "open";
}

function LessonRow({ l, numerals, onOpen }) {
  const num = numerals === "km" ? toKm : String;
  const openable = l.state !== "lock";

  let med, tag, meta, side;
  if (l.state === "done") {
    med = ICON.check;
    tag = "Complete";
    meta = (
      <>
        <b>{num(l.q)} សំណួរ</b> <Dot /> {num(l.min)} នាទី <Dot /> បានបញ្ចប់
      </>
    );
    side = (
      <>
        <span className="ls-score">
          <Star pct={l.score} />
          {num(l.score)}%
        </span>
        <button className="ls-btn" onClick={() => onOpen(l)}>
          {ICON.redo} Review
        </button>
      </>
    );
  } else if (l.state === "now") {
    const leftMin = Math.max(1, l.min - Math.round((l.min * l.at) / l.q));
    med = ICON.play;
    tag = "In progress";
    meta = (
      <>
        <b>
          {num(l.at)} ក្នុងចំណោម {num(l.q)}
        </b>{" "}
        សំណួរ <Dot /> នៅសល់ប្រហែល {num(leftMin)} នាទី
        <div className="ls-mini">
          <i style={{ width: `${Math.round((l.at / l.q) * 100)}%` }} />
        </div>
      </>
    );
    side = (
      <button className="ls-btn gold" onClick={() => onOpen(l)}>
        {ICON.play} Continue
      </button>
    );
  } else if (l.state === "rev") {
    med = ICON.check;
    tag = "Needs review";
    meta = (
      <>
        ពិន្ទុលើកមុន <b>{num(l.score)}%</b> <Dot /> ត្រូវការ ៧០% ទើបចាត់ថាមាំ
      </>
    );
    side = (
      <>
        <span className="ls-score low">
          <Star pct={l.score} />
          {num(l.score)}%
        </span>
        <button className="ls-btn" onClick={() => onOpen(l)}>
          {ICON.redo} Practise
        </button>
      </>
    );
  } else if (l.state === "next") {
    med = num(l.n);
    tag = "Up next";
    meta = (
      <>
        <b>{num(l.q)} សំណួរ</b> <Dot /> {num(l.min)} នាទី
      </>
    );
    side = (
      <button className="ls-btn solid" onClick={() => onOpen(l)}>
        {ICON.play} Start
      </button>
    );
  } else {
    med = ICON.lock;
    tag = "Locked";
    meta = <>បញ្ចប់មេរៀនទី {num(l.needs)} ដើម្បីបើកមេរៀននេះ</>;
    side = (
      <button className="ls-btn" disabled>
        Locked
      </button>
    );
  }

  return (
    <article className={`ls-les ${l.state}${openable ? " open" : ""}`} onClick={openable ? () => onOpen(l) : undefined}>
      <span className="ls-med">{med}</span>
      <div className="ls-body">
        <span className="ls-tag">{tag}</span>
        <h3>
          មេរៀនទី {num(l.n)} · {l.title}
        </h3>
        <div className="ls-meta">{meta}</div>
      </div>
      <div className="ls-side" onClick={(e) => e.stopPropagation()}>
        {side}
      </div>
    </article>
  );
}

function Chapter({ c, shut, onToggle, numerals, onOpen }) {
  const num = numerals === "km" ? toKm : String;
  const st = chapState(c);
  const done = c.lessons.filter((l) => l.state === "done").length;
  const mins = c.lessons.reduce((a, l) => a + l.min, 0);

  return (
    <section className={`ls-chap ${st}${shut ? " shut" : ""}`}>
      <button type="button" className="ls-chap-head" aria-expanded={!shut} onClick={onToggle}>
        <span className="ls-ch-badge">{st === "done" ? ICON.check : st === "locked" ? ICON.lock : num(c.n)}</span>
        <span className="ls-ch-t">
          <span className="n">ជំពូកទី {num(c.n)}</span>
          <h3>{c.title}</h3>
        </span>
        <span className="ls-ch-right">
          <span className="ls-pips">
            {c.lessons.map((l, i) => (
              <i key={i} className={l.state === "done" ? "d" : l.state === "now" ? "p" : l.state === "rev" ? "r" : ""} />
            ))}
          </span>
          <span className="ls-ch-of">
            {num(done)}/{num(c.lessons.length)}
            {st === "locked" ? "" : ` · ${num(mins)} នាទី`}
          </span>
        </span>
        <span className="ls-caret">{ICON.caret}</span>
      </button>
      <div className="ls-chap-body">
        <div className="ls-inner">
          <div className="ls-list">
            {c.lessons.map((l) => (
              <LessonRow key={l.id} l={l} numerals={numerals} onOpen={onOpen} />
            ))}
          </div>
          {st === "locked" && (
            <p className="ls-ch-note">
              {ICON.lockS} បើកនៅពេលបញ្ចប់ជំពូកទី {num(c.n - 1)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function LessonStatus({ chapters = [], exam, numerals = "km", onOpen }) {
  const num = numerals === "km" ? toKm : String;
  const all = chapters.flatMap((c) => c.lessons);
  const done = all.filter((l) => l.state === "done").length;
  const pct = all.length ? (done / all.length) * 100 : 0;

  const [shut, setShut] = React.useState(() => chapters.map((c) => ["done", "locked"].includes(chapState(c))));
  React.useEffect(() => {
    setShut(chapters.map((c) => ["done", "locked"].includes(chapState(c))));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapters.length]);

  return (
    <div className="ls-root">
      <style>{CSS}</style>

      <div className="ls-head">
        <h2>
          ជំពូក {num(chapters.length)} · មេរៀន {num(all.length)}
        </h2>
        <span className="of">
          បានបញ្ចប់ {num(done)} / {num(all.length)}
        </span>
      </div>
      <div className="ls-bar">
        <i style={{ width: pct + "%" }} />
      </div>
      <div className="ls-legend">
        <span>
          <i className="k-done" /> Complete
        </span>
        <span>
          <i className="k-now" /> In progress
        </span>
        <span>
          <i className="k-rev" /> Needs review
        </span>
        <span>
          <i className="k-next" /> Up next
        </span>
        <span>
          <i className="k-lock" /> Locked
        </span>
      </div>

      {chapters.map((c, i) => (
        <Chapter
          key={c.n}
          c={c}
          shut={shut[i]}
          onToggle={() => setShut((s) => s.map((v, j) => (j === i ? !v : v)))}
          numerals={numerals}
          onOpen={onOpen}
        />
      ))}

      {exam && (
        <div className="ls-after">
          <p>
            <b>{exam.label}</b>
            {exam.note}
          </p>
          <button className="ls-btn" disabled={!exam.unlocked}>
            {exam.unlocked ? "Exam" : "Exam locked"}
          </button>
        </div>
      )}
    </div>
  );
}
