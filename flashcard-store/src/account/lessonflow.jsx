<!doctype html>
<html lang="km">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>មេរៀន — ជីវវិទ្យា</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Siemreap&display=swap" rel="stylesheet">
<style>
html{scroll-behavior:smooth;scroll-padding-top:96px}
body{margin:0;background:#F7F5EF;
  font-family:"Siemreap","Khmer OS Siemreap","Noto Sans Khmer",system-ui,sans-serif}
.view{display:none}
.view.on{display:block;animation:vin .32s cubic-bezier(.22,1,.36,1)}
@keyframes vin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}

/* ── the lesson list ─────────────────────────────────────── */
#view-status{
  --paper:#F7F5EF;
  --card:#FFFFFF;
  --ink:#23271F;
  --muted:#8B8877;
  --faint:#B4B0A2;
  --line:#E7E3D7;
  --green:#2F3A2E;
  --green-soft:#EAF0E6;
  --gold:#F2C33C;
  --gold-deep:#C8931B;
  --amber:#E2A13A;
  --amber-soft:#FBF1DF;
  --shadow:0 1px 0 rgba(35,39,31,.04), 0 6px 18px rgba(35,39,31,.05);
  
  --mono:"Siemreap","Khmer OS Siemreap","Noto Sans Khmer",system-ui,sans-serif;
  --sans:"Siemreap","Khmer OS Siemreap","Noto Sans Khmer",system-ui,sans-serif;
}
#view-status *{box-sizing:border-box}
#view-status, #view-status{margin:0}
#view-status{
  background:var(--paper);color:var(--ink);font-family:var(--sans);
  -webkit-font-smoothing:antialiased;padding:40px 24px 80px;
}
#view-status .page{max-width:960px;margin:0 auto}
#view-status .kicker{font-family:var(--mono);font-size:11px;letter-spacing:.16em;
        text-transform:uppercase;color:var(--faint);margin:0 0 10px}
#view-status .head{display:flex;align-items:baseline;justify-content:space-between;gap:16px}
#view-status .head h2{font-family:var(--mono);font-size:19px;font-weight:700;margin:0}
#view-status .head .of{font-family:var(--mono);font-size:14px;color:var(--muted)}
#view-status .bar{height:6px;border-radius:99px;background:#E9E5D9;margin:14px 0 6px;overflow:hidden}
#view-status .bar i{display:block;height:100%;border-radius:99px;background:var(--green);
       width:0;transition:width 1.1s cubic-bezier(.22,1,.36,1)}
#view-status .legend{display:flex;flex-wrap:wrap;gap:6px 18px;margin:12px 0 6px;
        font-size:12.5px;color:var(--muted)}
#view-status .legend span{display:inline-flex;align-items:center;gap:7px}
#view-status .legend i{width:9px;height:9px;border-radius:99px;display:block}
#view-status .legend .k-done{background:var(--green)}
#view-status .legend .k-now{background:var(--gold)}
#view-status .legend .k-rev{background:var(--amber)}
#view-status .legend .k-next{background:#fff;box-shadow:inset 0 0 0 2px var(--green)}
#view-status .legend .k-lock{background:#D3CFC1}
#view-status .chap{margin-top:26px;padding-top:24px;border-top:1px dashed var(--line)}
#view-status .chap:first-of-type{margin-top:20px;padding-top:0;border-top:0}
#view-status .chap-head{
  width:100%;display:grid;
  grid-template-columns:44px minmax(0,1fr) auto 20px;
  align-items:center;gap:16px;
  background:none;border:0;padding:8px 12px 8px 8px;margin:0 -8px 12px;
  border-radius:16px;font:inherit;color:inherit;text-align:left;cursor:pointer;
  transition:background .15s ease;
}
#view-status .chap-head:hover{background:#F1EEE4}
#view-status .chap-head:disabled{cursor:default}
#view-status .ch-badge{
  width:44px;height:44px;border-radius:14px;display:grid;place-items:center;
  font-family:var(--mono);font-size:15px;font-weight:700;
  background:#fff;border:1.5px solid var(--line);color:var(--muted);
  transition:transform .16s ease;
}
#view-status .chap-head:hover .ch-badge{transform:translateY(-1px)}
#view-status .chap.done   .ch-badge{background:var(--green);border-color:var(--green);color:#fff}
#view-status .chap.open   .ch-badge{background:#FDF6E0;border-color:var(--gold);color:#6B4E06}
#view-status .chap.locked .ch-badge{background:#F1EEE4;border-color:#E0DCCE;color:#B9B5A6}
#view-status .ch-t{min-width:0}
#view-status .ch-t .n{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;
         text-transform:uppercase;color:var(--faint);display:block;margin-bottom:3px}
#view-status .ch-t h3{font-family:var(--mono);font-size:17px;font-weight:700;margin:0;line-height:1.3}
#view-status .chap.locked .ch-t h3{color:#8F8B7C}
#view-status .pips{display:flex;gap:4px;align-items:center}
#view-status .pips i{width:16px;height:6px;border-radius:99px;background:#E4E0D2;display:block}
#view-status .pips i.d{background:var(--green)}
#view-status .pips i.p{background:var(--gold)}
#view-status .pips i.r{background:var(--amber)}
#view-status .ch-of{font-family:var(--mono);font-size:12.5px;color:var(--muted);margin-left:10px}
#view-status .ch-right{display:flex;align-items:center}
#view-status .caret{color:var(--faint);display:grid;place-items:center;
       transition:transform .22s cubic-bezier(.22,1,.36,1)}
#view-status .chap.shut .caret{transform:rotate(-90deg)}
#view-status .chap-body{display:grid;grid-template-rows:1fr;
           transition:grid-template-rows .3s cubic-bezier(.22,1,.36,1), opacity .22s ease}
#view-status .chap.shut .chap-body{grid-template-rows:0fr;opacity:0}
#view-status .chap-body > .inner{overflow:hidden;min-height:0}
#view-status .list{display:grid;gap:12px;position:relative}
#view-status .les{
  position:relative;
  display:grid;grid-template-columns:52px minmax(0,1fr) auto;
  align-items:center;gap:18px;
  background:var(--card);border:1px solid var(--line);border-radius:18px;
  padding:16px 18px;box-shadow:var(--shadow);
  opacity:0;transform:translateY(10px);
  animation:rise .5s cubic-bezier(.22,1,.36,1) forwards;
  transition:transform .18s ease, box-shadow .18s ease;
}
@keyframes rise{to{opacity:1;transform:none}}
#view-status .les:hover{transform:translateY(-2px);box-shadow:0 10px 26px rgba(35,39,31,.09)}
#view-status .les.lock{background:#FBFAF6;border-style:dashed}
#view-status .les.lock:hover{transform:none;box-shadow:var(--shadow)}
#view-status .les::before, #view-status .les::after{
  content:"";position:absolute;left:44px;width:2px;
  background-image:linear-gradient(#D8D4C6 0 0);
  background-size:2px 4px;background-repeat:repeat-y;
}
#view-status .les::before{top:-13px;height:13px}
#view-status .les::after{bottom:-13px;height:13px}
#view-status .les:first-child::before, #view-status .les:last-child::after{display:none}
#view-status .les.done::after, #view-status .les.done + .les::before{background-image:linear-gradient(var(--gold) 0 0)}
#view-status .med{
  width:44px;height:44px;border-radius:50%;display:grid;place-items:center;
  font-family:var(--mono);font-size:15px;font-weight:700;
  border:2px solid var(--line);background:#fff;color:var(--faint);position:relative;
}
#view-status .done  .med{background:var(--green);border-color:var(--green);color:#fff}
#view-status .now   .med{background:var(--gold);border-color:var(--gold-deep);color:#3A2E08}
#view-status .rev   .med{background:var(--amber-soft);border-color:var(--amber);color:var(--amber)}
#view-status .next  .med{background:#fff;border-color:var(--green);color:var(--green)}
#view-status .lock  .med{background:#F1EEE4;border-color:#E0DCCE;color:#B9B5A6}
#view-status .now .med::after{
  content:"";position:absolute;inset:-6px;border-radius:50%;
  border:2px solid var(--gold);opacity:.55;animation:ping 2.2s ease-out infinite;
}
@keyframes ping{0%{transform:scale(.86);opacity:.55}70%{transform:scale(1.12);opacity:0}100%{opacity:0}}
#view-status .body{min-width:0}
#view-status .tag{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;
     text-transform:uppercase;display:inline-block;margin:0 0 5px;
     padding:2px 7px;border-radius:5px}
#view-status .done .tag{color:var(--green);background:var(--green-soft)}
#view-status .now  .tag{color:#6B4E06;background:#FBEFCC}
#view-status .rev  .tag{color:#9A6B14;background:var(--amber-soft)}
#view-status .next .tag{color:var(--muted);background:#F2EFE5}
#view-status .lock .tag{color:var(--faint);background:#F1EEE4}
#view-status .body h3{font-family:var(--mono);font-size:16px;font-weight:700;margin:0;
         line-height:1.35;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#view-status .lock .body h3{color:#8F8B7C}
#view-status .meta{margin:6px 0 0;font-size:13px;color:var(--muted);
      display:flex;flex-wrap:wrap;align-items:center;gap:5px 10px}
#view-status .meta b{font-weight:700;color:var(--ink)}
#view-status .meta .mini{flex-basis:100%;max-width:240px}
#view-status .dot{width:3px;height:3px;border-radius:99px;background:var(--faint);display:inline-block}
#view-status .mini{margin-top:9px;height:5px;border-radius:99px;background:#EEEADE;overflow:hidden}
#view-status .mini i{display:block;height:100%;border-radius:99px;background:var(--gold);
        width:0;transition:width 1.2s cubic-bezier(.22,1,.36,1) .3s}
#view-status .side{display:flex;align-items:center;gap:14px}
#view-status .score{display:flex;align-items:center;gap:7px;font-family:var(--mono);
       font-size:15px;font-weight:700}
#view-status .score.low{color:var(--amber)}
#view-status .btn{
  font-family:var(--sans);font-size:13px;font-weight:800;letter-spacing:.02em;
  padding:0 18px;height:40px;border-radius:12px;cursor:pointer;
  border:1.5px solid var(--line);background:#fff;color:var(--ink);
  display:inline-flex;align-items:center;gap:7px;white-space:nowrap;
  transition:transform .12s ease, background .15s ease, border-color .15s ease;
}
#view-status .btn:hover{border-color:#D6D1C1}
#view-status .btn:active{transform:translateY(1px)}
#view-status .btn.solid{background:var(--green);border-color:var(--green);color:#fff}
#view-status .btn.solid:hover{background:#3B4A38;border-color:#3B4A38}
#view-status .btn.gold{background:var(--gold);border-color:var(--gold-deep);color:#3A2E08}
#view-status .btn.gold:hover{background:#F6CE55}
#view-status .btn[disabled]{cursor:not-allowed;background:#F1EEE4;border-color:#E5E1D3;color:#B4B0A2}
#view-status .btn[disabled]:active{transform:none}
#view-status .ch-note{
  margin-top:12px;margin-left:70px;font-size:12.5px;color:var(--faint);
  display:flex;align-items:center;gap:8px;font-style:italic;
}
#view-status .after{
  margin-top:26px;border:1px dashed var(--line);border-radius:18px;
  background:#FCFBF7;padding:18px 20px;display:flex;gap:14px;
  align-items:center;justify-content:space-between;flex-wrap:wrap;
}
#view-status .after p{margin:0;font-size:13.5px;color:var(--muted)}
#view-status .after b{font-family:var(--mono);color:var(--ink);display:block;font-size:14px;margin-bottom:3px}
#view-status{line-height:1.55}
#view-status .head h2{font-size:20px;line-height:1.5}
#view-status .ch-t h3{font-size:17.5px;line-height:1.55}
#view-status .body h3{font-size:16px;line-height:1.6;padding-bottom:1px}
#view-status .meta{line-height:1.7}
#view-status .les{padding:18px}
#view-status .tag{padding:3px 8px}
#view-status .btn{height:42px;font-weight:700}
#view-status .score{font-size:15px}
#view-status .kicker, #view-status .tag, #view-status .ch-t .n{letter-spacing:.12em}
#view-status .head h2, #view-status .ch-t h3, #view-status .body h3, #view-status .meta, #view-status .ch-of, #view-status .after b{letter-spacing:0}
@media (max-width:640px){#view-status{padding:26px 14px 60px}
#view-status .chap-head{grid-template-columns:40px minmax(0,1fr) 20px;row-gap:10px}
#view-status .ch-badge{width:40px;height:40px;border-radius:12px}
#view-status .chap-head .caret{grid-column:3;grid-row:1}
#view-status .ch-right{grid-column:1 / -1;grid-row:2;justify-content:flex-start}
#view-status .les{grid-template-columns:44px minmax(0,1fr);row-gap:12px;padding:15px}
#view-status .les::before, #view-status .les::after{left:37px}
#view-status .med{width:38px;height:38px;font-size:13px}
#view-status .side{grid-column:1 / -1;justify-content:space-between}
#view-status .btn{flex:1;justify-content:center}
#view-status .body h3{white-space:normal}
#view-status .ch-note{margin-left:0}}

/* ── the reading page ────────────────────────────────────── */
#view-read{
  --paper:#F7F5EF; --card:#FFFFFF; --ink:#23271F; --muted:#8B8877;
  --faint:#B4B0A2; --line:#E7E3D7; --green:#2F3A2E; --green-soft:#EAF0E6;
  --gold:#F2C33C; --gold-deep:#C8931B; --gold-soft:#FBEFCC;
  --amber:#E2A13A; --amber-soft:#FBF1DF; --blue:#4A6B78; --blue-soft:#E8F0F2;
  --shadow:0 1px 0 rgba(35,39,31,.04), 0 6px 18px rgba(35,39,31,.05);
  --font:"Siemreap","Khmer OS Siemreap","Noto Sans Khmer",system-ui,sans-serif;
}
#view-read *{box-sizing:border-box}
#view-read{scroll-behavior:smooth;scroll-padding-top:96px}
#view-read{margin:0;background:var(--paper);color:var(--ink);font-family:var(--font);
     line-height:1.75;-webkit-font-smoothing:antialiased}
#view-read .top{position:sticky;top:0;z-index:40;background:rgba(247,245,239,.94);
     backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
#view-read .top .in{max-width:820px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;gap:12px}
#view-read .top .ttl{flex:1;min-width:0}
#view-read .top .ttl b{display:block;font-size:15.5px;line-height:1.4;
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#view-read .top .ttl span{font-size:11.5px;color:var(--muted)}
#view-read .read{height:3px;background:#E9E5D9}
#view-read .read i{display:block;height:100%;width:0;background:var(--gold)}
#view-read .ib{width:40px;height:40px;border-radius:12px;border:1.5px solid var(--line);
    background:#fff;cursor:pointer;display:grid;place-items:center;color:var(--ink);flex:none}
#view-read .ib:hover{border-color:#D6D1C1}
#view-read .ib.x{background:#C2503C;border-color:#C2503C;color:#fff}
#view-read .page{max-width:820px;margin:0 auto;padding:26px 20px 130px}
#view-read .hero{background:var(--card);border:1px solid var(--line);border-radius:20px;
      padding:24px;box-shadow:var(--shadow);margin-bottom:22px}
#view-read .hero .kick{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--faint);margin:0}
#view-read .hero h1{margin:6px 0 4px;font-size:24px;line-height:1.4}
#view-read .hero .en{margin:0;font-size:13px;color:var(--muted)}
#view-read .facts{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
#view-read .fact{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;color:var(--muted);
      background:#F4F1E7;border-radius:99px;padding:5px 12px}
#view-read .fact b{color:var(--ink)}
#view-read .nav{display:flex;gap:8px;overflow-x:auto;padding:2px 0 12px;margin-bottom:12px;
     scrollbar-width:none}
#view-read .nav::-webkit-scrollbar{display:none}
#view-read .nav a{white-space:nowrap;font-size:12.5px;text-decoration:none;color:var(--muted);
       background:#fff;border:1px solid var(--line);border-radius:99px;padding:6px 14px;
       transition:all .15s ease}
#view-read .nav a:hover{border-color:#D6D1C1;color:var(--ink)}
#view-read .nav a.on{background:var(--green);border-color:var(--green);color:#fff}
#view-read section{background:var(--card);border:1px solid var(--line);border-radius:20px;
        padding:22px;box-shadow:var(--shadow);margin-bottom:16px}
#view-read section > h2{display:flex;align-items:center;gap:11px;margin:0 0 14px;font-size:17px;line-height:1.45}
#view-read section > h2 .n{width:30px;height:30px;border-radius:9px;flex:none;display:grid;place-items:center;
                background:var(--green-soft);color:var(--green);font-size:13px}
#view-read h3{margin:18px 0 8px;font-size:14.5px;color:var(--muted)}
#view-read p{margin:0 0 12px;font-size:15px}
#view-read p:last-child{margin-bottom:0}
#view-read .en-i{color:var(--muted);font-size:.92em}
#view-read ul.b{list-style:none;margin:0;padding:0;display:grid;gap:9px}
#view-read ul.b li{display:flex;gap:10px;font-size:14.5px;align-items:flex-start}
#view-read ul.b li::before{content:"";width:7px;height:7px;border-radius:2px;background:var(--gold);
                flex:none;margin-top:10px}
#view-read .call{border-radius:14px;padding:14px 16px;font-size:14.5px;margin:14px 0 0}
#view-read .call.ex{background:var(--gold-soft)}
#view-read .call.key{background:var(--green-soft)}
#view-read .call b{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;
        color:var(--muted);margin-bottom:5px}
#view-read table{width:100%;border-collapse:collapse;font-size:14px;margin-top:6px}
#view-read th{text-align:left;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;
   color:var(--faint);font-weight:400;padding:0 10px 8px;border-bottom:1px solid var(--line)}
#view-read td{padding:11px 10px;border-bottom:1px solid #F1EEE4;vertical-align:top;line-height:1.65}
#view-read tr:last-child td{border-bottom:0}
#view-read td:first-child{white-space:nowrap}
#view-read td b{color:var(--ink)}
#view-read .tw{overflow-x:auto}
#view-read .trio{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:4px}
#view-read .trio div{background:#FBFAF6;border:1px solid var(--line);border-radius:14px;padding:14px}
#view-read .trio b{display:block;font-size:14px;margin-bottom:5px}
#view-read .trio span{font-size:13px;color:var(--muted);line-height:1.6}
#view-read .flow{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:8px}
#view-read .flow span{background:#fff;border:1.5px solid var(--line);border-radius:11px;
           padding:7px 13px;font-size:13.5px}
#view-read .flow span.hot{background:var(--gold-soft);border-color:var(--gold)}
#view-read .flow i{color:var(--faint);font-style:normal}
#view-read ol.steps{counter-reset:s;list-style:none;margin:0;padding:0;display:grid;gap:9px}
#view-read ol.steps li{counter-increment:s;display:flex;gap:11px;font-size:14.5px;align-items:flex-start}
#view-read ol.steps li::before{content:counter(s);width:24px;height:24px;border-radius:8px;flex:none;
  background:#F2EFE5;color:var(--muted);font-size:12px;display:grid;place-items:center;margin-top:3px}
#view-read figure{margin:0}
#view-read figure svg{width:100%;height:auto;display:block}
#view-read figcaption{font-size:12.5px;color:var(--faint);text-align:center;margin-top:6px}
#view-read .gl{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#view-read .gl div{display:flex;justify-content:space-between;gap:10px;background:#FBFAF6;
        border:1px solid var(--line);border-radius:12px;padding:9px 13px;font-size:13.5px}
#view-read .gl span{color:var(--muted);font-size:12.5px;text-align:right}
#view-read .qa{border:1px solid var(--line);border-radius:14px;overflow:hidden;margin-bottom:8px;background:#FBFAF6}
#view-read .qa button{width:100%;text-align:left;background:none;border:0;cursor:pointer;font-family:var(--font);
           font-size:14.5px;color:var(--ink);padding:13px 15px;display:flex;gap:10px;align-items:flex-start}
#view-read .qa button .c{margin-left:auto;color:var(--faint);transition:transform .2s ease;flex:none}
#view-read .qa.on button .c{transform:rotate(180deg)}
#view-read .qa .a{display:grid;grid-template-rows:0fr;transition:grid-template-rows .28s cubic-bezier(.22,1,.36,1)}
#view-read .qa.on .a{grid-template-rows:1fr}
#view-read .qa .a > div{overflow:hidden}
#view-read .qa .a p{margin:0;padding:0 15px 14px 44px;font-size:14px;color:var(--muted)}
#view-read .cta{position:fixed;left:0;right:0;bottom:0;z-index:40;
     background:rgba(247,245,239,.94);backdrop-filter:blur(10px);border-top:1px solid var(--line)}
#view-read .cta .in{max-width:820px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;gap:14px}
#view-read .cta .txt{flex:1;min-width:0}
#view-read .cta .txt b{display:block;font-size:14px}
#view-read .cta .txt span{font-size:12px;color:var(--muted)}
#view-read .go{font-family:var(--font);font-size:14.5px;padding:0 24px;height:48px;border-radius:14px;
    border:1.5px solid var(--gold-deep);background:var(--gold);color:#3A2E08;cursor:pointer;
    display:inline-flex;align-items:center;gap:9px;white-space:nowrap;
    transition:transform .12s ease,background .15s ease}
#view-read .go:hover{background:#F6CE55}
#view-read .go:active{transform:translateY(1px)}
#view-read .toast{position:fixed;left:50%;bottom:92px;transform:translate(-50%,14px);background:var(--green);
  color:#fff;padding:11px 20px;border-radius:13px;font-size:13.5px;opacity:0;pointer-events:none;
  transition:all .3s cubic-bezier(.22,1,.36,1);z-index:60}
#view-read .toast.on{opacity:1;transform:translate(-50%,0)}
@media (max-width:640px){#view-read .page{padding:18px 14px 130px}
#view-read .hero h1{font-size:20px}
#view-read section{padding:18px 16px;border-radius:18px}
#view-read .trio{grid-template-columns:1fr}
#view-read .gl{grid-template-columns:1fr}
#view-read .cta .txt{display:none}
#view-read .go{width:100%;justify-content:center}
#view-read .top .ttl b{font-size:14px}}
</style>
</head>
<body>

<div class="view on" id="view-status">

<div class="page">

  <p class="kicker">Biology</p>
  <div class="head">
    <h2 id="count">— lessons</h2>
    <span class="of" id="of">—</span>
  </div>
  <div class="bar"><i id="prog"></i></div>
  <div class="legend">
    <span><i class="k-done"></i> Complete</span>
    <span><i class="k-now"></i> In progress</span>
    <span><i class="k-rev"></i> Needs review</span>
    <span><i class="k-next"></i> Up next</span>
    <span><i class="k-lock"></i> Locked</span>
  </div>

  <div id="chapters"></div>

  <div class="after">
    <p><b id="examline">ការប្រឡង</b>បញ្ចប់មេរៀនទាំងអស់ ដើម្បីធ្វើការប្រឡង និងទទួលបានវិញ្ញាបនបត្រ។</p>
    <button class="btn" disabled>Exam locked</button>
  </div>

</div>



</div>

<div class="view" id="view-read">


<div class="top">
  <div class="in">
    <button class="ib" id="back" aria-label="Back">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>
    </button>
    <span class="ttl">
      <b>តម្រូវប្រសាទ</b>
      <span>ជំពូកទី ៣ · មេរៀនទី ៥ · ជីវវិទ្យា</span>
    </span>
    <button class="ib x" id="close" aria-label="Close">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
  </div>
  <div class="read"><i id="bar"></i></div>
</div>

<div class="page">

  <div class="hero">
    <p class="kick">Biology · ជីវវិទ្យា</p>
    <h1>តម្រូវប្រសាទ</h1>
    <p class="en">Nervous Regulation · មេរៀនលម្អិតសម្រាប់សិក្សា និងត្រៀមប្រឡង</p>
    <div class="facts">
      <span class="fact">📖 <b>១៩</b> ផ្នែក</span>
      <span class="fact">⏱️ អាន <b>១២</b> នាទី</span>
      <span class="fact">✍️ លំហាត់ <b>១៤</b> សំណួរ</span>
    </div>
  </div>

  <nav class="nav" id="nav">
    <a href="#s1">គោលបំណង</a>
    <a href="#s2">និយមន័យ</a>
    <a href="#s4">ណឺរ៉ូន</a>
    <a href="#s7">ស៊ីណាប់</a>
    <a href="#s8">CNS · PNS</a>
    <a href="#s10">ខួរក្បាល</a>
    <a href="#s12">Reflex</a>
    <a href="#s16">សង្ខេប</a>
    <a href="#s17">ពាក្យគន្លឹះ</a>
    <a href="#s18">ឆ្លើយដោយខ្លួនឯង</a>
  </nav>

  <!-- ១ -->
  <section id="s1">
    <h2><span class="n">១</span> គោលបំណងមេរៀន</h2>
    <ul class="b">
      <li>ពន្យល់និយមន័យនៃតម្រូវប្រសាទ និងសារៈសំខាន់របស់វា។</li>
      <li>ស្គាល់រចនាសម្ព័ន្ធ និងមុខងាររបស់ណឺរ៉ូន <span class="en-i">(Neuron)</span>។</li>
      <li>ពន្យល់ដំណើរនៃសារប្រសាទពីអ្នកទទួលរំញោចទៅកាន់សរីរាង្គឆ្លើយតប។</li>
      <li>បែងចែកប្រព័ន្ធប្រសាទកណ្ដាល និងប្រព័ន្ធប្រសាទជាយ។</li>
      <li>ពន្យល់អំពី Reflex action និង Reflex arc។</li>
      <li>ស្គាល់ផ្នែកសំខាន់ៗនៃខួរក្បាល និងមុខងាររបស់វា។</li>
    </ul>
  </section>

  <!-- ២ · ៣ -->
  <section id="s2">
    <h2><span class="n">២</span> និយមន័យតម្រូវប្រសាទ</h2>
    <p>តម្រូវប្រសាទ <span class="en-i">(Nervous Regulation)</span> គឺជាដំណើរការដែលប្រព័ន្ធប្រសាទទទួលរំញោចពីបរិស្ថានខាងក្រៅ ឬខាងក្នុង បញ្ជូនព័ត៌មានទៅកាន់មជ្ឈមណ្ឌលប្រសាទ ដើម្បីវិភាគ និងបញ្ជាឱ្យសរីរាង្គឆ្លើយតបយ៉ាងសមស្រប។</p>
    <div class="call ex">
      <b>ឧទាហរណ៍</b>
      ពេលដៃប៉ះវត្ថុក្តៅ → អ្នកទទួលរំញោចទទួលសញ្ញា → សារប្រសាទត្រូវបានបញ្ជូន → សាច់ដុំកន្ត្រាក់ → ដកដៃចេញ។
    </div>

    <h3>៣ · សារៈសំខាន់នៃប្រព័ន្ធប្រសាទ</h3>
    <ul class="b">
      <li>ទទួលព័ត៌មានពីបរិស្ថាន និងពីខាងក្នុងរាងកាយ។</li>
      <li>បញ្ជូនព័ត៌មានទៅកាន់មជ្ឈមណ្ឌលប្រសាទ។</li>
      <li>វិភាគ និងសម្របសម្រួលការឆ្លើយតប។</li>
      <li>គ្រប់គ្រងចលនាស្ម័គ្រចិត្ត និងចលនាមិនស្ម័គ្រចិត្តមួយចំនួន។</li>
      <li>ជួយឱ្យរាងកាយរក្សាសមតុល្យ និងឆ្លើយតបបានរហ័ស។</li>
    </ul>
  </section>

  <!-- ៤ · ៥ -->
  <section id="s4">
    <h2><span class="n">៤</span> ណឺរ៉ូន <span class="en-i">(Neuron)</span></h2>
    <p>ណឺរ៉ូន គឺជាកោសិកាឯកទេសរបស់ប្រព័ន្ធប្រសាទ ដែលអាចទទួល និងបញ្ជូនសារប្រសាទ។</p>

    <figure>
      <svg viewBox="0 0 760 250" role="img" aria-label="រូបណឺរ៉ូន">
        <defs>
          <marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill="#8B8877"/>
          </marker>
        </defs>
        <!-- dendrites -->
        <g stroke="#2F3A2E" stroke-width="4" fill="none" stroke-linecap="round">
          <path d="M120 125 L58 78 M58 78 L30 62 M58 78 L44 50"/>
          <path d="M120 125 L54 125 M54 125 L26 112 M54 125 L26 138"/>
          <path d="M120 125 L58 172 M58 172 L30 188 M58 172 L44 200"/>
        </g>
        <!-- soma -->
        <circle cx="152" cy="125" r="38" fill="#EAF0E6" stroke="#2F3A2E" stroke-width="4"/>
        <circle cx="152" cy="125" r="13" fill="#2F3A2E"/>
        <!-- axon with myelin -->
        <line x1="190" y1="125" x2="600" y2="125" stroke="#2F3A2E" stroke-width="5"/>
        <g fill="#F2C33C" stroke="#C8931B" stroke-width="2.5">
          <rect x="228" y="107" width="70" height="36" rx="18"/>
          <rect x="320" y="107" width="70" height="36" rx="18"/>
          <rect x="412" y="107" width="70" height="36" rx="18"/>
          <rect x="504" y="107" width="70" height="36" rx="18"/>
        </g>
        <!-- terminals -->
        <g stroke="#2F3A2E" stroke-width="4" fill="none" stroke-linecap="round">
          <path d="M600 125 L648 96 M648 96 L690 86"/>
          <path d="M600 125 L654 125 M654 125 L698 125"/>
          <path d="M600 125 L648 154 M648 154 L690 164"/>
        </g>
        <g fill="#2F3A2E"><circle cx="694" cy="84" r="7"/><circle cx="702" cy="125" r="7"/><circle cx="694" cy="166" r="7"/></g>
        <!-- labels -->
        <g font-family="Siemreap, Khmer OS Siemreap, sans-serif" font-size="15" fill="#23271F">
          <text x="14" y="30">ដង់ដ្រាយ</text>
          <text x="128" y="205">តួកោសិកា</text>
          <text x="330" y="90">អាក់សុង</text>
          <text x="292" y="182">ស្រទាប់មីអេលីន</text>
          <text x="612" y="222">ចុងអាក់សុង</text>
        </g>
        <g stroke="#8B8877" stroke-width="1.6" fill="none" marker-end="url(#ar)">
          <path d="M44 36 L52 56"/>
          <path d="M162 192 L156 168"/>
          <path d="M356 96 L344 116"/>
          <path d="M336 172 L338 148"/>
          <path d="M660 210 L668 176"/>
        </g>
      </svg>
      <figcaption>ផ្នែកសំខាន់ៗរបស់ណឺរ៉ូន</figcaption>
    </figure>

    <div class="tw">
    <table>
      <tr><th>ផ្នែក</th><th>ពាក្យអង់គ្លេស</th><th>មុខងារ</th></tr>
      <tr><td><b>ដង់ដ្រាយ</b></td><td>Dendrite</td><td>ទទួលសារពីកោសិកាផ្សេង ឬពីអ្នកទទួលរំញោច</td></tr>
      <tr><td><b>តួកោសិកា</b></td><td>Cell body / Soma</td><td>ផ្ទុកស្នូល និងគ្រប់គ្រងសកម្មភាពកោសិកា</td></tr>
      <tr><td><b>អាក់សុង</b></td><td>Axon</td><td>បញ្ជូនសារប្រសាទចេញពីតួកោសិកា</td></tr>
      <tr><td><b>ស្រទាប់មីអេលីន</b></td><td>Myelin sheath</td><td>ការពារ និងបង្កើនល្បឿនបញ្ជូនសារតាមអាក់សុង</td></tr>
      <tr><td><b>ចុងអាក់សុង</b></td><td>Axon terminals</td><td>បញ្ជូនសញ្ញាទៅកោសិកាគោលដៅ</td></tr>
    </table>
    </div>

    <h3>៥ · ប្រភេទណឺរ៉ូន</h3>
    <div class="trio">
      <div><b>ណឺរ៉ូនទទួលអារម្មណ៍</b><span>Sensory neuron — បញ្ជូនព័ត៌មានពីអ្នកទទួលរំញោចទៅ CNS</span></div>
      <div><b>ណឺរ៉ូនចលនា</b><span>Motor neuron — បញ្ជូនបញ្ជាពី CNS ទៅសាច់ដុំ ឬក្រពេញ</span></div>
      <div><b>ណឺរ៉ូនភ្ជាប់</b><span>Interneuron — ភ្ជាប់ និងដំណើរការព័ត៌មាននៅក្នុង CNS</span></div>
    </div>
  </section>

  <!-- ៦ · ៧ -->
  <section id="s7">
    <h2><span class="n">៦</span> រំញោច · សារប្រសាទ · ស៊ីណាប់</h2>
    <p><b>រំញោច</b> <span class="en-i">(Stimulus)</span> គឺជាការប្រែប្រួលដែលអាចត្រូវបានទទួលស្គាល់ដោយអ្នកទទួលរំញោច។</p>
    <p><b>សារប្រសាទ</b> <span class="en-i">(Nerve impulse)</span> គឺជាសញ្ញាអគ្គិសនី/អេឡិចត្រូគីមីដែលឆ្លងកាត់ណឺរ៉ូន ដើម្បីបញ្ជូនព័ត៌មាន។</p>
    <div class="call ex">
      <b>ឧទាហរណ៍</b>
      ពន្លឺ → អ្នកទទួលនៅភ្នែក → សារប្រសាទ → ខួរក្បាល → ការយល់ឃើញ។
    </div>

    <h3>៧ · ស៊ីណាប់ (Synapse)</h3>
    <p>Synapse គឺជាតំបន់តភ្ជាប់រវាងណឺរ៉ូនមួយ និងកោសិកាផ្សេងទៀត ឬណឺរ៉ូនមួយទៀត។</p>
    <ul class="b">
      <li>សារប្រសាទ<b>មិន</b>ឆ្លងកាត់ចន្លោះស៊ីណាប់ដោយផ្ទាល់ទេ។</li>
      <li>នៅចុងអាក់សុង សារគីមីដែលហៅថា <span class="en-i">Neurotransmitter</span> ត្រូវបានបញ្ចេញ។</li>
      <li>វាឆ្លងកាត់ចន្លោះស៊ីណាប់ ហើយភ្ជាប់ទៅ receptor របស់កោសិកាគោលដៅ។</li>
      <li>ដំណើរនេះធ្វើឱ្យសារប្រសាទបន្តទៅកាន់កោសិកាបន្ទាប់។</li>
    </ul>
  </section>

  <!-- ៨ · ៩ -->
  <section id="s8">
    <h2><span class="n">៨</span> ប្រព័ន្ធប្រសាទរបស់មនុស្ស</h2>
    <div class="trio" style="grid-template-columns:1fr 1fr">
      <div><b>ប្រព័ន្ធប្រសាទកណ្ដាល (CNS)</b><span>ខួរក្បាល (Brain) និងខួរឆ្អឹងខ្នង (Spinal cord)</span></div>
      <div><b>ប្រព័ន្ធប្រសាទជាយ (PNS)</b><span>សរសៃប្រសាទដែលភ្ជាប់ CNS ទៅសរីរាង្គ — ផ្លូវនាំចូល (sensory) និងផ្លូវនាំចេញ (motor)</span></div>
    </div>

    <h3>៩ · ប្រព័ន្ធប្រសាទស្វ័យប្រវត្តិ</h3>
    <p>Autonomic nervous system គ្រប់គ្រងមុខងាររបស់សរីរាង្គដែលភាគច្រើនមិនស្ថិតក្រោមការបញ្ជាដោយចេតនា ដូចជា ចង្វាក់បេះដូង ការរំលាយអាហារ និងការពង្រីក/រួមតូចរបស់សរសៃឈាម។</p>
    <div class="tw">
    <table>
      <tr><th>ផ្នែក</th><th>តួនាទីទូទៅ</th><th>ឧទាហរណ៍</th></tr>
      <tr><td><b>Sympathetic</b></td><td>ត្រៀមឆ្លើយតបពេលមានភាពតានតឹង ឬគ្រោះថ្នាក់</td><td>បង្កើនចង្វាក់បេះដូង</td></tr>
      <tr><td><b>Parasympathetic</b></td><td>ជួយឱ្យរាងកាយសម្រាក និងស្តារសកម្មភាពធម្មតា</td><td>ជំរុញការរំលាយអាហារ</td></tr>
    </table>
    </div>
  </section>

  <!-- ១០ · ១១ -->
  <section id="s10">
    <h2><span class="n">១០</span> ខួរក្បាល និងខួរឆ្អឹងខ្នង</h2>
    <div class="tw">
    <table>
      <tr><th>ផ្នែក</th><th>មុខងារសំខាន់</th><th>ឧទាហរណ៍</th></tr>
      <tr><td><b>ខួរធំ</b><br><span class="en-i">Cerebrum</span></td><td>ការគិត ការចងចាំ ការយល់ដឹង អារម្មណ៍ និងចលនាដោយចេតនា</td><td>គិត ដោះស្រាយបញ្ហា និយាយ</td></tr>
      <tr><td><b>ខួរតូច</b><br><span class="en-i">Cerebellum</span></td><td>សម្របសម្រួលចលនា និងរក្សាលំនឹង</td><td>ដើរ រក្សាលំនឹង</td></tr>
      <tr><td><b>Medulla oblongata</b></td><td>គ្រប់គ្រងមុខងារស្វ័យប្រវត្តិសំខាន់ៗ</td><td>ដង្ហើម ចង្វាក់បេះដូង</td></tr>
      <tr><td><b>Hypothalamus</b></td><td>គ្រប់គ្រងសីតុណ្ហភាព ស្រេកឃ្លាន និងសមតុល្យខាងក្នុង</td><td>Thermoregulation</td></tr>
    </table>
    </div>

    <h3>១១ · ខួរឆ្អឹងខ្នង (Spinal cord)</h3>
    <ul class="b">
      <li>ជាផ្នែកមួយនៃប្រព័ន្ធប្រសាទកណ្ដាល។</li>
      <li>បញ្ជូនសាររវាងខួរក្បាល និងផ្នែកផ្សេងៗនៃរាងកាយ។</li>
      <li>ជាមជ្ឈមណ្ឌលសំខាន់សម្រាប់ Reflex មួយចំនួន។</li>
    </ul>
  </section>

  <!-- ១២ · ១៣ · ១៤ -->
  <section id="s12">
    <h2><span class="n">១២</span> ប្រតិកម្មឆ្លុះ <span class="en-i">(Reflex action)</span></h2>
    <p>ជាការឆ្លើយតប<b>រហ័ស</b> និង<b>មិនស្ម័គ្រចិត្ត</b>ចំពោះរំញោច ដែលជួយការពាររាងកាយ។</p>

    <h3>១២.១ · Reflex arc</h3>
    <div class="flow">
      <span class="hot">រំញោច</span><i>→</i>
      <span>Receptor</span><i>→</i>
      <span>Sensory neuron</span><i>→</i>
      <span>CNS</span><i>→</i>
      <span>Motor neuron</span><i>→</i>
      <span>Effector</span><i>→</i>
      <span class="hot">ការឆ្លើយតប</span>
    </div>

    <h3>១៣ · ឧទាហរណ៍៖ ដកដៃចេញពីវត្ថុក្តៅ</h3>
    <ol class="steps">
      <li>ស្បែកទទួលកម្ដៅខ្លាំងជារំញោច។</li>
      <li>Receptor នៅស្បែកបង្កើតសញ្ញាប្រសាទ។</li>
      <li>Sensory neuron បញ្ជូនសញ្ញាទៅខួរឆ្អឹងខ្នង។</li>
      <li>Interneuron ភ្ជាប់ព័ត៌មានទៅ Motor neuron។</li>
      <li>Motor neuron បញ្ជាសាច់ដុំដៃឱ្យកន្ត្រាក់។</li>
      <li>ដៃត្រូវបានដកចេញយ៉ាងរហ័ស។</li>
      <li>ខួរក្បាលក៏ទទួលព័ត៌មាន ដើម្បីឱ្យយើងដឹងថាឈឺ ឬក្តៅ។</li>
    </ol>

    <div class="call key">
      <b>ចងចាំ</b>
      ទទួល → បញ្ជូន → វិភាគ/បញ្ជា → ឆ្លើយតប
    </div>

    <h3>១៥ · ប្រៀបធៀប Sensory និង Motor neuron</h3>
    <div class="tw">
    <table>
      <tr><th>លក្ខណៈ</th><th>Sensory neuron</th><th>Motor neuron</th></tr>
      <tr><td><b>ទិសដៅ</b></td><td>Receptor → CNS</td><td>CNS → Effector</td></tr>
      <tr><td><b>មុខងារ</b></td><td>នាំព័ត៌មានអារម្មណ៍</td><td>នាំបញ្ជាទៅសរីរាង្គឆ្លើយតប</td></tr>
      <tr><td><b>គោលដៅ</b></td><td>ខួរក្បាល / ខួរឆ្អឹងខ្នង</td><td>សាច់ដុំ ឬក្រពេញ</td></tr>
    </table>
    </div>
  </section>

  <!-- ១៦ -->
  <section id="s16">
    <h2><span class="n">១៦</span> សង្ខេបមេរៀន</h2>
    <ul class="b">
      <li>តម្រូវប្រសាទជាការគ្រប់គ្រង និងសម្របសម្រួលការឆ្លើយតបរបស់រាងកាយតាមរយៈប្រព័ន្ធប្រសាទ។</li>
      <li>ណឺរ៉ូនជាឯកតាមូលដ្ឋានសម្រាប់ទទួល និងបញ្ជូនសារប្រសាទ។</li>
      <li>CNS = ខួរក្បាល + ខួរឆ្អឹងខ្នង។</li>
      <li>PNS = សរសៃប្រសាទដែលភ្ជាប់ CNS ទៅកាន់រាងកាយ។</li>
      <li>Reflex action ជាការឆ្លើយតបរហ័ស និងមិនស្ម័គ្រចិត្ត។</li>
      <li>Sensory neuron នាំព័ត៌មានចូល CNS ខណៈ Motor neuron នាំបញ្ជាចេញទៅ Effector។</li>
    </ul>
  </section>

  <!-- ១៧ -->
  <section id="s17">
    <h2><span class="n">១៧</span> ពាក្យគន្លឹះ ខ្មែរ–អង់គ្លេស</h2>
    <div class="gl">
      <div>តម្រូវប្រសាទ <span>Nervous regulation</span></div>
      <div>ណឺរ៉ូន <span>Neuron</span></div>
      <div>រំញោច <span>Stimulus</span></div>
      <div>សារប្រសាទ <span>Nerve impulse</span></div>
      <div>អ្នកទទួលរំញោច <span>Receptor</span></div>
      <div>ស៊ីណាប់ <span>Synapse</span></div>
      <div>សារធាតុបញ្ជូនប្រសាទ <span>Neurotransmitter</span></div>
      <div>ខួរក្បាល <span>Brain</span></div>
      <div>ខួរឆ្អឹងខ្នង <span>Spinal cord</span></div>
      <div>ប្រព័ន្ធប្រសាទកណ្ដាល <span>CNS</span></div>
      <div>ប្រព័ន្ធប្រសាទជាយ <span>PNS</span></div>
      <div>ប្រតិកម្មឆ្លុះ <span>Reflex action</span></div>
      <div>សរីរាង្គឆ្លើយតប <span>Effector</span></div>
    </div>
  </section>

  <!-- ១៨ -->
  <section id="s18">
    <h2><span class="n">១៨</span> ឆ្លើយដោយខ្លួនឯង</h2>
    <p style="color:var(--muted);font-size:13.5px">សាកល្បងឆ្លើយក្នុងចិត្តសិន ទើបចុចមើលចម្លើយ។</p>
    <div id="qa"></div>
  </section>

</div>

<div class="cta">
  <div class="in">
    <span class="txt">
      <b>រួចរាល់ហើយឬនៅ?</b>
      <span>លំហាត់ ១៤ សំណួរ · ៨ នាទី</span>
    </span>
    <button class="go" id="start">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5l13 7.5-13 7.5z"/></svg>
      ចាប់ផ្តើមលំហាត់
    </button>
  </div>
</div>

<div class="toast" id="toast"></div>



</div>

<script>
/* ─── the two views ───────────────────────────────────────── */
const VIEWS = {
  status: document.getElementById("view-status"),
  read  : document.getElementById("view-read"),
};
function show(which){
  Object.entries(VIEWS).forEach(([k, el]) => el.classList.toggle("on", k === which));
  window.scrollTo({ top:0, behavior:"instant" in window ? "instant" : "auto" });
}
</script>

<script>

/* ─── the data ─────────────────────────────────────────────────
   Chapters hold lessons. A lesson's state is one of
   done | now | rev | next | lock — everything else is derived.
   ──────────────────────────────────────────────────────────── */
const CHAPTERS = [
  { n:1, t:"ស៊ីមណូស្ពែម និងអង់ស្យូស្ពែម", lessons:[
      { n:1, t:"ស៊ីមណូស្ពែម",                      state:"done", q:8,  min:4, score:100 },
      { n:2, t:"អង់ស្យូស្ពែម",                      state:"done", q:8,  min:4, score:88  },
  ]},
  { n:2, t:"ការលូតលាស់ និងតំណបរំញោចរុក្ខជាតិ", lessons:[
      { n:3, t:"ដំណឹកនាំ និងការលូតលាស់នៅក្នុងរុក្ខជាតិ", state:"now",  q:8, min:5, at:5 },
      { n:4, t:"តំណបរំញោច",                       state:"rev",  q:10, min:6, score:63 },
  ]},
  { n:3, t:"តម្រូវផ្សេងៗរបស់សារពាង្គកាយ", lessons:[
      { n:5, t:"តម្រូវប្រសាទ",                     state:"next", q:14, min:8 },
      { n:6, t:"សរីរាង្គវិញ្ញាណ",                    state:"lock", q:8,  min:4, needs:5 },
      { n:7, t:"ប្រព័ន្ធអង់ដូគ្រីន",                  state:"lock", q:8,  min:4, needs:6 },
  ]},
];

/* Khmer numerals — every number the learner reads is in Khmer digits */
const KD = "០១២៣៤៥៦៧៨៩";
const kh = n => String(n).replace(/[0-9]/g, d => KD[+d]);

/* a star that fills to a percentage — its own gradient id each time */
let starId = 0;
function star(pct){
  const id = "sg" + (++starId);
  const p  = Math.max(0, Math.min(100, pct));
  return `<svg width="19" height="19" viewBox="0 0 24 24" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">
      <stop offset="${p}%" stop-color="#F2C33C"/>
      <stop offset="${p}%" stop-color="#FFFFFF"/>
    </linearGradient></defs>
    <path d="M12 2.6l2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z"
          fill="url(#${id})" stroke="#23271F" stroke-width="1.5" stroke-linejoin="round"/>
  </svg>`;
}

const ICON = {
  check:`<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5 10 17.5 19 7"/></svg>`,
  play :`<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5l13 7.5-13 7.5z"/></svg>`,
  lock :`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.4" stroke-linecap="round"><rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8.4 10.5V8a3.6 3.6 0 017.2 0v2.5"/></svg>`,
  redo :`<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 10-2.3 5.6"/><path d="M20 4.5V11h-6.4"/></svg>`,
  caret:`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l7 7 7-7"/></svg>`,
  lockS:`<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.6" stroke-linecap="round"><rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8.4 10.5V8a3.6 3.6 0 017.2 0v2.5"/></svg>`,
};

const dot = '<span class="dot"></span>';

/* what a chapter is, seen from its lessons */
function chapState(c){
  if (c.lessons.every(l => l.state === "done"))  return "done";
  if (c.lessons.every(l => l.state === "lock"))  return "locked";
  return "open";
}

function lessonRow(L, i){
  const el = document.createElement("article");
  el.className = "les " + L.state;
  el.style.animationDelay = (0.05 * i) + "s";

  let med, tag, meta, side;

  if (L.state === "done"){
    med  = ICON.check;
    tag  = "Complete";
    meta = `<b>សំណួរ ${kh(L.q)}</b> ${dot} ${kh(L.min)} នាទី ${dot} បានបញ្ចប់`;
    side = `<span class="score">${star(L.score)}${kh(L.score)}%</span>
            <button class="btn">${ICON.redo} Review</button>`;
  } else if (L.state === "now"){
    med  = ICON.play;
    tag  = "In progress";
    meta = `<b>${kh(L.at)} ក្នុងចំណោម ${kh(L.q)}</b> សំណួរ ${dot} នៅសល់ប្រហែល ${kh(Math.max(1, L.min - Math.round(L.min*L.at/L.q)))} នាទី
            <div class="mini"><i data-w="${Math.round(L.at/L.q*100)}"></i></div>`;
    side = `<button class="btn gold">${ICON.play} Continue</button>`;
  } else if (L.state === "rev"){
    med  = ICON.check;
    tag  = "Needs review";
    meta = `ពិន្ទុលើកមុន <b>${kh(L.score)}%</b> ${dot} ត្រូវការ ៧០% ទើបចាត់ថាមាំ`;
    side = `<span class="score low">${star(L.score)}${kh(L.score)}%</span>
            <button class="btn">${ICON.redo} Practise</button>`;
  } else if (L.state === "next"){
    med  = kh(L.n);
    tag  = "Up next";
    meta = `<b>សំណួរ ${kh(L.q)}</b> ${dot} ${kh(L.min)} នាទី`;
    side = `<button class="btn solid">${ICON.play} Start</button>`;
  } else {
    med  = ICON.lock;
    tag  = "Locked";
    meta = `បញ្ចប់មេរៀនទី ${kh(L.needs)} ដើម្បីបើកមេរៀននេះ`;
    side = `<button class="btn" disabled>Locked</button>`;
  }

  el.innerHTML =
    `<span class="med">${med}</span>
     <div class="body">
       <span class="tag">${tag}</span>
       <h3>មេរៀនទី ${kh(L.n)} · ${L.t}</h3>
       <div class="meta">${meta}</div>
     </div>
     <div class="side">${side}</div>`;
  return el;
}

function chapterBlock(c, ci){
  const st   = chapState(c);
  const done = c.lessons.filter(l => l.state === "done").length;
  const mins = c.lessons.reduce((a,l) => a + l.min, 0);

  const sec = document.createElement("section");
  sec.className = "chap " + st + (st === "done" || st === "locked" ? " shut" : "");

  const pips = c.lessons.map(l =>
    `<i class="${l.state === "done" ? "d" : l.state === "now" ? "p" : l.state === "rev" ? "r" : ""}"></i>`
  ).join("");

  sec.innerHTML =
    `<button class="chap-head" aria-expanded="true">
       <span class="ch-badge">${st === "done" ? ICON.check : st === "locked" ? ICON.lock : kh(c.n)}</span>
       <span class="ch-t">
         <span class="n">ជំពូកទី ${kh(c.n)}</span>
         <h3>${c.t}</h3>
       </span>
       <span class="ch-right">
         <span class="pips">${pips}</span>
         <span class="ch-of">${kh(done)}/${kh(c.lessons.length)}${st === "locked" ? "" : " · " + kh(mins) + " នាទី"}</span>
       </span>
       <span class="caret">${ICON.caret}</span>
     </button>
     <div class="chap-body"><div class="inner"><div class="list"></div></div></div>`;

  const list = sec.querySelector(".list");
  c.lessons.forEach((L, i) => list.appendChild(lessonRow(L, ci * 2 + i)));

  if (st === "locked"){
    const note = document.createElement("p");
    note.className = "ch-note";
    note.innerHTML = `${ICON.lockS} បើកនៅពេលបញ្ចប់ជំពូកទី ${kh(c.n - 1)}`;
    sec.querySelector(".inner").appendChild(note);
  }

  /* the head folds the chapter away */
  const head = sec.querySelector(".chap-head");
  head.setAttribute("aria-expanded", String(!sec.classList.contains("shut")));
  head.addEventListener("click", () => {
    const shut = sec.classList.toggle("shut");
    head.setAttribute("aria-expanded", String(!shut));
  });

  return sec;
}

const wrap = document.getElementById("chapters");
CHAPTERS.forEach((c, i) => wrap.appendChild(chapterBlock(c, i)));

/* ─── the course line at the top ───────────────────────────── */
const ALL  = CHAPTERS.flatMap(c => c.lessons);
const DONE = ALL.filter(l => l.state === "done").length;
document.getElementById("count").textContent = "ជំពូក " + kh(CHAPTERS.length) + " · មេរៀន " + kh(ALL.length);
document.getElementById("of").textContent    = "បានបញ្ចប់ " + kh(DONE) + " / " + kh(ALL.length);
document.getElementById("examline").textContent = "ការប្រឡងបើកនៅ " + kh(ALL.length) + " / " + kh(ALL.length);
requestAnimationFrame(() => {
  document.getElementById("prog").style.width = (DONE / ALL.length * 100) + "%";
  document.querySelectorAll(".mini i").forEach(i => i.style.width = i.dataset.w + "%");
});

/* clicking a row is the same as pressing its button */
wrap.addEventListener("click", e => {
  const el = e.target.closest(".les");
  if (!el || el.classList.contains("lock")) return;
  if (e.target.closest("button.btn")) return;
  const b = el.querySelector(".btn:not([disabled])");
  if (b) b.click();
});

</script>

<script>

/* ─── សំណួរ–ចម្លើយ ត្រៀមប្រឡង ─────────────────────────────── */
const QA = [
  ["តើតម្រូវប្រសាទជាអ្វី?",
   "ជាដំណើរការដែលប្រព័ន្ធប្រសាទទទួលព័ត៌មាន វិភាគ/សម្របសម្រួល និងបញ្ជាឱ្យរាងកាយឆ្លើយតប។"],
  ["តើណឺរ៉ូនជាអ្វី?",
   "ជាកោសិកាឯកទេសដែលទទួល និងបញ្ជូនសារប្រសាទ។"],
  ["តើ CNS មានអ្វីខ្លះ?",
   "ខួរក្បាល និងខួរឆ្អឹងខ្នង។"],
  ["តើ Sensory neuron មានមុខងារអ្វី?",
   "បញ្ជូនព័ត៌មានពី Receptor ទៅ CNS។"],
  ["តើ Motor neuron មានមុខងារអ្វី?",
   "បញ្ជូនបញ្ជាពី CNS ទៅ Effector។"],
  ["តើ Reflex action ជាអ្វី?",
   "ការឆ្លើយតបរហ័ស និងមិនស្ម័គ្រចិត្តចំពោះរំញោច។"],
  ["តើ Synapse មានតួនាទីអ្វី?",
   "ជាតំបន់ដែលអនុញ្ញាតឱ្យសារប្រសាទបន្តពីណឺរ៉ូនមួយទៅកោសិកាបន្ទាប់ តាមរយៈសារធាតុបញ្ជូនប្រសាទ។"],
  ["តើអ្វីទៅជា Reflex arc?",
   "លំដាប់ផ្លូវនៃសារពី Receptor តាម Sensory neuron ទៅមជ្ឈមណ្ឌលប្រសាទ ហើយតាម Motor neuron ទៅ Effector។"],
];

const CARET = `<svg class="c" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
  stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9l7 7 7-7"/></svg>`;

document.getElementById("qa").innerHTML = QA.map(([q, a], i) => `
  <div class="qa">
    <button type="button"><span>${i + 1}. ${q}</span>${CARET}</button>
    <div class="a"><div><p>${a}</p></div></div>
  </div>`).join("");

document.querySelectorAll(".qa button").forEach(b =>
  b.addEventListener("click", () => b.parentElement.classList.toggle("on")));

/* ─── របាររីកចម្រើននៃការអាន ─────────────────────────────── */
const bar = document.getElementById("bar");
function onScroll(){
  const h = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + "%";

  /* which chip is the section we are in */
  let cur = null;
  document.querySelectorAll("section").forEach(s => {
    if (s.getBoundingClientRect().top <= 140) cur = s.id;
  });
  document.querySelectorAll("#nav a").forEach(a =>
    a.classList.toggle("on", a.getAttribute("href") === "#" + cur));
}
window.addEventListener("scroll", onScroll, { passive:true });
onScroll();

/* ─── ប៊ូតុង ──────────────────────────────────────────────── */
function toast(m){
  const t = document.getElementById("toast");
  t.textContent = m; t.classList.add("on");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("on"), 2000);
}
document.getElementById("start").addEventListener("click", () => toast("ចាប់ផ្តើមលំហាត់ ១៤ សំណួរ"));
document.getElementById("back").addEventListener("click",  () => toast("ត្រឡប់ក្រោយ"));
document.getElementById("close").addEventListener("click", () => toast("បិទមេរៀន"));

</script>

<script>
/* ─── list → reading page ─────────────────────────────────── */
document.getElementById("view-status").addEventListener("click", e => {
  const row = e.target.closest(".les");
  if (!row || row.classList.contains("lock")) return;
  const title = row.querySelector("h3").textContent;
  /* only lesson ៥ has content written; the rest say so */
  if (!/៥/.test(title)) { note("មេរៀននេះមិនទាន់មានខ្លឹមសារ"); return; }
  show("read");
}, true);

/* the reading page's own buttons come back here */
["back","close"].forEach(id => {
  const b = document.getElementById(id);
  if (b) b.addEventListener("click", () => show("status"));
});

function note(m){
  const t = document.getElementById("toast");
  t.textContent = m; t.classList.add("on");
  clearTimeout(note._t); note._t = setTimeout(() => t.classList.remove("on"), 1800);
}
</script>
</body>
</html>