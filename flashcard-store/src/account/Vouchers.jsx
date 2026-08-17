import { useState } from "react";
import { REWARDS } from "../data/rewards.js";
import { AppleGrove } from "./AppleTree.jsx";
import "./vouchers.css";

/* ---------- Vouchers ----------
Ported from a supplied "Vouchers & offers" mockup — the ticket-card look,
the perforated rip line, the details bottom-sheet — but only the parts
backed by something real in storage.js survive the port:

  - The catalogue below and each apple cost are real design decisions,
    not mockup placeholders, but "how many apples you have" and "which of
    these you've claimed" are the actual account state (getHarvest() /
    getClaimedRewards() / getVouchers() in storage.js).
  - A claimed reward's code is the real one claimReward() generated and
    persisted, not a fake "APL-0000" — see the "Used" filter.
  - Dropped entirely because nothing tracks them: the mockup's "$7.00
    saved this year" tally, "Ending soon" / "Expired" states (there's no
    expiry system), the manual "Add a voucher" code-entry button (no
    backend to validate an arbitrary code against), and the fabricated
    voucher history ("WELCOME-15", "Used on order JC-10428"). Same
    "don't fake what isn't tracked" rule Dashboard.jsx and Home.jsx
    already follow.
  - The voucher code is now wired into Checkout (see Checkout.jsx's own
    header comment) — a claimed code actually discounts an order.
--------------------------------- */

function TicketMark(props) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2.6 2.6 0 0 0 0 6v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2.6 2.6 0 0 0 0-6Z" />
      <path d="M12 8.5v2M12 13.5v2" />
    </svg>
  );
}
function BoxMark(props) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" {...props}>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <path d="M6.5 3h11" />
    </svg>
  );
}
function TruckMark(props) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="1" y="6" width="15" height="11" rx="2" />
      <path d="M16 10h4l3 3v4h-7" />
      <circle cx="6" cy="18.5" r="2" />
      <circle cx="18" cy="18.5" r="2" />
    </svg>
  );
}
function PrinterMark(props) {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="7" rx="2" />
      <path d="M7 14h10v7H7z" />
    </svg>
  );
}
const ICON = { ship: TruckMark, print: PrinterMark, pct: TicketMark, free: BoxMark };

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" strokeLinecap="round" />
      <circle cx="12" cy="7.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13M13 6l6 6-6 6" />
    </svg>
  );
}

function apples(n) {
  return `${n} apple${n === 1 ? "" : "s"}`;
}

export default function Vouchers({ harvest, claimedRewards, vouchers, streak = 0, onClaimReward, onBack, onOpenDailyTasks }) {
  const [filter, setFilter] = useState("all");
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState("");

  // the tree's own state text — mirrors the mockup's day-driven copy, but
  // "picked since day 100" uses the real apple count (which can also
  // include daily-task apples) rather than recomputing it from the day
  const dayLabel =
    streak === 0 ? "No streak — the tree waits" :
    streak < 100 ? `${100 - streak} days to your first apple` :
    streak === 100 ? "Your tree is fruiting" :
    "One apple a day, every day you study";
  const harvestSub =
    streak === 0 ? "Your apples stay safe. Start again to grow the tree back." :
    streak < 100 ? "Reach 100 days and your tree starts to fruit." :
    streak === 100 ? "From tomorrow, one apple falls every day you study." :
    `Picked ${apples(harvest.available)} since day 100.`;

  const codeFor = (rewardId) => vouchers.find((v) => v.rewardId === rewardId)?.code ?? null;
  const claimedAtFor = (rewardId) => vouchers.find((v) => v.rewardId === rewardId)?.claimedAt ?? null;

  const readyCount = REWARDS.filter((r) => harvest.available >= r.cost && !claimedRewards.includes(r.id)).length;
  const usedCount = claimedRewards.length;

  const list = REWARDS.filter((r) => {
    const claimed = claimedRewards.includes(r.id);
    if (filter === "ready") return !claimed && harvest.available >= r.cost;
    if (filter === "used") return claimed;
    return true; // "all"
  });

  function claim(reward) {
    const code = onClaimReward(reward.id, reward.cost);
    if (!code) return;
    setToast("Voucher added to your account");
    setTimeout(() => setToast(""), 2400);
  }

  function copyCode(code) {
    navigator.clipboard?.writeText(code);
    setToast("Code copied");
    setTimeout(() => setToast(""), 1800);
  }

  return (
    <div className="jv-root">
      <div className="jv-wrap">
        <div className="jv-bar">
          <button type="button" className="jv-close" aria-label="Back to dashboard" onClick={onBack}>
            <CloseIcon />
          </button>
          <h1>Vouchers &amp; offers</h1>
        </div>

        <div className="jv-harvest">
          <AppleGrove day={streak} apples={harvest.available} />
          <div className="jv-hinfo">
            <div className="jv-count">
              <b>{harvest.available}</b>
              <span className="jv-u">apples</span>
            </div>
            <p className="jv-hsub">{harvestSub}</p>
            <div className="jv-dayline">
              <span className="jv-dayk">Day {streak}</span>
              <span className="jv-dayt">{dayLabel}</span>
            </div>
          </div>
        </div>

        <div className="jv-filters">
          <button type="button" className={filter === "all" ? "on" : ""} onClick={() => setFilter("all")}>
            All <em>{REWARDS.length}</em>
          </button>
          <button type="button" className={filter === "ready" ? "on" : ""} onClick={() => setFilter("ready")}>
            Ready <em>{readyCount}</em>
          </button>
          <button type="button" className={filter === "used" ? "on" : ""} onClick={() => setFilter("used")}>
            Used <em>{usedCount}</em>
          </button>
        </div>

        <div className="jv-list">
          {list.map((r) => {
            const claimed = claimedRewards.includes(r.id);
            const ready = !claimed && harvest.available >= r.cost;
            const pct = Math.min(100, Math.round((harvest.available / r.cost) * 100));
            const Mark = ICON[r.kind];
            return (
              <article key={r.id} className={`jv-v jv-${r.kind}${claimed ? " jv-used" : ""}`}>
                {claimed && <span className="jv-tag">Used</span>}
                <div className="jv-top">
                  <span className="jv-stub">
                    <Mark />
                  </span>
                  <span className="jv-t">
                    <b>{r.title}</b>
                    <span className="jv-valline">
                      <span className="jv-val">{r.val}</span>
                      <button type="button" className="jv-info" aria-label="Details" onClick={() => setDetail(r)}>
                        <InfoIcon />
                      </button>
                      <span className="jv-cost">{apples(r.cost)}</span>
                    </span>
                  </span>
                </div>

                <div className="jv-rip" />

                <div className="jv-bot">
                  {claimed ? (
                    <>
                      <span className="jv-code">{codeFor(r.id)}</span>
                      <button type="button" className="jv-use" disabled>
                        Used
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="jv-track">
                        <i style={{ width: `${pct}%` }} />
                      </span>
                      <button type="button" className="jv-use" disabled={!ready} onClick={() => claim(r)}>
                        {ready ? "Exchange" : `${r.cost - harvest.available} to go`}
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {list.length === 0 && (
          <div className="jv-empty">
            <span className="jv-eic">
              <TicketMark width={22} height={22} />
            </span>
            <b>Nothing here yet</b>
            <p>Pick apples by keeping your study streak going, then exchange them for a voucher.</p>
          </div>
        )}

        <div className="jv-earn">
          <b>Want more vouchers?</b>
          <p>
            Finish your three daily tasks to pick apples fast, or keep your study streak going — your tree starts
            dropping one a day once it passes 100 days.
          </p>
          <button type="button" className="jv-go" onClick={onOpenDailyTasks}>
            Go to daily tasks
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className={`jv-scrim${detail ? " jv-show" : ""}`} onClick={() => setDetail(null)} />
      <div className={`jv-sheet${detail ? " jv-show" : ""}`}>
        {detail && (
          <>
            <div className="jv-grab" />
            <h2>{detail.title}</h2>
            <p className="jv-big">
              {detail.val} · costs {apples(detail.cost)}
            </p>
            <p className="jv-desc">{detail.body}</p>
            {claimedRewards.includes(detail.id) ? (
              <>
                <div className="jv-codebox">
                  <b>{codeFor(detail.id)}</b>
                  <button type="button" className="jv-copy" onClick={() => copyCode(codeFor(detail.id))}>
                    Copy
                  </button>
                </div>
                <p className="jv-claimedat">
                  Claimed {new Date(claimedAtFor(detail.id)).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </>
            ) : (
              <button
                type="button"
                className="jv-use jv-sheetbtn"
                disabled={harvest.available < detail.cost}
                onClick={() => {
                  claim(detail);
                  setDetail(null);
                }}
              >
                {harvest.available >= detail.cost ? "Exchange now" : `${detail.cost - harvest.available} more ${detail.cost - harvest.available === 1 ? "apple" : "apples"}`}
              </button>
            )}
          </>
        )}
      </div>

      <div className={`jv-toast${toast ? " jv-show" : ""}`}>{toast}</div>
    </div>
  );
}
