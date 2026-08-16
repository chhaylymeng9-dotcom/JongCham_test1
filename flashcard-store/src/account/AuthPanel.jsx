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

export default function AuthPanel({ onHaveCode }) {
  const [pane, setPane] = useState("login");

  const [lemail, setLemail] = useState("");
  const [lpass, setLpass] = useState("");
  const [loginShowPass, setLoginShowPass] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [loginErrors, setLoginErrors] = useState({ lemail: false, lpass: false });
  const [loginBtn, setLoginBtn] = useState("idle"); // idle | loading | done

  const [name, setName] = useState("");
  const [remail, setRemail] = useState("");
  const [rpass, setRpass] = useState("");
  const [regShowPass, setRegShowPass] = useState(false);
  const [terms, setTerms] = useState(false);
  const [termsBad, setTermsBad] = useState(false);
  const [regErrors, setRegErrors] = useState({ name: false, remail: false, rpass: false });
  const [regBtn, setRegBtn] = useState("idle");

  const strength = passwordStrength(rpass);

  function submitLogin(e) {
    e.preventDefault();
    const okEmail = emailOk(lemail);
    const okPass = lpass.length >= 8;
    setLoginErrors({ lemail: !okEmail, lpass: !okPass });
    if (okEmail && okPass) {
      setLoginBtn("loading");
      setTimeout(() => setLoginBtn("done"), 1400);
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
      setTimeout(() => setRegBtn("done"), 1400);
    }
  }

  const loginLabel = loginBtn === "loading" ? "Signing in…" : loginBtn === "done" ? "Done ✓" : "Sign in";
  const regLabel = regBtn === "loading" ? "Creating…" : regBtn === "done" ? "Done ✓" : "Create account";

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
          <div className="ja-tabs">
            <button type="button" className={pane === "login" ? "ja-on" : ""} onClick={() => setPane("login")}>
              Sign in
            </button>
            <button type="button" className={pane === "register" ? "ja-on" : ""} onClick={() => setPane("register")}>
              Create account
            </button>
          </div>

          {/* This screen is a demo-only visual port with no code field, so
              it can't unlock a deck on its own — this is the way back to
              the real code/name/email sign-in. */}
          {onHaveCode && (
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
            <button type="button" className="ja-alt">
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
            <button type="button" className="ja-alt">
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
        </div>
      </main>
    </div>
  );
}
