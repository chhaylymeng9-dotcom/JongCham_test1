import { useState } from "react";
import "./authPanel.css";

/* ---------- Auth panel ----------
Ported 1:1 from a supplied static mockup — literal copy, not the app's
usual box-code sign-in. Both submit buttons are demo-only (they don't
call any real sign-in logic yet); wiring that up is a follow-up.
--------------------------------- */

const emailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim());
const STRENGTH_COLORS = ["#A6485A", "#C08A3E", "#9A9F5E", "#2C4032"];
const STRENGTH_WORDS = ["Weak", "Okay", "Good", "Strong"];

function passwordStrength(v) {
  if (!v) return 0;
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
  if (/\d/.test(v)) s++;
  if (/[^A-Za-z0-9]/.test(v) || v.length >= 14) s++;
  return Math.max(1, s);
}

function ErrorIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v5M12 16.5v.01" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M10.6 6.2A9.9 9.9 0 0 1 12 6c6.4 0 10 6 10 6a18 18 0 0 1-3 3.6M6.6 6.8A17.6 17.6 0 0 0 2 12s3.6 6 10 6a10 10 0 0 0 4.2-.9" />
      <path d="M3 3l18 18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6Z" />
      <path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.6 14.7a7.2 7.2 0 0 1 0-4.6v-3H1.8a12 12 0 0 0 0 10.6l3.8-3Z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15.1 0 12 0 7.4 0 3.4 2.6 1.8 6.5l3.8 3c.9-2.8 3.4-4.7 6.4-4.7Z" />
    </svg>
  );
}

/* The barricade the deck is hiding behind — same paper/typewriter palette
   as the rest of the panel, so it reads as our page and not a stock 404. */
function ConstructionArt() {
  return (
    <svg className="ja-soon-art" viewBox="0 0 300 190" fill="none" aria-hidden="true">
      <defs>
        <pattern id="ja-stripe" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="16" height="16" fill="#FFFFFF" />
          <rect width="8" height="16" fill="var(--green)" />
        </pattern>
      </defs>

      {/* ground */}
      <path d="M24 158H276" stroke="var(--hair)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 9" />

      {/* a deck knocked over while the works are on */}
      <g transform="rotate(-19 46 141)">
        <rect x="20" y="122" width="52" height="38" rx="7" fill="#EFEBE0" stroke="var(--hair)" strokeWidth="1.5" />
      </g>
      <g transform="rotate(-9 48 137)">
        <rect x="22" y="118" width="52" height="38" rx="7" fill="#FFFFFF" stroke="var(--hair)" strokeWidth="1.5" />
        <text x="48" y="144" textAnchor="middle" fill="var(--ink)" fontFamily="var(--type)" fontSize="19" fontWeight="700">
          学
        </text>
      </g>

      {/* barricade */}
      <g stroke="#5B7360" strokeWidth="5" strokeLinecap="round">
        <path d="M84 158 98 84M110 158 96 84M190 158 204 84M216 158 202 84" />
      </g>
      <rect x="64" y="86" width="172" height="20" rx="5" fill="url(#ja-stripe)" stroke="var(--green)" strokeWidth="1.5" />
      <rect x="64" y="114" width="172" height="20" rx="5" fill="url(#ja-stripe)" stroke="var(--green)" strokeWidth="1.5" />

      {/* warning lamps */}
      <g className="ja-lamp">
        <circle cx="64" cy="80" r="8.5" fill="#C08A3E" />
        <circle cx="64" cy="80" r="3" fill="#F6F3EC" />
      </g>
      <g className="ja-lamp ja-lamp-2">
        <circle cx="236" cy="80" r="8.5" fill="#C08A3E" />
        <circle cx="236" cy="80" r="3" fill="#F6F3EC" />
      </g>

      {/* cone */}
      <path d="M264 108 280 152H248Z" fill="#C08A3E" />
      <path d="M257 127h14l2.5 9h-19Z" fill="#F6F3EC" />
      <rect x="242" y="150" width="44" height="8" rx="4" fill="#A87A34" />

      {/* dust */}
      <g fill="var(--green-line)">
        <circle cx="40" cy="64" r="2.5" />
        <circle cx="150" cy="52" r="3" />
        <circle cx="262" cy="60" r="2.5" />
        <circle cx="112" cy="66" r="1.8" />
      </g>
    </svg>
  );
}

/* Shown when a sign-in route that isn't built yet gets clicked, so the
   button leads somewhere instead of quietly doing nothing. */
function ComingSoon({ kind, onHaveCode, onBack }) {
  const body =
    kind === "google"
      ? "Continue with Google isn’t wired up yet — we’re still running the cable to it."
      : kind === "register"
        ? "New accounts aren’t open yet — the front desk is still going up."
        : "Email and password sign-in isn’t live yet — we’re still building that half of the door.";

  return (
    <div className="ja-pane ja-on ja-soon" role="status">
      <ConstructionArt />
      <span className="ja-label">Coming soon</span>
      <h2>Oops — under construction</h2>
      <p>{body}</p>

      {onHaveCode && (
        <button type="button" className="ja-submit" onClick={onHaveCode}>
          Sign in with your box code
        </button>
      )}

      <button type="button" className={onHaveCode ? "ja-soon-back" : "ja-submit"} onClick={onBack}>
        {onHaveCode ? "← Back to sign in" : "← Back"}
      </button>
    </div>
  );
}

export default function AuthPanel({ onHaveCode }) {
  const [pane, setPane] = useState("login");
  /* { kind, from } — `from` is the tab to return to when they back out. */
  const [soon, setSoon] = useState(null);

  const [lemail, setLemail] = useState("");
  const [lpass, setLpass] = useState("");
  const [loginShowPass, setLoginShowPass] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loginErrors, setLoginErrors] = useState({ lemail: false, lpass: false });
  const [loginBtn, setLoginBtn] = useState("idle"); // idle | loading

  const [name, setName] = useState("");
  const [remail, setRemail] = useState("");
  const [rpass, setRpass] = useState("");
  const [regShowPass, setRegShowPass] = useState(false);
  const [terms, setTerms] = useState(false);
  const [termsBad, setTermsBad] = useState(false);
  const [regErrors, setRegErrors] = useState({ name: false, remail: false, rpass: false });
  const [regBtn, setRegBtn] = useState("idle");

  const strength = passwordStrength(rpass);

  function showSoon(kind) {
    setSoon({ kind, from: pane });
    setPane("soon");
  }

  function closeSoon() {
    setPane(soon?.from ?? "login");
    setSoon(null);
  }

  function submitLogin(e) {
    e.preventDefault();
    const okEmail = emailOk(lemail);
    const okPass = lpass.length >= 8;
    setLoginErrors({ lemail: !okEmail, lpass: !okPass });
    if (okEmail && okPass) {
      /* The credentials go nowhere yet, so the spinner is only long enough
         to acknowledge the click before the coming-soon screen. */
      setLoginBtn("loading");
      setTimeout(() => {
        setLoginBtn("idle");
        showSoon("password");
      }, 700);
    }
  }

  function submitRegister(e) {
    e.preventDefault();
    const okName = name.trim().length > 1;
    const okEmail = emailOk(remail);
    const okPass = rpass.length >= 8;
    setRegErrors({ name: !okName, remail: !okEmail, rpass: !okPass });
    setTermsBad(!terms);
    if (okName && okEmail && okPass && terms) {
      setRegBtn("loading");
      setTimeout(() => {
        setRegBtn("idle");
        showSoon("register");
      }, 700);
    }
  }

  const loginLabel = loginBtn === "loading" ? "Signing in…" : "Sign in";
  const regLabel = regBtn === "loading" ? "Creating…" : "Create account";

  return (
    /* The green brand panel stays on the left and the form on the right
       for both tabs — switching tabs only swaps which form pane shows. */
    <div className="ja-root">
      {/* ---------------- left ---------------- */}
      <section className="ja-aside">
        <div className="ja-logo">
          Jong<b>Cham</b>
        </div>

        <div className="ja-pitch">
          <span className="ja-label">Paper cards, smarter practice</span>
          <h1>
            Your box of cards,
            <br />
            <em>now with a brain.</em>
          </h1>
          <p className="ja-intro">
            Every printed deck comes with an online twin — practise it, test yourself, and see what you
            actually remember.
          </p>

          <ul className="ja-feats">
            <li>
              <span className="ja-ic">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M1 4v6h6" />
                  <path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
                </svg>
              </span>{" "}
              Spaced review that remembers for you
            </li>
            <li>
              <span className="ja-ic">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 20h18" />
                  <path d="M6 20v-6M12 20V8M18 20v-9" />
                </svg>
              </span>{" "}
              Progress, streaks and exam scores
            </li>
            <li>
              <span className="ja-ic">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
              </span>{" "}
              Make your own cards, print the box
            </li>
          </ul>

          <div className="ja-stack">
            <div className="ja-c ja-back2" />
            <div className="ja-c ja-back1" />
            <div className="ja-c ja-front">
              <p className="ja-hz">学习</p>
              <p className="ja-py">xué xí</p>
              <p className="ja-en">to study, to learn</p>
            </div>
            <span className="ja-stamp">REMEMBER</span>
          </div>
        </div>

        <div className="ja-foot">
          <div className="ja-figs">
            <div>
              <b>96</b>cards a deck
            </div>
            <div>
              <b>4</b>units + exam
            </div>
            <div>
              <b>2,400</b>learners
            </div>
          </div>
          <span className="ja-copy">© 2026 JongCham · Phnom Penh</span>
        </div>
      </section>

      {/* ---------------- right ---------------- */}
      <main className="ja-main">
        <div className="ja-form">
          {pane !== "soon" && (
            <div className="ja-tabs">
              <button type="button" className={pane === "login" ? "ja-on" : ""} onClick={() => setPane("login")}>
                Sign in
              </button>
              <button type="button" className={pane === "register" ? "ja-on" : ""} onClick={() => setPane("register")}>
                Create account
              </button>
            </div>
          )}

          {/* This screen is a demo-only visual port with no code field, so
              it can't unlock a deck on its own — this is the way back to
              the real code/name/email sign-in. */}
          {onHaveCode && pane !== "soon" && (
            <p className="ja-swap" style={{ marginTop: 0, marginBottom: 24 }}>
              Bought a deck?{" "}
              <button type="button" onClick={onHaveCode}>
                Sign in with your box code
              </button>
            </p>
          )}

          {/* ============ LOGIN ============ */}
          <div className={`ja-pane ${pane === "login" ? "ja-on" : ""}`}>
            <div className="ja-head">
              <h2>Welcome back</h2>
              <p>Sign in to keep your streak going.</p>
            </div>

            <form onSubmit={submitLogin} noValidate>
              <div className={`ja-field ${loginErrors.lemail ? "ja-bad" : ""}`}>
                <label htmlFor="lemail">Email</label>
                <div className="ja-input">
                  <input
                    id="lemail"
                    type="email"
                    placeholder="ming@example.com"
                    autoComplete="email"
                    value={lemail}
                    onChange={(e) => {
                      setLemail(e.target.value);
                      setLoginErrors((s) => ({ ...s, lemail: false }));
                    }}
                  />
                </div>
                <div className="ja-msg">
                  <ErrorIcon />
                  <span>Enter a valid email address</span>
                </div>
              </div>

              <div className={`ja-field ${loginErrors.lpass ? "ja-bad" : ""}`}>
                <label htmlFor="lpass">
                  Password <a href="#forgot" className="ja-hintlink" onClick={(e) => e.preventDefault()}>Forgot?</a>
                </label>
                <div className="ja-input ja-has-btn">
                  <input
                    id="lpass"
                    type={loginShowPass ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={lpass}
                    onChange={(e) => {
                      setLpass(e.target.value);
                      setLoginErrors((s) => ({ ...s, lpass: false }));
                    }}
                  />
                  <button
                    className="ja-peek"
                    type="button"
                    aria-label={loginShowPass ? "Hide password" : "Show password"}
                    onClick={() => setLoginShowPass((v) => !v)}
                  >
                    {loginShowPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                <div className="ja-msg">
                  <ErrorIcon />
                  <span>Password must be at least 8 characters</span>
                </div>
              </div>

              <div className="ja-row">
                <label className="ja-check">
                  <input type="checkbox" checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.target.checked)} />
                  <span className="ja-box">
                    <CheckIcon />
                  </span>
                  Keep me signed in
                </label>
              </div>

              <button type="submit" className={`ja-submit ${loginBtn === "loading" ? "ja-loading" : ""}`} disabled={loginBtn === "loading"}>
                <span className="ja-spinner" />
                <span>{loginLabel}</span>
              </button>
            </form>

            <div className="ja-or">or</div>
            <button type="button" className="ja-alt" onClick={() => showSoon("google")}>
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="ja-swap">
              New to JongCham?{" "}
              <button type="button" onClick={() => setPane("register")}>
                Create an account
              </button>
            </p>
          </div>

          {/* ============ REGISTER ============ */}
          <div className={`ja-pane ${pane === "register" ? "ja-on" : ""}`}>
            <div className="ja-head">
              <h2>Create your account</h2>
              <p>Free. Your first deck takes one minute to set up.</p>
            </div>

            <form onSubmit={submitRegister} noValidate>
              <div className={`ja-field ${regErrors.name ? "ja-bad" : ""}`}>
                <label htmlFor="name">Full name</label>
                <div className="ja-input">
                  <input
                    id="name"
                    type="text"
                    placeholder="Ming Sokha"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setRegErrors((s) => ({ ...s, name: false }));
                    }}
                  />
                </div>
                <div className="ja-msg">
                  <ErrorIcon />
                  <span>Please enter your full name</span>
                </div>
              </div>

              <div className={`ja-field ${regErrors.remail ? "ja-bad" : ""}`}>
                <label htmlFor="remail">Email</label>
                <div className="ja-input">
                  <input
                    id="remail"
                    type="email"
                    placeholder="ming@example.com"
                    autoComplete="email"
                    value={remail}
                    onChange={(e) => {
                      setRemail(e.target.value);
                      setRegErrors((s) => ({ ...s, remail: false }));
                    }}
                  />
                </div>
                <div className="ja-msg">
                  <ErrorIcon />
                  <span>Enter a valid email address</span>
                </div>
              </div>

              <div className={`ja-field ${regErrors.rpass ? "ja-bad" : ""}`}>
                <label htmlFor="rpass">Password</label>
                <div className="ja-input ja-has-btn">
                  <input
                    id="rpass"
                    type={regShowPass ? "text" : "password"}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                    value={rpass}
                    onChange={(e) => {
                      setRpass(e.target.value);
                      setRegErrors((s) => ({ ...s, rpass: false }));
                    }}
                  />
                  <button
                    className="ja-peek"
                    type="button"
                    aria-label={regShowPass ? "Hide password" : "Show password"}
                    onClick={() => setRegShowPass((v) => !v)}
                  >
                    {regShowPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                <div className={`ja-strength ${rpass ? "ja-show" : ""}`}>
                  <div className="ja-bars">
                    {[0, 1, 2, 3].map((i) => (
                      <i key={i} style={{ background: i < strength ? STRENGTH_COLORS[strength - 1] : "#EBE6DB" }} />
                    ))}
                  </div>
                  <div className="ja-txt" style={{ color: strength ? STRENGTH_COLORS[strength - 1] : undefined }}>
                    {strength ? STRENGTH_WORDS[strength - 1] : ""}
                  </div>
                </div>

                <div className="ja-msg">
                  <ErrorIcon />
                  <span>Use 8 characters or more</span>
                </div>
              </div>

              <div className="ja-row">
                <label className="ja-check">
                  <input
                    type="checkbox"
                    checked={terms}
                    onChange={(e) => {
                      setTerms(e.target.checked);
                      setTermsBad(false);
                    }}
                  />
                  <span className="ja-box" style={termsBad ? { borderColor: "#A6485A" } : undefined}>
                    <CheckIcon />
                  </span>
                  <span>
                    I agree to the{" "}
                    <a href="#terms" onClick={(e) => e.preventDefault()}>
                      Terms
                    </a>{" "}
                    and{" "}
                    <a href="#privacy" onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
              </div>

              <button type="submit" className={`ja-submit ${regBtn === "loading" ? "ja-loading" : ""}`} disabled={regBtn === "loading"}>
                <span className="ja-spinner" />
                <span>{regLabel}</span>
              </button>
            </form>

            <div className="ja-or">or</div>
            <button type="button" className="ja-alt" onClick={() => showSoon("google")}>
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="ja-swap">
              Already have an account?{" "}
              <button type="button" onClick={() => setPane("login")}>
                Sign in
              </button>
            </p>
          </div>

          {/* ============ COMING SOON ============ */}
          {pane === "soon" && <ComingSoon kind={soon?.kind} onHaveCode={onHaveCode} onBack={closeSoon} />}
        </div>
      </main>
    </div>
  );
}
