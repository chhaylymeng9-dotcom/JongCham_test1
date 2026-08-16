import { useState } from "react";
import { useI18n } from "../i18n.jsx";
import "./mydecks.css";

/* ---------- MyDecks ----------
Ported from a supplied "My decks" library mockup — the real multi-deck-
per-account view (session.decks). Search, grid/list toggle and per-deck
progress are all computed from real data by Account.jsx and handed in as
`decks`. The status filter row (All/In progress/Not started/Finished)
from the original mockup was removed by request.

Dropped rather than faked: the "N cards due across your decks" strip and
per-deck "due" badges (no spaced-repetition scheduler exists to back a
specific number), and the mockup's own header rail with a second deck
switcher (the real app header + Dashboard's account chip already cover
navigation — clicking a deck card here does the switching).
--------------------------------- */

const STATE_LABEL = { now: "In progress", done: "Finished", new: "Not started" };
const SPINE_COLOR = { grammar: "#2C4032", math: "#8C5A46", history: "#9A7B32", blank: "#5E7A86", physics: "#3B5B8C", chemistry: "#5B3B8C" };

function BackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function GridIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
function PlusIcon({ width = 22, height = 22 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export default function MyDecks({ decks, onBack, onOpenDeck, onAddDeck, embedded = false }) {
  const { pick } = useI18n();
  const [view, setView] = useState("grid");
  const [query, setQuery] = useState("");

  const counts = { now: decks.filter((d) => d.state === "now").length };
  const totalCards = decks.reduce((n, d) => n + (d.capacity || 0), 0);

  const list = decks.filter((d) => pick(d.catalog.name).toLowerCase().includes(query.toLowerCase()));

  return (
    <div className={embedded ? "jmd-root jmd-embedded" : "jmd-root"}>
      <div className={embedded ? "" : "jmd-wrap"}>
        {!embedded && (
          <button type="button" className="jmd-back" onClick={onBack}>
            <BackIcon /> Back to dashboard
          </button>
        )}

        {!embedded && (
          <div className="jmd-head">
            <div>
              <span className="jmd-label">Your library</span>
              <h1>My decks</h1>
            </div>
            <span className="jmd-sum">
              {decks.length} deck{decks.length === 1 ? "" : "s"} · {totalCards} cards · {counts.now} in progress
            </span>
          </div>
        )}

        <div className="jmd-bar">
          <div className="jmd-search">
            <SearchIcon />
            <input type="text" placeholder="Search decks" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div className="jmd-view">
            <button type="button" className={view === "grid" ? "jmd-on" : ""} onClick={() => setView("grid")} aria-label="Grid view">
              <GridIcon />
            </button>
            <button type="button" className={view === "list" ? "jmd-on" : ""} onClick={() => setView("list")} aria-label="List view">
              <ListIcon />
            </button>
          </div>
        </div>

        {list.length === 0 && decks.length > 0 && <p className="jmd-empty">No deck matches that.</p>}

        {/* "Add a deck" always renders, even with zero matches, so a
            narrow filter or search never strands you without a way to
            add a deck without first clicking back to "All". */}
        <div className={`jmd-decks${view === "list" ? " jmd-list" : ""}`}>
          {list.map((d) => {
            const color = SPINE_COLOR[d.subject] ?? "#5E7A86";
            return (
              <button key={d.deckId} type="button" className="jmd-deck" onClick={() => onOpenDeck(d.deckId)}>
                <span className="jmd-spine" style={{ background: color }} />
                <span className="jmd-in">
                  <span className="jmd-row1">
                    <h3>{pick(d.catalog.name)}</h3>
                    <span className={`jmd-state jmd-${d.state}`}>{STATE_LABEL[d.state]}</span>
                  </span>
                  <p className="jmd-meta">
                    {d.capacity} cards · {d.isCustom ? "Your own deck" : `${d.totalLessons} lessons`}
                    <br />
                    <span className="jmd-code">{d.code}</span>
                  </p>
                  <span className="jmd-pbar">
                    <i style={{ width: `${d.pct}%`, background: color }} />
                  </span>
                  <span className="jmd-plabel">
                    {d.pct === 100 ? "Complete" : "Progress"} <b>{d.pct}%</b>
                  </span>
                  <span className="jmd-foot">
                    <span className={`jmd-btn${d.state === "new" ? " jmd-solid" : ""}`}>
                      {d.state === "new" ? "Start" : d.state === "done" ? "Review" : "Continue"}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}

          <button type="button" className="jmd-add" onClick={onAddDeck}>
            <PlusIcon />
            <b>Add a deck</b>
            <span>Type a code from a box</span>
          </button>
        </div>
      </div>
    </div>
  );
}
