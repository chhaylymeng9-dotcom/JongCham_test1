/* CoursePicker.jsx — the "my courses" button, its dropdown, and the course shop
 *
 *   import CoursePicker, { StarsPill } from "./CoursePicker";
 *
 *   <CoursePicker subjects={subjects} current={current} stars={stars}
 *                 onSelect={setCurrent} onBuy={(k, price) => …} />
 *   <StarsPill stars={stars} />
 *
 * Self-contained: styles and the pixel star are embedded, so there is nothing
 * to import and no asset to copy. Khmer glyphs need the Siemreap font in the
 * host page:
 *   <link href="https://fonts.googleapis.com/css2?family=Siemreap&display=swap" rel="stylesheet">
 */
import React from "react";
import { createPortal } from "react-dom";

const CSS = `/* ==================================================================
   COURSE PICKER — copy from here
   ================================================================== */

  /* ---------- the strip the buttons live in ---------- */
  .strip{display:flex;align-items:center;gap:10px;justify-content:flex-end}

  /* button 1 — the course you are studying */
  .course-btn{position:relative;display:flex;align-items:center;gap:9px;height:70px;
              min-width:150px;padding:0 18px 0 14px;border-radius:16px;cursor:pointer;
              background:var(--sheet);border:1px solid var(--hair);
              box-shadow:0 3px 0 var(--hair);font:inherit;color:var(--ink);
              transition:all .14s var(--e)}
  .course-btn:hover{border-color:var(--green-line);transform:translateY(-1px)}
  .course-btn:active{transform:translateY(2px);box-shadow:0 1px 0 var(--hair)}
  .course-btn.open{border-color:var(--green-line);box-shadow:0 1px 0 var(--hair);
                   transform:translateY(2px)}
  .course-btn .tile{width:34px;height:34px;flex:none;border-radius:11px;display:grid;
                    place-items:center;color:#fff}
  .course-btn .nm{font-size:14px;font-weight:700;white-space:nowrap}
  .course-btn .caret{color:var(--faint);transition:transform .18s var(--e)}
  .course-btn.open .caret{transform:rotate(180deg)}

  /* a stat pill, for the rest of the strip */
  .pill{display:flex;align-items:center;justify-content:center;gap:8px;height:70px;
        min-width:150px;padding:0 18px;
        border-radius:16px;background:var(--sheet);border:1px solid var(--hair);
        box-shadow:0 3px 0 var(--hair)}
  .pill b{font-family:var(--type);font-size:17px;font-weight:700;line-height:1}
  .pill i{font-style:normal;font-size:9.5px;font-weight:800;letter-spacing:.12em;
          text-transform:uppercase;color:var(--muted);display:block;margin-top:2px}

  /* ---------- the dropdown ---------- */
  .drop-wrap{position:relative}
  .drop{position:absolute;top:calc(100% + 12px);right:0;z-index:40;width:270px;
        background:var(--sheet);border:1px solid var(--hair);border-radius:18px;
        box-shadow:0 10px 0 rgba(225,219,204,.55),0 18px 34px rgba(31,29,24,.16);
        overflow:hidden;animation:dropIn .2s var(--pop) both}
  .drop[hidden]{display:none}
  @keyframes dropIn{from{opacity:0;transform:translateY(-8px) scale(.97)}
                    to{opacity:1;transform:none}}
  .drop .tip{position:absolute;top:-9px;right:26px;width:16px;height:16px;
             background:var(--sheet);border-left:1px solid var(--hair);
             border-top:1px solid var(--hair);transform:rotate(45deg)}
  .drop .lab{margin:0;padding:14px 16px 8px;font-size:10px;font-weight:800;
             letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
  .drop-row{display:flex;align-items:center;gap:12px;width:100%;padding:11px 16px;
            border:0;border-top:1px solid #F4F0E6;background:none;cursor:pointer;
            text-align:left;font:inherit;transition:background .14s var(--e)}
  .drop-row:hover{background:#FBF9F3}
  .drop-row .tile{width:38px;height:38px;flex:none;border-radius:12px;display:grid;
                  place-items:center;color:#fff}
  .drop-row b{flex:1;font-size:14.5px;font-weight:700}
  .drop-row.on b{color:var(--green-btn)}
  .drop-row .tick{color:var(--green-btn)}
  .drop-row.add .tile{background:var(--track);color:var(--muted);
                      border:1.5px dashed var(--hair-2)}
  .drop-row.add b{font-weight:600}

  /* ---------- the catalogue ----------
     Portalled to <body> (see the component below) so the path's nodes
     can never paint over it — which also means it sits outside the host
     page's .lp-root, so it can't see that element's design-token custom
     properties (--paper, --sheet, ...) through inheritance. Redeclared
     here with the same values so .cat's descendants still resolve them. */
  .veil, .cat{
    --paper:#F7F4ED; --sheet:#FFFFFF; --ink:#1C1A15; --body:#4A473F;
    --muted:#857F73; --faint:#AEA89A; --hair:#E1DBCC; --hair-2:#CFC8B6; --track:#E8E2D5;
    --green:#243529; --green-mid:#3E5F48; --green-btn:#3E8F52;
    --green-soft:#E5EBE4; --green-line:#B2C6B4;
    --brass:#8E6F2A; --brass-soft:#F3EBD8;
    --type:"Courier Prime","American Typewriter","Courier New",monospace;
    --sans:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
    --e:cubic-bezier(.2,.7,.2,1);
    --pop:cubic-bezier(.34,1.5,.4,1);
  }
  .veil{position:fixed;inset:0;z-index:70;background:rgba(31,29,24,.45);
        -webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);animation:fade .22s var(--e) both}
  .veil[hidden]{display:none}
  @keyframes fade{from{opacity:0}to{opacity:1}}
  .cat{position:fixed;inset:0;z-index:71;display:grid;place-items:center;padding:20px}
  .cat[hidden]{display:none}
  .cat-box{width:min(880px,100%);max-height:88vh;overflow-y:auto;background:var(--paper);
           border:1px solid var(--hair);border-radius:26px;padding:24px 24px 26px;
           box-shadow:0 24px 56px rgba(31,29,24,.26);
           animation:boxIn .32s var(--pop) both}
  @keyframes boxIn{from{opacity:0;transform:translateY(20px) scale(.96)}to{opacity:1;transform:none}}
  .cat-head{display:flex;align-items:center;justify-content:space-between;gap:14px;
            margin-bottom:18px}
  .cat-head h2{margin:0;font-family:var(--type);font-size:22px;font-weight:700;
               letter-spacing:-.02em;color:var(--green)}
  .cat-x{width:36px;height:36px;flex:none;border:0;border-radius:50%;cursor:pointer;
         display:grid;place-items:center;background:var(--track);color:var(--body);
         transition:all .14s var(--e)}
  .cat-x:hover{background:var(--hair-2);color:var(--ink);transform:rotate(90deg)}

  .cat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
  @media (max-width:760px){ .cat-grid{grid-template-columns:repeat(3,1fr)} }
  @media (max-width:520px){ .cat-grid{grid-template-columns:repeat(2,1fr)} }

  .sub{position:relative;display:grid;justify-items:center;gap:4px;padding:20px 12px 16px;
       background:var(--sheet);border:1px solid var(--hair);border-radius:20px;
       box-shadow:0 4px 0 var(--hair);cursor:pointer;font:inherit;text-align:center;
       animation:up .38s var(--e) both;transition:all .14s var(--e)}
  @keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .sub:hover{border-color:var(--green-line);transform:translateY(-2px);
             box-shadow:0 6px 0 var(--hair)}
  .sub:active{transform:translateY(2px);box-shadow:0 1px 0 var(--hair)}
  .sub .tile{width:64px;height:64px;border-radius:20px;display:grid;place-items:center;
             color:#fff;margin-bottom:8px;box-shadow:0 3px 8px rgba(28,26,21,.16)}
  .sub b{font-size:14.5px;font-weight:700;line-height:1.25}
  /* scoped: a bare \`.sub span\` also hits the tile and its glyph */
  .sub .learners{font-size:11.5px;color:var(--muted)}
  .sub .tick{position:absolute;top:10px;right:10px;width:24px;height:24px;border-radius:8px;
             display:grid;place-items:center;background:var(--green-btn);color:#fff}
  .sub.on{border-color:var(--green-line);background:#F6FAF6}

  /* ---------- the price ---------- */
  .star{width:17px;height:auto;flex:none;display:block;border-radius:4px}
  .price{display:inline-flex;align-items:center;gap:6px;margin-top:8px;padding:5px 12px 5px 9px;
         border-radius:999px;background:var(--brass-soft);color:var(--brass);
         font-family:var(--type);font-size:13px;font-weight:700;line-height:1}
  .price.owned{background:var(--green-soft);color:var(--green-mid);
               font-family:var(--sans);font-size:11px;font-weight:800;
               letter-spacing:.1em;text-transform:uppercase;padding:6px 12px}
  .sub.poor .price{background:#FBE9E8;color:#B5403B;animation:nope .4s var(--e)}
  @keyframes nope{0%,100%{transform:translateX(0)}
                  20%{transform:translateX(-6px)}45%{transform:translateX(5px)}
                  70%{transform:translateX(-3px)}}
  .sub.locked{opacity:.96}

  /* the balance, in the strip */
  .pill.stars b{color:var(--brass)}

  /* the tile glyphs, for the ones that are letters rather than icons */
  .glyph{font-family:var(--sans);font-size:22px;font-weight:800;letter-spacing:-.02em}
  .glyph.km{font-family:var(--khmer);font-size:26px;font-weight:400}

  @media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
`;

/* the Rumdoul flower (Cambodia’s national flower), embedded so there is no asset to ship */
const STAR = "data:image/jpeg;base64,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";

/* ================================================================
   the courses — swap this for your own catalogue
   ================================================================ */
const DEFAULT_SUBJECTS = [
  { k:"math",    n:"Math",      c1:"#6FA8E8", c2:"#3466A8", learners:"12.4k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6.6h6v1.8H4Zm0 3.2h6v1.8H4ZM6.1 15h1.8v2H10v1.8H7.9v2H6.1v-2H4V17h2.1ZM14 6.6h6v1.8h-6Zm.6 8.2 1.3-1.3 1.6 1.6 1.6-1.6 1.3 1.3-1.6 1.6 1.6 1.6-1.3 1.3-1.6-1.6-1.6 1.6-1.3-1.3 1.6-1.6Z"/></svg>), on:true },
  { k:"english", n:"English",   c1:"#E88A86", c2:"#B23A38", learners:"18.9k",
    g:(<span className="glyph">Aa</span>), on:true },
  { k:"khmer",   n:"Khmer",     c1:"#F0C255", c2:"#C9922A", learners:"21.2k",
    g:(<span className="glyph km">ក</span>) },
  { k:"biology", n:"Biology",   c1:"#7FCB93", c2:"#2F7A46", learners:"8.1k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 3c0 6 10 6 10 12M17 3c0 6-10 6-10 12M7 21c0-2 10-2 10 0"/><path d="M8.5 7h7M8 11h8M8.5 15h7"/></svg>) },
  { k:"chem",    n:"Chemistry", c1:"#7FD0C8", c2:"#2E8079", learners:"6.7k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M10 3v6.5L4.8 18a2 2 0 0 0 1.7 3h11a2 2 0 0 0 1.7-3L14 9.5V3"/><path d="M9 3h6M7.5 14h9"/></svg>) },
  { k:"physics", n:"Physics",   c1:"#9B8FE0", c2:"#5A4BA8", learners:"5.9k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10" ry="4.4"/><ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4.4" transform="rotate(120 12 12)"/></svg>) },
  { k:"history", n:"History",   c1:"#C9A87A", c2:"#8A6634", learners:"7.3k",
    g:(<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M2.5 8 12 3.5 21.5 8"/><path d="M5 9v8M9.6 9v8M14.4 9v8M19 9v8"/><path d="M3 20.5h18"/></svg>) },
  { k:"hsk",     n:"HSK",       c1:"#EE8B86", c2:"#B2322F", learners:"4.4k",
    g:(<span className="glyph">汉</span>) },
  { k:"ielts",   n:"IELTS",     c1:"#88C4E8", c2:"#2E6E9E", learners:"9.6k",
    g:(<span className="glyph" style={{ fontSize: 17 }}>IELTS</span>) },
  { k:"toefl",   n:"TOEFL",     c1:"#F0A96B", c2:"#C0672A", learners:"3.8k",
    g:(<span className="glyph" style={{ fontSize: 17 }}>TOEFL</span>) }
];

const tileStyle = s => ({ background: `linear-gradient(${s.c1},${s.c2})` });

const TICK = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5 10 17.5 19 7" />
  </svg>
);

/** The star, at whatever size you ask for. Pixel art, so never smoothed. */
export function Star({ size = 22 }) {
  return <img className="star" src={STAR} alt="" style={{ width: size }} />;
}

/** The balance pill for the strip: <StarsPill stars={900} /> */
export function StarsPill({ stars = 0 }) {
  return (
    <span className="pill stars">
      <Star size={26} />
      <span><b>{stars.toLocaleString()}</b><i>Stars</i></span>
    </span>
  );
}

/**
 * CoursePicker — the "my courses" button, its dropdown, and the catalogue.
 *
 *   <CoursePicker
 *     subjects={SUBJECTS}        // optional, defaults to the built-in ten
 *     current="math"
 *     stars={900}
 *     price={300}                // what an unowned course costs
 *     onSelect={key => …}        // switched to a course they already own
 *     onBuy={(key, price) => …}  // bought one — deduct the stars your side
 *   />
 *
 * A subject is { k, n, c1, c2, learners, g, on } where `g` is the tile glyph
 * (an <svg> element or a <span className="glyph">) and `on` means already owned.
 */
export default function CoursePicker({
  subjects, current, stars = 0, price = 300, onSelect, onBuy
}) {
  const list = React.useMemo(
    () => (subjects && subjects.length ? subjects : DEFAULT_SUBJECTS), [subjects]);

  const [open, setOpen]   = React.useState(false);   /* the dropdown */
  const [cat, setCat]     = React.useState(false);   /* the catalogue */
  const [poor, setPoor]   = React.useState(null);    /* the key that just failed */
  const wrap = React.useRef(null);

  const cur = list.find(s => s.k === current) || list[0];

  /* close the dropdown on an outside click, and everything on Escape */
  React.useEffect(() => {
    const away = e => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const esc  = e => {
      if (e.key !== "Escape") return;
      if (cat) setCat(false); else setOpen(false);
    };
    document.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away);
                   window.removeEventListener("keydown", esc); };
  }, [cat]);

  /* the page behind must not scroll while the catalogue is up */
  React.useEffect(() => {
    if (!cat) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [cat]);

  const pick = s => {
    if (s.on) { onSelect && onSelect(s.k); setCat(false); setOpen(false); return; }
    if (stars < (s.price ?? price)) {
      /* say no on the card itself rather than in an alert */
      setPoor(null);
      requestAnimationFrame(() => setPoor(s.k));
      return;
    }
    onBuy && onBuy(s.k, s.price ?? price);
    setCat(false);
    setOpen(false);
  };

  return (
    <>
      <style>{CSS}</style>

      <div className="drop-wrap" ref={wrap}>
        <button className={"course-btn" + (open ? " open" : "")}
                aria-haspopup="true" aria-expanded={open}
                onClick={() => setOpen(v => !v)}>
          <span className="tile" style={tileStyle(cur)}>{cur.g}</span>
          <span className="nm">{cur.n}</span>
          <span className="caret">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 9l7 7 7-7" /></svg>
          </span>
        </button>

        {open && (
          <div className="drop" role="menu">
            <span className="tip" />
            <p className="lab">My courses</p>
            {list.filter(s => s.on).map(s => (
              <button key={s.k} className={"drop-row" + (s.k === cur.k ? " on" : "")}
                      role="menuitem"
                      onClick={() => { onSelect && onSelect(s.k); setOpen(false); }}>
                <span className="tile" style={tileStyle(s)}>{s.g}</span>
                <b>{s.n}</b>
                {s.k === cur.k && <span className="tick">{TICK}</span>}
              </button>
            ))}
            <button className="drop-row add" role="menuitem"
                    onClick={() => { setOpen(false); setCat(true); }}>
              <span className="tile">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     strokeWidth="2.6" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
              </span>
              <b>Add a new course</b>
            </button>
          </div>
        )}
      </div>

      {cat && createPortal(
        <>
          <div className="veil" onClick={() => setCat(false)} />
          <div className="cat" role="dialog" aria-modal="true" aria-label="Add a new course">
            <div className="cat-box">
              <div className="cat-head">
                <h2>Choose a course</h2>
                <button className="cat-x" aria-label="Close" onClick={() => setCat(false)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                       strokeWidth="2.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
              <div className="cat-grid">
                {list.map((s, i) => (
                  <button key={s.k}
                          className={"sub" + (s.on ? " on" : " locked") + (poor === s.k ? " poor" : "")}
                          style={{ animationDelay: 0.03 * i + "s" }}
                          onClick={() => pick(s)}>
                    {s.on && <span className="tick">{TICK}</span>}
                    <span className="tile" style={tileStyle(s)}>{s.g}</span>
                    <b>{s.n}</b>
                    <span className="learners">{s.learners} learners</span>
                    {s.on
                      ? <span className="price owned">Added</span>
                      : <span className="price"><Star size={22} />{s.price ?? price}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
