import { useState } from "react";
import { useI18n } from "../i18n.jsx";
import Leaderboard from "../components/Leaderboard.jsx";
import { friendStandings, lastWeekStandings, leagueIndexFor, weekStandings } from "../data/leaderboardDemo.js";
import "./lessonPath.css";

/* ---------- LeaderboardPage ----------
The leaderboard as a page of its own, reached from the Learn rail the same
way Lessons and Practice are.

It used to render inside the lesson path, swapped in where the map goes.
That made it a mode rather than a place: every other rail item had to be
switched off while it was up, so the only way out was its own back arrow,
and clicking Practice from the leaderboard did nothing at all.

The markup keeps the `.lp-root .lp-main--board` classes because that is
where its width and its back control are styled — the wrapper is the whole
of what those selectors need, and duplicating the rules under a new prefix
would only mean two copies to keep in step.
--------------------------------- */

export default function LeaderboardPage({ name = "", streak = 0, onBack }) {
  const { t } = useI18n();
  const [view, setView] = useState("week");

  const standings =
    view === "last" ? lastWeekStandings(name)
    : view === "friends" ? friendStandings(name, streak)
    : weekStandings(name, streak);
  const me = standings.find((p) => p.me);

  return (
    <div className="lp-root">
      <div className="lp-shell">
        <div className="lp-main lp-main--board">
          <div className="col">
            <button type="button" className="lb-back" onClick={onBack}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M11 5l-6 7 6 7" />
              </svg>
              {t("lp.learn")}
            </button>
            <Leaderboard
              people={standings}
              leagueIndex={me ? leagueIndexFor(me.xp) : 0}
              week={23}
              promote={3}
              relegate={2}
              limit={7}
              view={view}
              onViewChange={setView}
              numerals="km"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
