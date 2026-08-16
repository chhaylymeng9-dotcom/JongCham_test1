/* PomoStatusBox.jsx — the running Pomo session, shown in the right rail
 *
 *   import PomoStatusBox from "./PomoStatusBox";
 *
 *   const [session, setSession] = useState(null);
 *   …
 *   <PomoStatusBox session={session} onFinish={() => setSession(null)} />
 *
 * session = { minutes, breaks, restMins } — or null when nothing is running.
 * Click the box to pause: the clock stops and the bus parks. Click again to go on.
 * When the last leg finishes it calls onFinish, so the page can take the box away.
 *
 * The colour tokens (--paper, --sheet, --green, --hair, …) come from the app's
 * :root; if they are not defined the box falls back to sensible literals.
 */
import React from "react";

const PB_CSS = `/* ==================================================================
   POMO STATUS BOX — copy from here
   ================================================================== */
  .pomo-box{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:stretch;
            min-height:138px;
            background:var(--sheet,#FFFFFF);border:1px solid var(--hair,#E1DBCC);border-radius:20px;
            box-shadow:0 4px 0 var(--hair,#E1DBCC);overflow:hidden;
            cursor:pointer;user-select:none;-webkit-user-select:none;
            transition:border-color .12s ease,box-shadow .12s ease,transform .12s ease}
  .pomo-box:hover{border-color:var(--green-line,#B9CBB9)}
  .pomo-box:active{transform:translateY(2px);box-shadow:0 2px 0 var(--hair,#E1DBCC)}
  .pomo-box:focus-visible{outline:3px solid var(--green-soft,#E5EBE4);outline-offset:2px}
  .pomo-box.idle{cursor:default}
  .pomo-box.idle:hover{border-color:var(--hair,#E1DBCC)}
  .pomo-box.idle:active{transform:none;box-shadow:0 4px 0 var(--hair,#E1DBCC)}
  /* the little line that says the box can be clicked */
  .pb-hint{display:block;margin-top:7px;font-size:10.5px;color:var(--faint,#AEA89A);
           letter-spacing:.02em}
  .pomo-box.paused .pb-hint{color:var(--brass,#9A7B3C)}
  .pomo-box.idle .pb-hint{visibility:hidden}
  /* a paused bus sits in a stilled scene */
  .pomo-box.paused .pb-scene{filter:saturate(.55) brightness(.99)}
  .pomo-box.paused .pb-scene::after{content:"";position:absolute;inset:0;
    background:rgba(247,244,237,.34);pointer-events:none}

  /* left — the time they set */
  .pb-time{padding:16px 8px 16px 18px;min-width:0;display:flex;flex-direction:column;justify-content:center}
  .pb-k{font-family:var(--type,"Courier Prime","Courier New",monospace);font-size:9.5px;font-weight:700;letter-spacing:.18em;
        text-transform:uppercase;color:var(--faint,#AEA89A)}
  .pb-clock{font-family:var(--type,"Courier Prime","Courier New",monospace);font-size:32px;font-weight:700;letter-spacing:-.04em;
            line-height:1.05;color:var(--green,#243529);margin-top:3px;font-variant-numeric:tabular-nums}
  .pb-tag{align-self:flex-start;margin-top:10px;padding:4px 11px;border-radius:999px;
          background:var(--brass-soft,#F3EBD8);color:var(--brass,#8E6F2A);font-family:var(--type,"Courier Prime","Courier New",monospace);
          font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase}
  .pomo-box.rest .pb-tag{background:var(--green-soft,#E5EBE4);color:var(--green-mid,#3E5F48)}
  .pomo-box.idle .pb-tag{background:var(--track,#E8E2D5);color:var(--faint,#AEA89A)}
  .pb-bar{height:7px;border-radius:999px;background:var(--track,#E8E2D5);overflow:hidden;margin-top:9px;
          margin-right:10px}
  .pb-bar i{display:block;height:100%;width:0%;border-radius:999px;
            background:linear-gradient(90deg,#3E8F52,#5FA96D);transition:width .9s linear}
  /* resting state, before a session is set */
  .pomo-box.idle .pb-clock{color:var(--faint,#AEA89A)}

  /* right — the road */
  .pb-scene{position:relative;overflow:hidden;background:#CFE3EA;border-left:1px solid var(--hair,#E1DBCC)}
  .pb-scene svg{position:absolute;inset:0;width:100%;height:100%;display:block}

  .pb-band{animation:pbRoll linear infinite}
  @keyframes pbRoll{from{transform:translateX(0)}to{transform:translateX(-400px)}}
  .pb-hills{animation-duration:26s}
  .pb-far  {animation-duration:13s}
  .pb-dash {animation-duration:.95s}
  .pb-wheel{animation:pbSpin .5s linear infinite;transform-box:fill-box;transform-origin:center}
  @keyframes pbSpin{to{transform:rotate(360deg)}}
  .pb-bus{animation:pbBob 1.1s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
  @keyframes pbBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.2px)}}

  /* stop everything when the session is paused or not running */
  .pomo-box.paused .pb-band,
  .pomo-box.paused .pb-wheel,
  .pomo-box.paused .pb-bus,
  .pomo-box.rest .pb-band,
  .pomo-box.rest .pb-wheel,
  .pomo-box.rest .pb-bus{animation-play-state:paused}

  @media (prefers-reduced-motion:reduce){
    .pb-band,.pb-wheel,.pb-bus{animation:none}
  }
`;

const PB_SCENE = `<svg viewBox="0 0 400 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="pbSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#BFDCE8"/><stop offset="1" stop-color="#E4EFE4"/>
          </linearGradient>
          <g id="pbTree">
            <rect x="-2" y="-1" width="4" height="7" rx="2" fill="#7E6540"/>
            <circle cx="-6" cy="-3.6" r="7" fill="#4E8C48"/>
            <circle cx="6" cy="-4.4" r="7.4" fill="#4E8C48"/>
            <circle cx="0" cy="-10" r="9.2" fill="#5EA357"/>
            <circle cx="-2" cy="-16" r="5.6" fill="#72B868"/>
          </g>
          <g id="pbBush">
            <ellipse cx="-5" cy="0" rx="6.4" ry="4.2" fill="#5EA357"/>
            <ellipse cx="5" cy=".6" rx="5.8" ry="3.8" fill="#5EA357"/>
            <ellipse cx="0" cy="-2.8" rx="6.8" ry="4.8" fill="#72B868"/>
          </g>
        </defs>

        <rect width="400" height="100" fill="url(#pbSky)"/>
        <circle cx="352" cy="18" r="10" fill="#F7D96B"/>

        <g class="pb-band pb-hills">
          <g><path d="M0 44 Q50 26 100 42 Q150 24 200 42 Q260 26 320 42 Q360 32 400 44 L400 62 L0 62Z" fill="#8FB08C"/></g>
          <g transform="translate(400 0)">
            <path d="M0 44 Q50 26 100 42 Q150 24 200 42 Q260 26 320 42 Q360 32 400 44 L400 62 L0 62Z" fill="#8FB08C"/></g>
        </g>

        <rect y="50" width="400" height="22" fill="#7FA97E"/>

        <g class="pb-band pb-far">
          <g><use href="#pbTree" x="40" y="72"/><use href="#pbTree" x="120" y="72"/>
             <use href="#pbTree" x="255" y="72"/><use href="#pbTree" x="335" y="72"/>
             <use href="#pbBush" x="180" y="71"/><use href="#pbBush" x="300" y="71"/></g>
          <g transform="translate(400 0)">
             <use href="#pbTree" x="40" y="72"/><use href="#pbTree" x="120" y="72"/>
             <use href="#pbTree" x="255" y="72"/><use href="#pbTree" x="335" y="72"/>
             <use href="#pbBush" x="180" y="71"/><use href="#pbBush" x="300" y="71"/></g>
        </g>

        <rect y="72" width="400" height="18" fill="#6E6A63"/>
        <rect y="72" width="400" height="1.6" fill="#8A867E"/>
        <g class="pb-band pb-dash">
          <g><rect x="12" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/>
             <rect x="92" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/>
             <rect x="172" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/>
             <rect x="252" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/>
             <rect x="332" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/></g>
          <g transform="translate(400 0)">
             <rect x="12" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/>
             <rect x="92" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/>
             <rect x="172" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/>
             <rect x="252" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/>
             <rect x="332" y="80" width="20" height="2.4" rx="1.2" fill="#F1EDE2"/></g>
        </g>
        <rect y="90" width="400" height="10" fill="#5EA357"/>

        <!-- the bus: positioned on a parent, animated on the child -->
        <g transform="translate(162 42) scale(.55)"><g class="pb-bus">
          <ellipse cx="70" cy="82" rx="70" ry="5" fill="rgba(28,26,21,.18)"/>
          <g stroke="#111111" stroke-width="3.4" stroke-linejoin="round">
            <rect x="12" y="4" width="34" height="9" rx="4" fill="#DCEAF4"/>
            <rect x="78" y="4" width="34" height="9" rx="4" fill="#DCEAF4"/>
            <path d="M4 13 h116 q9 0 10 9 l6 44 q1 9 -9 9 H6 q-5 0 -5 -5 V19 q0 -6 3 -6Z" fill="#4E8AD8"/>
            <rect x="10" y="21" width="76" height="26" rx="4" fill="#79D7F0"/>
            <path d="M25 21 v26 M40 21 v26 M55 21 v26 M70 21 v26" stroke-width="2.6"/>
            <path d="M95 21 h24 q6 0 7 6 l3 12 q1 8 -8 8 h-16 q-10 0 -10 -10Z" fill="#79D7F0"/>
            <rect x="0" y="52" width="9" height="9" rx="2.5" fill="#F7C64B"/>
            <rect x="127" y="52" width="9" height="9" rx="2.5" fill="#F7C64B"/>
            <path d="M2 66 h132" stroke-width="3"/>
          </g>
          <g><circle cx="34" cy="70" r="14" fill="#3A3A3A" stroke="#111" stroke-width="3.4"/>
             <circle class="pb-wheel" cx="34" cy="70" r="7.4" fill="#B9B9B9" stroke="#111" stroke-width="2.6"/>
             <circle cx="34" cy="70" r="2.4" fill="#EDEDED"/></g>
          <g><circle cx="106" cy="70" r="14" fill="#3A3A3A" stroke="#111" stroke-width="3.4"/>
             <circle class="pb-wheel" cx="106" cy="70" r="7.4" fill="#B9B9B9" stroke="#111" stroke-width="2.6"/>
             <circle cx="106" cy="70" r="2.4" fill="#EDEDED"/></g>
        </g></g>
      </svg>`;

/* ================================================================
   the box
   ================================================================ */
const mmss = s =>
  String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");

/* the focus time is split into legs, with a rest stop between each */
function buildPlan(minutes, breaks, restMins) {
  const legs = breaks + 1;
  const each = Math.round((minutes * 60) / legs);
  const out = [];
  for (let i = 0; i < legs; i++) {
    out.push({ ride: true, secs: each, leg: i + 1, of: legs });
    if (i < legs - 1) out.push({ ride: false, secs: Math.round(restMins * 60) });
  }
  return out;
}

/**
 * PomoStatusBox
 *
 *   <PomoStatusBox
 *     session={{ minutes: 90, breaks: 3, restMins: 15 }}   // null = nothing running
 *     onFinish={() => setSession(null)}                    // fired when the trip ends
 *   />
 *
 * Clicking the box pauses: the clock stops and the bus parks at the roadside.
 * Clicking again sets off from exactly where it stopped.
 */
export default function PomoStatusBox({ session, onFinish, onPauseChange }) {
  const minutes  = session ? session.minutes : 0;
  const breaks   = session && session.breaks != null ? session.breaks : 1;
  const restMins = session && session.restMins != null ? session.restMins : 15;

  const plan  = React.useMemo(
    () => (session ? buildPlan(minutes, breaks, restMins) : []),
    [session, minutes, breaks, restMins]
  );
  const total = React.useMemo(() => plan.reduce((a, p) => a + p.secs, 0), [plan]);

  const [paused, setPaused]   = React.useState(false);
  const [done, setDone]       = React.useState(false);
  const ref = React.useRef({ idx: 0, left: 0, spent: 0, breaksDone: 0 });
  const [, bump] = React.useReducer(x => x + 1, 0);

  /* a new session rewinds everything */
  React.useEffect(() => {
    ref.current = { idx: 0, left: plan.length ? plan[0].secs : 0, spent: 0, breaksDone: 0 };
    setPaused(false);
    setDone(false);
    bump();
  }, [plan]);

  React.useEffect(() => {
    if (!session || paused || done) return;
    const id = setInterval(() => {
      const r = ref.current;
      if (r.left > 0) { r.left--; r.spent++; }
      if (r.left === 0) {
        if (r.idx < plan.length - 1) {
          r.idx++;
          r.left = plan[r.idx].secs;
          if (!plan[r.idx].ride) r.breaksDone++;
        } else {
          setDone(true);
        }
      }
      bump();
    }, 1000);
    return () => clearInterval(id);
  }, [session, paused, done, plan]);

  /* the trip is over — let the page take the box away */
  React.useEffect(() => {
    if (done && onFinish) onFinish();
  }, [done, onFinish]);

  React.useEffect(() => {
    if (onPauseChange) onPauseChange(paused);
  }, [paused, onPauseChange]);

  if (!session) return null;

  const seg  = plan[ref.current.idx];
  const rest = !!seg && !seg.ride;
  const cls  = "pomo-box" + (paused ? " paused" : "") + (rest ? " rest" : "") + (done ? " idle" : "");

  const toggle = () => { if (!done) setPaused(v => !v); };

  return (
    <>
      <style>{PB_CSS}</style>
      <div className={cls} role="button" tabIndex={0}
           aria-label="Pause or resume the session" aria-pressed={paused}
           onClick={toggle}
           onKeyDown={e => {
             if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
           }}>
        <div className="pb-time">
          <span className="pb-k">Pomo mode</span>
          <b className="pb-clock">{done ? "--:--" : mmss(ref.current.left)}</b>
          <span className="pb-tag">
            {done ? "Arrived" : paused ? "Paused" : `Break ${ref.current.breaksDone} / ${breaks}`}
          </span>
          <span className="pb-hint">
            {done ? "Journey finished" : paused ? "Click to carry on" : "Click to pause"}
          </span>
          <span className="pb-bar">
            <i style={{ width: total ? (ref.current.spent / total) * 100 + "%" : "0%" }} />
          </span>
        </div>
        <div className="pb-scene" dangerouslySetInnerHTML={{ __html: PB_SCENE }} />
      </div>
    </>
  );
} 