import React from "react";

/* ─────────────────────────────────────────────────────────────
   Leaderboard — where you stand, the ladder, the podium, the table.

   <Leaderboard
     people={[{ id, name, xp, move, streak, me }]}   // sorted or not
     leagueIndex={2}                                 // which league this board is
     week={23}
     promote={5} relegate={5}
     view="week" onViewChange={v => …}               // week | last | friends
     numerals="km"
   />

   Hardened: this component paints its own opaque paper background,
   resets inherited tag styles under .lb-root, and every class is
   prefixed `lb-`. It does not rely on — and must not be placed inside —
   any container that draws a background of its own (e.g. the Learn
   map's illustrated scene). Mount it as its own view.
   ───────────────────────────────────────────────────────────── */

const CSS = `
.lb-root{
  --lb-paper:#F7F5EF; --lb-card:#FFFFFF; --lb-ink:#23271F; --lb-muted:#8B8877;
  --lb-faint:#B4B0A2; --lb-line:#E7E3D7; --lb-hair:#F1EEE4;
  --lb-green:#2F3A2E; --lb-green2:#3D4C3A; --lb-green-soft:#EAF0E6;
  --lb-gold:#F2C33C; --lb-gold-soft:#FBEFCC;
  --lb-red:#C2503C; --lb-red-soft:#FBEDE9;
  --lb-s1:0 1px 0 rgba(35,39,31,.04), 0 6px 18px rgba(35,39,31,.05);
  --lb-s2:0 18px 44px rgba(35,39,31,.16);
  --lb-font:"Khmer OS Siemreap","Siemreap","Noto Sans Khmer",system-ui,sans-serif;
  position:relative;
  isolation:isolate;
  display:block;
  width:100%;
  min-height:100%;
  height:auto;
  background:var(--lb-paper);
  color:var(--lb-ink);line-height:1.6;font-variant-numeric:tabular-nums;
  font-family:var(--lb-font);
  padding:32px 22px 120px;
  max-width:960px;margin:0 auto;
}
.lb-root, .lb-root *{transform:none}
.lb-root *{box-sizing:border-box;margin:0;padding:0;border:0;background:none;
  font:inherit;color:inherit;line-height:inherit;text-align:left;
  list-style:none;vertical-align:baseline}
.lb-root button{cursor:pointer}
.lb-root h1{font-size:25px;font-weight:700;letter-spacing:0}
.lb-root svg{display:block}

.lb-top{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;
  margin-bottom:0}
.lb-kick{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--lb-faint);margin:0 0 4px}
.lb-seg{display:inline-flex;background:#fff;border:1px solid var(--lb-line);border-radius:99px;
  padding:4px;box-shadow:var(--lb-s1)}
.lb-seg button{font:inherit;font-size:13px;color:var(--lb-muted);background:none;border:0;
  border-radius:99px;padding:8px 16px;cursor:pointer;transition:all .16s ease;white-space:nowrap}
.lb-seg button:hover{color:var(--lb-ink)}
.lb-seg button.on{background:var(--lb-green);color:#fff}

/* where you stand */
.lb-stand{margin:18px 0 16px;border-radius:24px;padding:24px 26px;color:#fff;position:relative;
  overflow:hidden;box-shadow:var(--lb-s2);isolation:isolate;
  background:linear-gradient(135deg,var(--lb-green) 0%,var(--lb-green2) 62%,#46573F 100%)}
.lb-stand::before,.lb-stand::after{content:"";position:absolute;border-radius:50%;pointer-events:none;
  z-index:0;max-width:60%;max-height:60%}
.lb-stand::before{width:340px;height:340px;right:-90px;top:-160px;background:rgba(255,255,255,.05)}
.lb-stand::after{width:220px;height:220px;right:110px;bottom:-150px;background:rgba(242,195,60,.10)}
.lb-in{position:relative;z-index:1;display:grid;grid-template-columns:auto minmax(0,1fr) auto;
  gap:24px;align-items:center;width:100%}
.lb-rankbox{text-align:center;padding-right:24px;border-right:1px solid rgba(255,255,255,.14)}
.lb-rankbox .lab{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;
  color:rgba(255,255,255,.5);display:block}
.lb-rankbox .big{font-size:46px;line-height:1.15;display:block}
.lb-rankbox .of{font-size:12px;color:rgba(255,255,255,.55)}
.lb-me{min-width:0}
.lb-me .nm{font-size:17px;display:block;line-height:1.45;overflow:hidden;text-overflow:ellipsis;
  white-space:nowrap;max-width:100%}
.lb-me .sub{font-size:13px;color:rgba(255,255,255,.66);display:block;margin-top:2px}
.lb-gap{margin-top:14px}
.lb-gap .bar{height:7px;border-radius:99px;background:rgba(255,255,255,.16);overflow:hidden;display:block}
.lb-gap .bar i{display:block;height:100%;border-radius:99px;
  background:linear-gradient(90deg,var(--lb-gold),#F7D46E);transition:width .9s cubic-bezier(.22,1,.36,1)}
.lb-gap .cap{display:flex;justify-content:space-between;gap:10px;font-size:12px;
  color:rgba(255,255,255,.66);margin-top:7px}
.lb-gap b{color:var(--lb-gold);font-weight:700}
.lb-clock{display:grid;place-items:center;gap:6px;text-align:center;min-width:104px}
.lb-clock .ring{position:relative;width:84px;height:84px}
.lb-clock svg{transform:rotate(-90deg)}
.lb-clock .mid{position:absolute;inset:0;display:grid;place-items:center;line-height:1.2}
.lb-clock .mid b{font-size:19px;display:block;font-weight:700}
.lb-clock .mid span{font-size:10.5px;color:rgba(255,255,255,.6)}
.lb-clock .lab{font-size:11px;color:rgba(255,255,255,.6)}

/* the ladder */
.lb-ladder{background:var(--lb-card);border:1px solid var(--lb-line);border-radius:20px;
  padding:18px 22px 20px;box-shadow:var(--lb-s1);margin-bottom:16px}
.lb-lhead{display:flex;align-items:baseline;justify-content:space-between;gap:14px;
  flex-wrap:wrap;margin-bottom:26px}
.lb-lhead .t{font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:var(--lb-faint)}
.lb-lhead .need{font-size:12.5px;color:var(--lb-muted)}
.lb-lhead .need b{color:var(--lb-ink);font-weight:700}
.lb-rail{position:relative;height:96px}
.lb-track{position:absolute;left:10%;right:10%;top:25px;height:4px;border-radius:99px;
  background:repeating-linear-gradient(90deg,#E4E0D2 0 5px,transparent 5px 11px)}
.lb-track i{position:absolute;left:0;top:0;height:100%;border-radius:99px;display:block;
  background:linear-gradient(90deg,#B08258 0%,#9AA3A8 46%,#E0A81E 100%);
  transition:width .9s cubic-bezier(.22,1,.36,1)}
.lb-you{position:absolute;top:12px;transform:translateX(-50%);z-index:2;width:30px;height:30px;
  border-radius:50%;background:var(--lb-green);color:#fff;font-size:12px;display:grid;
  place-items:center;border:3px solid var(--lb-card);box-shadow:0 4px 12px rgba(35,39,31,.2);
  transition:left .9s cubic-bezier(.22,1,.36,1)}
.lb-you::after{content:"";position:absolute;bottom:-9px;left:50%;transform:translateX(-50%);
  width:0;height:0;border:5px solid transparent;border-top-color:var(--lb-green)}
.lb-nodes{display:grid;grid-template-columns:repeat(5,1fr);position:relative;z-index:1}
.lb-lg{display:grid;place-items:center;gap:9px;text-align:center}
.lb-lg .well{width:54px;height:54px;border-radius:50%;background:var(--lb-paper);display:grid;
  place-items:center;border:2px solid transparent;transition:all .2s ease;position:relative}
.lb-lg.done .well{background:#fff;border-color:var(--lb-line)}
.lb-lg.on .well{background:#fff;border-color:var(--lb-gold);
  box-shadow:0 0 0 5px var(--lb-gold-soft), var(--lb-s1)}
.lb-lg .nm{font-size:12.5px;color:var(--lb-faint);line-height:1.35}
.lb-lg.done .nm{color:var(--lb-muted)}
.lb-lg.on .nm{color:var(--lb-ink)}
.lb-lg .th{font-size:10.5px;color:var(--lb-faint);opacity:.85}
.lb-lg .tick{position:absolute;right:-2px;bottom:-2px;width:17px;height:17px;border-radius:50%;
  background:var(--lb-green);color:#fff;display:grid;place-items:center}
.lb-lg.locked .well{opacity:.55}

/* podium */
.lb-podium{display:grid;grid-template-columns:1fr 1.18fr 1fr;gap:14px;align-items:end;margin-bottom:16px}
.lb-pod{background:var(--lb-card);border:1px solid var(--lb-line);border-radius:22px;
  padding:18px 14px 16px;text-align:center;box-shadow:var(--lb-s1);position:relative;overflow:hidden;
  display:flex;flex-direction:column;align-items:center}
.lb-pod::after{content:"";position:absolute;left:0;right:0;top:0;height:4px}
.lb-pod.g::after{background:linear-gradient(90deg,#E9C34A,#F7DE93,#C8931B)}
.lb-pod.s::after{background:linear-gradient(90deg,#B9C0C4,#E4E8EA,#98A1A6)}
.lb-pod.b::after{background:linear-gradient(90deg,#C99568,#EBC9A6,#A8703F)}
.lb-pod.g{padding-top:26px;transform:translateY(-8px)}
.lb-pod .av{width:56px;height:56px;border-radius:50%;margin:0 auto 10px;display:grid;
  place-items:center;font-size:19px;color:#fff;position:relative;flex:none}
.lb-pod.g .av{width:68px;height:68px;font-size:23px}
.lb-pod .medal{position:absolute;right:-6px;bottom:-4px;width:26px;height:26px;border-radius:50%;
  display:grid;place-items:center;font-size:11px;color:#3A2E08;border:2px solid #fff}
.lb-pod.g .medal{background:linear-gradient(140deg,#F7D46E,#D9A417)}
.lb-pod.s .medal{background:linear-gradient(140deg,#DDE2E4,#A8B0B4)}
.lb-pod.b .medal{background:linear-gradient(140deg,#E5BE9B,#B2794A)}
.lb-pod b{display:block;font-size:14.5px;font-weight:700;line-height:1.45;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap;width:100%}
.lb-pod .xp{display:block;font-size:13px;color:var(--lb-muted);margin-top:3px}
.lb-pod .xp em{font-style:normal;color:var(--lb-ink);font-weight:700}
.lb-pod .d{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;margin-top:8px;
  padding:3px 9px;border-radius:99px;background:var(--lb-hair);color:var(--lb-muted)}
.lb-pod .d.up{background:var(--lb-green-soft);color:var(--lb-green)}
.lb-pod .d.dn{background:var(--lb-red-soft);color:var(--lb-red)}

/* the table */
.lb-table{background:var(--lb-card);border:1px solid var(--lb-line);border-radius:22px;
  box-shadow:var(--lb-s1);overflow:hidden}
.lb-thead,.lb-row{display:grid;grid-template-columns:66px 44px minmax(0,1fr) 92px 128px;gap:12px;
  width:100%}
.lb-thead{padding:12px 20px;background:#FCFBF7;border-bottom:1px solid var(--lb-line);
  font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--lb-faint)}
.lb-thead .r{text-align:right}
.lb-row{padding:13px 20px;align-items:center;border-bottom:1px solid var(--lb-hair);
  transition:background .14s ease}
.lb-row:last-child{border-bottom:0}
.lb-row:hover{background:#FCFBF7}
.lb-rank{display:flex;align-items:center;gap:7px;color:var(--lb-muted);font-size:14px}
.lb-rank .mv{font-size:10px}
.lb-row .av{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;
  font-size:16px;color:#fff;flex:none}
.lb-who{min-width:0}
.lb-who b{display:block;font-size:14.5px;font-weight:700;line-height:1.45;overflow:hidden;
  text-overflow:ellipsis;white-space:nowrap}
.lb-who span{display:block;font-size:11.5px;color:var(--lb-faint);margin-top:1px}
.lb-d{font-size:12px;color:var(--lb-muted);text-align:right}
.lb-d.up{color:var(--lb-green)}
.lb-d.dn{color:var(--lb-red)}
.lb-xp{text-align:right}
.lb-xp b{font-size:15px;font-weight:700}
.lb-xp span{font-size:11.5px;color:var(--lb-faint);margin-left:4px}
.lb-xp .meter{height:4px;border-radius:99px;background:var(--lb-hair);margin-top:6px;overflow:hidden;display:block}
.lb-xp .meter i{display:block;height:100%;background:#D8D4C6;border-radius:99px}
.lb-row.me{background:linear-gradient(90deg,var(--lb-green-soft),#F4F8F1)}
.lb-row.me:hover{background:var(--lb-green-soft)}
.lb-row.me .lb-xp .meter i{background:var(--lb-green)}
.lb-tagme{font-size:10px;letter-spacing:.08em;color:var(--lb-green);background:#fff;
  border:1px solid #CFDCC9;border-radius:5px;padding:1px 6px;margin-left:8px;vertical-align:2px;
  display:inline-block}
.lb-zone{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;
  padding:9px 20px;font-size:11.5px;background:#FBFAF6;border-bottom:1px solid var(--lb-hair)}
.lb-zone i{height:1px;background:currentColor;opacity:.22;display:block}
.lb-zone.up{color:var(--lb-green)}
.lb-zone.dn{color:var(--lb-red);background:var(--lb-red-soft)}

/* the bar that follows you */
.lb-sticky{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;padding:12px 22px;
  background:rgba(247,245,239,.93);backdrop-filter:blur(10px);border-top:1px solid var(--lb-line);
  transform:translateY(105%);transition:transform .28s cubic-bezier(.22,1,.36,1);pointer-events:none}
.lb-sticky.on{transform:none;pointer-events:auto}
.lb-sticky .in{max-width:960px;margin:0 auto;display:grid;
  grid-template-columns:auto auto minmax(0,1fr) auto;gap:14px;align-items:center}
.lb-sticky .rk{font-size:15px;color:var(--lb-muted)}
.lb-sticky .av{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;
  background:var(--lb-green);color:#fff;font-size:15px;flex:none}
.lb-sticky b{font-weight:700}
.lb-sticky .need{font-size:12.5px;color:var(--lb-muted)}
.lb-sticky .need em{font-style:normal;color:var(--lb-ink);font-weight:700}

.lb-foot{margin-top:16px;font-size:12.5px;color:var(--lb-muted);display:flex;gap:10px;
  align-items:center;background:#FCFBF7;border:1px dashed var(--lb-line);
  border-radius:16px;padding:13px 16px}

@media (max-width:820px){
  .lb-in{grid-template-columns:auto minmax(0,1fr);row-gap:18px}
  .lb-clock{grid-column:1 / -1;justify-self:start;display:flex;align-items:center;gap:14px}
  .lb-thead,.lb-row{grid-template-columns:46px 40px minmax(0,1fr) 104px}
  .lb-thead .dcol,.lb-d{display:none}
}
@media (max-width:560px){
  .lb-root{padding:22px 14px 110px}
  .lb-root h1{font-size:21px}
  .lb-stand{padding:20px 18px;border-radius:20px}
  .lb-rankbox{padding-right:16px}
  .lb-rankbox .big{font-size:38px}
  .lb-gap .cap{flex-direction:column;gap:3px}
  .lb-podium{grid-template-columns:1fr;align-items:stretch}
  .lb-pod.g{order:-1;transform:none}
  .lb-track,.lb-you{display:none}
  .lb-lg .th{display:none}
  .lb-thead{display:none}
  .lb-row{grid-template-columns:36px 40px minmax(0,1fr) 92px;gap:10px;padding:12px 13px}
  .lb-xp .meter{display:none}
}
`;

/* ── helpers ──────────────────────────────────────────────── */
const KD = "០១២៣៤៥៦៧៨៩";
const toKm = n => String(n).replace(/[0-9]/g, d => KD[+d]);

export const DEFAULT_LEAGUES = [
  { name:"សំរឹទ្ធ", color:"#B08258", at:0    },
  { name:"ប្រាក់",  color:"#9AA3A8", at:500  },
  { name:"មាស",    color:"#E0A81E", at:1200 },
  { name:"ផ្លាទីន", color:"#7FA8A0", at:2200 },
  { name:"ពេជ្រ",   color:"#6E9BC4", at:3500 },
];

const TINTS = [["#3E5139","#5E7455"],["#4A6B78","#6E93A0"],["#7A5A6E","#9E7B90"],
               ["#8A5A3B","#B07E58"],["#4F5B6B","#78869A"],["#5C6B3A","#84955C"]];
const tint = s => {
  let h = 0; for (const c of String(s)) h = (h * 31 + c.codePointAt(0)) >>> 0;
  const [a, b] = TINTS[h % TINTS.length];
  return { background: `linear-gradient(140deg,${a},${b})` };
};
const initial = n => String(n).trim().slice(0, 1);
const arrow = m => (m > 0 ? "▲" : m < 0 ? "▼" : "•");
const dcls  = m => (m > 0 ? "up" : m < 0 ? "dn" : "");

/* one emblem per league — five ranks should not be five identical badges */
const MARK = [
  c => <path d="M17 22l-4-4.5h8z" fill={c} />,
  c => <><path d="M17 18.5l-4-4.5h8z" fill={c} /><path d="M17 25l-4-4.5h8z" fill={c} /></>,
  c => <path d="M17 12l2 4.4 4.8.6-3.5 3.4.9 4.8L17 22.9l-4.2 2.3.9-4.8L10.2 17l4.8-.6z" fill={c} />,
  c => <><path d="M17 11l5.5 6-5.5 8-5.5-8z" fill={c} opacity=".55" />
         <path d="M17 11l5.5 6-5.5 8-5.5-8z" stroke={c} strokeWidth="1.6" fill="none" /></>,
  c => <><path d="M11 15h12l-6 10z" fill={c} opacity=".5" />
         <path d="M11 15h12l-6 10zM14 15l3 10M20 15l-3 10M11 15l6-4 6 4" stroke={c}
               strokeWidth="1.5" fill="none" strokeLinejoin="round" /></>,
];

function Emblem({ i, color, size }) {
  const id = "lbg" + i;
  return (
    <svg width={size} height={size * 1.12} viewBox="0 0 34 38" fill="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity=".30" />
          <stop offset="1" stopColor={color} stopOpacity=".08" />
        </linearGradient>
      </defs>
      <path d="M17 2.5l13.5 4.8v12.4c0 8.2-5.8 13.5-13.5 15.4C9.3 33.2 3.5 27.9 3.5 19.7V7.3z"
            fill={`url(#${id})`} />
      <path d="M17 2.5l13.5 4.8v12.4c0 8.2-5.8 13.5-13.5 15.4C9.3 33.2 3.5 27.9 3.5 19.7V7.3z"
            stroke={color} strokeWidth="2" />
      {MARK[i](color)}
    </svg>
  );
}

const TICK = <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5 10 17.5 19 7" /></svg>;

/* ── the component ────────────────────────────────────────── */
export default function Leaderboard({
  people = [], leagues = DEFAULT_LEAGUES, leagueIndex = 0, week,
  promote = 5, relegate = 5, view = "week", onViewChange, numerals = "km",
  views = [["week","សប្តាហ៍នេះ"],["last","សប្តាហ៍មុន"],["friends","មិត្តភក្តី"]],
}) {
  const num = numerals === "km" ? toKm : String;
  const xpf = n => num(Number(n).toLocaleString("en-US"));

  const list = React.useMemo(() => [...people].sort((a, b) => b.xp - a.xp), [people]);
  const meIdx = list.findIndex(p => p.me);
  const me    = meIdx > -1 ? list[meIdx] : null;
  const ahead = meIdx > 0 ? list[meIdx - 1] : null;
  const need  = ahead && me ? ahead.xp - me.xp : 0;
  const top   = list.length ? list[0].xp : 1;

  const rowRef = React.useRef(null);
  const [stuck, setStuck] = React.useState(false);
  const [left, setLeft]   = React.useState({ n: 0, unit: "ថ្ងៃ", frac: 0 });

  /* Google Font — loaded once, harmless if already present */
  React.useEffect(() => {
    const id = "lb-siemreap-font";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Siemreap&display=swap";
    document.head.appendChild(link);
  }, []);

  /* the sticky bar appears once your own row scrolls away */
  React.useEffect(() => {
    if (!rowRef.current) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting),
      { rootMargin: "-70px 0px -90px 0px" });
    io.observe(rowRef.current);
    return () => io.disconnect();
  }, [meIdx, list.length]);

  /* time to Sunday midnight */
  React.useEffect(() => {
    const tick = () => {
      const now = new Date(), end = new Date(now);
      end.setDate(now.getDate() + ((7 - now.getDay()) % 7));
      end.setHours(23, 59, 59, 999);
      const ms = end - now, d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5);
      setLeft({ n: d || h, unit: d ? "ថ្ងៃ" : "ម៉ោង", frac: 1 - ms / (7 * 864e5) });
    };
    tick();
    const t = setInterval(tick, 60000);
    return () => clearInterval(t);
  }, []);

  /* your pin on the ladder — between this league and the next */
  const nextL = leagues[leagueIndex + 1];
  const from  = leagues[leagueIndex]?.at ?? 0;
  const frac  = nextL && me ? Math.max(0, Math.min(1, (me.xp - from) / (nextL.at - from))) : 1;
  const pinAt = 10 + 20 * (leagueIndex + frac);

  const RING = 226;

  return (
    <div className="lb-root">
      <style>{CSS}</style>

      <div className="lb-top">
        <div>
          <p className="lb-kick">Leaderboard</p>
          <h1>តារាងពិន្ទុ</h1>
        </div>
        <div className="lb-seg">
          {views.map(([k, label]) => (
            <button key={k} type="button" className={view === k ? "on" : ""}
                    onClick={() => onViewChange && onViewChange(k)}>{label}</button>
          ))}
        </div>
      </div>

      {me && (
        <section className="lb-stand">
          <div className="lb-in">
            <div className="lb-rankbox">
              <span className="lab">ចំណាត់ថ្នាក់</span>
              <span className="big">{num(meIdx + 1)}</span>
              <span className="of">ក្នុងចំណោម {num(list.length)}</span>
            </div>

            <div className="lb-me">
              <span className="nm">{me.name}</span>
              <span className="sub">
                លីគ{leagues[leagueIndex]?.name}{week ? ` · សប្តាហ៍ទី ${num(week)}` : ""}
              </span>
              <div className="lb-gap">
                <div className="bar"><i style={{ width: (ahead ? me.xp / ahead.xp * 100 : 100) + "%" }} /></div>
                <div className="cap">
                  <span>{ahead
                    ? <>នៅខ្វះ <b>{xpf(need)} ពិន្ទុ</b> ដើម្បីឡើងទី {num(meIdx)}</>
                    : "អ្នកនាំមុខគេ"}</span>
                  <span>{xpf(me.xp)} ពិន្ទុ</span>
                </div>
              </div>
            </div>

            <div className="lb-clock">
              <div className="ring">
                <svg width="84" height="84" viewBox="0 0 84 84">
                  <circle cx="42" cy="42" r="36" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="7" />
                  <circle cx="42" cy="42" r="36" fill="none" stroke="#F2C33C" strokeWidth="7"
                          strokeLinecap="round" strokeDasharray={RING}
                          strokeDashoffset={RING * (1 - left.frac)} />
                </svg>
                <div className="mid"><b>{num(left.n)}</b><span>{left.unit}</span></div>
              </div>
              <span className="lab">រហូតដល់បញ្ចប់</span>
            </div>
          </div>
        </section>
      )}

      <section className="lb-ladder">
        <div className="lb-lhead">
          <span className="t">ដំណើរឡើងលីគ</span>
          <span className="need">{nextL && me
            ? <>នៅខ្វះ <b>{xpf(nextL.at - me.xp)} ពិន្ទុ</b> ដើម្បីឡើងលីគ{nextL.name}</>
            : "អ្នកឈរនៅលីគខ្ពស់បំផុត"}</span>
        </div>
        <div className="lb-rail">
          <div className="lb-track"><i style={{ width: ((pinAt - 10) / 80 * 100) + "%" }} /></div>
          {me && <span className="lb-you" style={{ left: pinAt + "%" }}>{initial(me.name)}</span>}
          <div className="lb-nodes">
            {leagues.map((l, i) => (
              <div key={l.name}
                   className={"lb-lg " + (i === leagueIndex ? "on" : i < leagueIndex ? "done" : "locked")}>
                <span className="well">
                  <Emblem i={i} color={l.color} size={i === leagueIndex ? 34 : 30} />
                  {i < leagueIndex && <span className="tick">{TICK}</span>}
                </span>
                <span className="nm">{l.name}</span>
                <span className="th">{l.at ? xpf(l.at) + "+" : "ចាប់ផ្តើម"}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="lb-podium">
        {[1, 0, 2].map(i => {
          const p = list[i]; if (!p) return null;
          const tone = ["g", "s", "b"][i];
          return (
            <div key={p.id ?? p.name} className={"lb-pod " + tone}>
              <div className="av" style={tint(p.name)}>{initial(p.name)}
                <span className="medal">{num(i + 1)}</span></div>
              <b>{p.name}</b>
              <span className="xp"><em>{xpf(p.xp)}</em> ពិន្ទុ</span>
              <span className={"d " + dcls(p.move)}>
                {arrow(p.move)} {p.move ? num(Math.abs(p.move)) : "គ្មានប្តូរ"}
              </span>
            </div>
          );
        })}
      </div>

      <section className="lb-table">
        <div className="lb-thead">
          <span>ចំណាត់</span><span /><span>អ្នកសិក្សា</span>
          <span className="r dcol">និន្នាការ</span><span className="r">ពិន្ទុ</span>
        </div>

        {list.map((p, i) => {
          const r = i + 1;
          if (r <= 3) return null;
          const rows = [];
          if (r === promote + 1)
            rows.push(<div key="z-up" className="lb-zone up">
              <i /><span>ឡើងលីគ{leagues[leagueIndex + 1]?.name ?? ""} · {num(promote)} នាក់ខាងលើ</span><i />
            </div>);
          if (r === list.length - relegate + 1)
            rows.push(<div key="z-dn" className="lb-zone dn">
              <i /><span>ធ្លាក់លីគ{leagues[leagueIndex - 1]?.name ?? ""} · {num(relegate)} នាក់ចុងក្រោយ</span><i />
            </div>);

          rows.push(
            <div key={p.id ?? p.name} ref={p.me ? rowRef : null}
                 className={"lb-row" + (p.me ? " me" : "")}>
              <span className="lb-rank">{num(r)}
                <span className={"mv " + dcls(p.move)} style={{
                  color: p.move > 0 ? "var(--lb-green)" : p.move < 0 ? "var(--lb-red)" : "var(--lb-faint)"
                }}>{arrow(p.move)}</span>
              </span>
              <span className="av" style={tint(p.name)}>{initial(p.name)}</span>
              <span className="lb-who">
                <b>{p.name}{p.me && <span className="lb-tagme">អ្នក</span>}</b>
                {p.streak ? <span>ស្ទ្រីក {num(p.streak)} ថ្ងៃ</span> : null}
              </span>
              <span className={"lb-d " + dcls(p.move)}>
                {p.move ? `${arrow(p.move)} ${num(Math.abs(p.move))}` : "—"}
              </span>
              <span className="lb-xp"><b>{xpf(p.xp)}</b><span>ពិន្ទុ</span>
                <span className="meter"><i style={{ width: Math.round(p.xp / top * 100) + "%" }} /></span>
              </span>
            </div>
          );
          return rows;
        })}
      </section>

      <p className="lb-foot">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B4B0A2"
             strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5.5M12 7.6v.1" /></svg>
        ពិន្ទុកំណត់ឡើងវិញរាល់យប់ថ្ងៃអាទិត្យ។ {num(promote)} នាក់ខាងលើឡើងលីគ · {num(relegate)} នាក់ចុងក្រោយធ្លាក់។
      </p>

      {me && (
        <div className={"lb-sticky" + (stuck ? " on" : "")}>
          <div className="in">
            <span className="rk">{num(meIdx + 1)}</span>
            <span className="av">{initial(me.name)}</span>
            <b>{me.name}</b>
            <span className="need">{ahead
              ? <>នៅខ្វះ <em>{xpf(need)} ពិន្ទុ</em> ដើម្បីឡើងទី {num(meIdx)}</>
              : "អ្នកនាំមុខគេ"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
