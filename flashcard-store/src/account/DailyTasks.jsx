import { useEffect, useState } from "react";
import { REWARDS } from "../data/rewards.js";
import { AppleGrove } from "./AppleTree.jsx";
import AppleMark from "../components/AppleMark.jsx";
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
/* the reward pills use the shop's apple (components/AppleMark.jsx) so the
   currency looks the same wherever it turns up */
function AppleIcon({ size = 16 }) {
  return <AppleMark size={size} />;
}

/* One row shape for everything that pays an apple — the three daily jobs
   and the two bonuses. `boost` marks a bonus: same row, dashed box, so a
   bonus doesn't need a container of its own. */
function TaskRow({ done, title, sub, bar, cost, boost }) {
  return (
    <div className={`dt-task${done ? " dt-done" : ""}${boost ? " dt-boost" : ""}`}>
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

export default function DailyTasks({
  cardsToday, dailyGoal, totalDue, bestExamScoreToday, state, harvest, claimedRewards,
  streak = 0, onBack, onOpenVouchers,
  // the Learn view's two rail cards, which move here on phones — the rail
  // itself drops under the map at that width, where nobody scrolls to it
  lessonsDone = 0, lessonsTotal = 0, nextLabel = "", examReady = false, onContinue,
}) {
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

  // the tree's own state text — moved here from the vouchers page, since the
  // streak that grows the tree is a daily-task concern, not a shop one
  const dayLabel =
    streak === 0 ? "No streak — the tree waits" :
    streak < 100 ? `${100 - streak} days to your first apple` :
    streak === 100 ? "Your tree is fruiting" :
    "One apple a day, every day you study";
  const harvestSub =
    streak === 0 ? "Your apples stay safe. Start again to grow the tree back." :
    streak < 100 ? "Reach 100 days and your tree starts to fruit." :
    streak === 100 ? "From tomorrow, one apple falls every day you study." :
    `Picked ${harvest.available} apple${harvest.available === 1 ? "" : "s"} since day 100.`;

  return (
    <div className="dt-root">
      <div className="dt-wrap">
        <div className="dt-bar-top">
          <button type="button" className="dt-close" aria-label="Back" onClick={onBack}>
            <CloseIcon />
          </button>
          <h1>Daily tasks</h1>
        </div>
        <p className="dt-lede">Three small jobs a day. Each one is worth an apple, and apples buy money off a printed box.</p>

        {/* phone only (see dailyTasks.css): the chapter progress and daily
            goal cards that live in the Learn view's right rail on desktop */}
        <div className="dt-relay">
          {lessonsTotal > 0 && (
            <section className="dt-panel dt-mini">
              <h2>Chapter progress</h2>
              <div className="dt-mbar">
                <span style={{ width: `${Math.round((lessonsDone / lessonsTotal) * 100)}%` }} />
              </div>
              <p className="dt-mnote">{lessonsDone} of {lessonsTotal} lessons complete</p>
              {nextLabel && (
                <>
                  <span className="dt-meyebrow">Next up</span>
                  <p className="dt-mnext">{nextLabel}</p>
                </>
              )}
              {onContinue && (
                <button type="button" className="dt-mgo" onClick={onContinue}>
                  {examReady ? "Start the exam" : "Continue"}
                </button>
              )}
            </section>
          )}

          <section className="dt-panel dt-mini">
            <h2>Today's goal</h2>
            <div className="dt-mbar dt-gold">
              <span style={{ width: `${goalPct}%` }} />
            </div>
            <p className="dt-mnote">{cardsToday} / {dailyGoal} cards</p>
            <p className="dt-mnote">
              {cardsToday >= dailyGoal
                ? "Goal reached — nice work."
                : `${dailyGoal - cardsToday} more cards in Practice or Exam.`}
            </p>
          </section>
        </div>

        {/* one home for the harvest: the count, what the tree is doing, and
            how close the next reward is. It used to be two cards saying the
            same number — this hero and a dark "your apples" panel beside the
            tasks — which is most of why the page read as a wall of boxes. */}
        <section className="dt-hero">
          <AppleGrove day={streak} apples={harvest.available} />
          <div className="dt-hinfo">
            <div className="dt-count">
              <b>{harvest.available}</b>
              <span className="dt-u">apples</span>
            </div>
            <p className="dt-hsub">{harvestSub}</p>
            <div className="dt-dayline">
              <span className="dt-dayk">Day {streak}</span>
              <span className="dt-dayt">{dayLabel}</span>
            </div>

            {nextReward && (
              <div className="dt-next">
                <div className="dt-nrow">
                  <span>Next reward · {nextReward.title}</span>
                  <b>{Math.max(0, nextReward.cost - harvest.available)} to go</b>
                </div>
                <div className="dt-nbar"><i style={{ width: `${nextPct}%` }} /></div>
              </div>
            )}

            <button type="button" className="dt-link" onClick={onOpenVouchers}>
              See all vouchers
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </section>

        {/* today and the week in one panel, split by a rule rather than by
            two more cards, and the bonuses as rows in the same list */}
        <section className="dt-panel">
          <div className="dt-phead">
            <h2>Today's tasks</h2>
            <span className="dt-when">{state.doneCount} of 3 done</span>
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
            <TaskRow
              boost
              done={state.bonus}
              title="Finish all three"
              sub={state.bonus ? "Bonus picked — see you tomorrow" : "A bonus on top of the three apples"}
              cost={2}
            />
          </div>

          <div className="dt-phead dt-split">
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
            <TaskRow
              boost
              done={state.week.claimed}
              title="All seven days"
              sub={state.week.claimed ? "Bonus picked this week" : "Finish all three tasks, seven days running"}
              cost={5}
            />
          </div>
        </section>

        <ul className="dt-notes">
          <li><b>Three tasks a day</b>, one apple each.</li>
          <li><b>A bonus of 2</b> for finishing all three the same day, <b>5</b> for a full week.</li>
          <li>Your tree adds <b>one more apple a day</b> once it fruits at a 100-day streak.</li>
          <li>Apples never expire, so you can save up for the bigger rewards.</li>
        </ul>
      </div>

      <div className={`dt-toast${toast ? " dt-show" : ""}`}>{toast}</div>
    </div>
  );
}
