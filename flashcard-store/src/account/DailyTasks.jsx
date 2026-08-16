import { useEffect, useState } from "react";
import { REWARDS } from "../data/rewards.js";
import "./dailyTasks.css";

/* ---------- DailyTasks ----------
Ported from a supplied "Daily tasks" mockup, but every checkbox here is
auto-detected from real state rather than a manual click — see
storage.js's syncDailyTasks(): the daily goal, due-cards-cleared and
best-exam-score signals are all already tracked elsewhere in the app,
this just turns "you did the real thing" into an apple. The mockup's
third task ("score 80% in any exercise") is narrowed to exams only —
Practice.jsx is deliberately never scored into progress ("somewhere you
can be wrong cheaply"), so scoring it here would undercut that.
--------------------------------- */

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}
function AppleGlyph({ x, y, r }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 ${-r * 0.62} c${-r * 0.5} ${-r * 0.5} ${-r * 1.15} ${-r * 0.05} ${-r * 1.02} ${r * 0.62} c${r * 0.1} ${r * 0.62} ${r * 0.5} ${r * 1.02} ${r * 1.02} ${r * 1.02} c${r * 0.52} 0 ${r * 0.92} ${-r * 0.4} ${r * 1.02} ${-r * 1.02} c${r * 0.13} ${-r * 0.67} ${-r * 0.52} ${-r * 1.12} ${-r * 1.02} ${-r * 0.62}Z`}
        fill="#D65F42"
      />
      <path
        d={`M0 ${-r * 0.62} c${r * 0.5} ${-r * 0.5} ${r * 1.15} ${-r * 0.05} ${r * 1.02} ${r * 0.62} c${-r * 0.1} ${r * 0.62} ${-r * 0.5} ${r * 1.02} ${-r * 1.02} ${r * 1.02}Z`}
        fill="#B94A30"
        opacity=".55"
      />
      <path d={`M0 ${-r * 0.62} v${-r * 0.55}`} stroke="#5C4A33" strokeWidth={r * 0.24} strokeLinecap="round" />
      <path
        d={`M${r * 0.06} ${-r * 0.98} c${r * 0.5} ${-r * 0.3} ${r * 0.72} ${r * 0.04} ${r * 0.5} ${r * 0.34} c${-r * 0.4} ${r * 0.12} ${-r * 0.7} ${-r * 0.06} ${-r * 0.5} ${-r * 0.34}Z`}
        fill="#3F6B48"
      />
    </g>
  );
}
function AppleIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <AppleGlyph x={12} y={13} r={4.6} />
    </svg>
  );
}

function TaskRow({ done, title, sub, bar, cost }) {
  return (
    <div className={`dt-task${done ? " dt-done" : ""}`}>
      <span className="dt-box">{done && <CheckIcon />}</span>
      <span className="dt-t">
        <b>{title}</b>
        <span>{sub}</span>
        {bar != null && (
          <span className="dt-bar">
            <i style={{ width: `${bar}%` }} />
          </span>
        )}
      </span>
      <span className="dt-reward">
        <AppleIcon /> {cost}
      </span>
    </div>
  );
}

export default function DailyTasks({ cardsToday, dailyGoal, totalDue, bestExamScoreToday, state, harvest, claimedRewards, onBack, onOpenVouchers }) {
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (state.earnedNow > 0) {
      setToast(`+${state.earnedNow} apple${state.earnedNow === 1 ? "" : "s"} earned today`);
      const id = setTimeout(() => setToast(""), 3000);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goalPct = Math.min(100, Math.round((cardsToday / dailyGoal) * 100));
  const nextReward = REWARDS.filter((r) => !claimedRewards.includes(r.id)).sort((a, b) => a.cost - b.cost)[0];
  const nextPct = nextReward ? Math.min(100, Math.round((harvest.available / nextReward.cost) * 100)) : 100;

  return (
    <div className="dt-root">
      <div className="dt-wrap">
        <div className="dt-bar-top">
          <button type="button" className="dt-close" aria-label="Back to dashboard" onClick={onBack}>
            <CloseIcon />
          </button>
          <h1>Daily tasks</h1>
        </div>
        <p className="dt-lede">Three small jobs a day. Each one is worth an apple, and apples buy money off a printed box.</p>

        <div className="dt-cols">
          <main>
            <div className="dt-panel">
              <div className="dt-phead">
                <h2>Today's tasks</h2>
              </div>
              <div className="dt-pbody">
                <TaskRow
                  done={state.goal}
                  title="Reach your daily goal"
                  sub={`Study ${dailyGoal} cards in any deck · ${Math.min(cardsToday, dailyGoal)} of ${dailyGoal}`}
                  bar={goalPct}
                  cost={1}
                />
                <TaskRow
                  done={state.due}
                  title="Clear the cards due"
                  sub={totalDue === 0 ? "All caught up" : `${totalDue} card${totalDue === 1 ? "" : "s"} still due`}
                  cost={1}
                />
                <TaskRow
                  done={state.score}
                  title="Pass a timed exam"
                  sub={bestExamScoreToday > 0 ? `Best score today: ${bestExamScoreToday}%` : "Score 80% or better on any subject's exam"}
                  cost={1}
                />
              </div>

              <div className={`dt-bonus${state.bonus ? " dt-ready" : ""}`}>
                <span className="dt-t">
                  <b>Finish all three</b>
                  <span>{state.bonus ? "Bonus picked — see you tomorrow" : `${state.doneCount} of 3 done today`}</span>
                </span>
                <span className="dt-reward">
                  <AppleIcon /> 2
                </span>
              </div>
            </div>

            <div className="dt-panel">
              <div className="dt-phead">
                <h2>This week</h2>
                <span className="dt-when">{state.week.days.filter((d) => d.complete).length} of 7 days</span>
              </div>
              <div className="dt-pbody">
                <div className="dt-week">
                  {state.week.days.map((d, i) => (
                    <div key={d.key} className="dt-wd">
                      <em>{WEEKDAY_LABELS[i]}</em>
                      <div className={`dt-dot${d.complete ? " dt-on" : d.isToday ? " dt-today" : ""}`}>{d.complete && <CheckIcon />}</div>
                    </div>
                  ))}
                </div>
                <div className={`dt-bonus dt-weekbonus${state.week.claimed ? " dt-ready" : ""}`}>
                  <span className="dt-t">
                    <b>All seven days</b>
                    <span>{state.week.claimed ? "Bonus picked this week" : "A full week finishing all three tasks"}</span>
                  </span>
                  <span className="dt-reward">
                    <AppleIcon /> 5
                  </span>
                </div>
              </div>
            </div>
          </main>

          <aside>
            <div className="dt-wallet">
              <span className="dt-idx">Your apples</span>
              <div className="dt-wcount">
                <b>{harvest.available}</b>
                <span>apples</span>
              </div>
              <p>{state.earnedNow > 0 ? `Picked ${state.earnedNow} today.` : "Come back tomorrow for more."}</p>

              {nextReward && (
                <div className="dt-wnext">
                  <div className="dt-wrow">
                    <span>Next reward · {nextReward.title}</span>
                    <b>{Math.max(0, nextReward.cost - harvest.available)}</b>
                  </div>
                  <div className="dt-wbar">
                    <i style={{ width: `${nextPct}%` }} />
                  </div>
                </div>
              )}

              <button type="button" className="dt-wgo" onClick={onOpenVouchers}>
                See all vouchers
              </button>
            </div>

            <div className="dt-sidecard">
              <h3>How apples work</h3>
              <ul>
                <li>
                  <b>Three tasks a day</b>, one apple each.
                </li>
                <li>
                  <b>A bonus of 2</b> for finishing all three the same day.
                </li>
                <li>
                  <b>A bonus of 5</b> for a full seven-day week.
                </li>
                <li>
                  Your tree adds <b>one more apple a day</b> once it fruits at 100 days streak.
                </li>
                <li>Apples never expire, so you can save for the big reward.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <div className={`dt-toast${toast ? " dt-show" : ""}`}>{toast}</div>
    </div>
  );
}
