import { useI18n } from "../i18n.jsx";
import Reveal from "./Reveal.jsx";
import "./whatYouGet.css";

/* ---------- WhatYouGetSection ----------
Ported from the supplied "What you get" mockup: four cards, each with a
little looping art piece on top — a flipping flashcard with stock
swatches, a phone scanning a KHQR code, lessons unlocking one by one,
and a certificate ring that fills and stamps itself — strung along a
slow-marching dashed "journey" line, with a facts + shipping strip
underneath to fill the dead space. All styling lives scoped in
whatYouGet.css. The mockup's one-shot IntersectionObserver reveal was
swapped for the site's Reveal component so the cards stagger in (and
ease back out) exactly like every other section on the page.
--------------------------------- */

/* The fake QR mosaic on the payment card — 6×6, 1 = dark module. Built
   straight into the JSX instead of the mockup's innerHTML script. */
const QR_PATTERN = [
  1, 1, 1, 0, 1, 1,
  1, 0, 1, 1, 0, 1,
  1, 1, 0, 0, 1, 1,
  0, 1, 1, 1, 0, 0,
  1, 0, 1, 0, 1, 1,
  1, 1, 0, 1, 1, 0,
];

/* Tiny white tick inside each lesson's lock square — the lock "fills"
   green behind it on the unlock animation. */
function LockCheck() {
  return (
    <svg width="7" height="7" viewBox="0 0 8 8" aria-hidden="true">
      <path d="M1 4l2 2 4-4" stroke="#fff" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function WhatYouGetSection() {
  const { t } = useI18n();

  return (
    <section className="wg-root">
      <div className="wg-wrap">
        <div className="wg-blob wg-a" />
        <div className="wg-blob wg-b" />

        <Reveal>
          <div className="wg-eyebrow">{t("value.eyebrow")}</div>
          <h2>{t("value.title")}</h2>
          <p className="wg-sub">{t("value.sub")}</p>
        </Reveal>

        <div className="wg-deck">
          {/* dashed journey line wandering behind the four cards */}
          <div className="wg-journey" aria-hidden="true">
            <svg viewBox="0 0 1000 40" preserveAspectRatio="none">
              <path d="M0,20 C120,-6 200,46 320,20 C440,-6 520,46 640,20 C760,-6 840,46 1000,20" />
            </svg>
          </div>

          <div className="wg-cards">
            {/* ---- 01: design ---- */}
            <Reveal delay={0}>
              <article className="wg-card">
                <div className="wg-num">01</div>
                <div className="wg-stage">
                  <div className="wg-flip">
                    <div className="wg-flip-in">
                      <div className="wg-face">
                        <div className="wg-ln wg-m" />
                        <div className="wg-ln wg-s" />
                        <div className="wg-ln" style={{ width: "70%" }} />
                      </div>
                      <div className="wg-face wg-back">
                        <div className="wg-ln wg-m" />
                        <div className="wg-ln wg-s" />
                        <div className="wg-ln" style={{ width: "45%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="wg-swatches">
                    <span className="wg-sw" style={{ background: "#FDFCF9" }} />
                    <span className="wg-sw wg-on" style={{ background: "#E9C46A" }} />
                    <span className="wg-sw" style={{ background: "#7FA8D9" }} />
                    <span className="wg-sw" style={{ background: "#16130F" }} />
                  </div>
                </div>
                <h3>{t("value.1.title")}</h3>
                <p>{t("value.1.body")}</p>
                <div className="wg-tagrow">
                  <span className="wg-tag">{t("value.1.tag1")}</span>
                  <span className="wg-tag">{t("value.1.tag2")}</span>
                </div>
              </article>
            </Reveal>

            {/* ---- 02: payment ---- */}
            <Reveal delay={0.11}>
              <article className="wg-card">
                <div className="wg-num">02</div>
                <div className="wg-stage">
                  <div className="wg-phone">
                    <div className="wg-qr">
                      {QR_PATTERN.map((v, i) => (
                        <i key={i} className={v ? undefined : "wg-off"} />
                      ))}
                    </div>
                    <div className="wg-scan" />
                  </div>
                  <div className="wg-paychips">
                    <span className="wg-chip">KHQR</span>
                    <span className="wg-chip">VISA</span>
                    <span className="wg-chip">MC</span>
                  </div>
                </div>
                <h3>{t("value.2.title")}</h3>
                <p>{t("value.2.body")}</p>
                <div className="wg-tagrow">
                  <span className="wg-tag">{t("value.2.tag1")}</span>
                </div>
              </article>
            </Reveal>

            {/* ---- 03: lessons ---- */}
            <Reveal delay={0.22}>
              <article className="wg-card">
                <div className="wg-num">03</div>
                <div className="wg-stage">
                  <div className="wg-lessons">
                    <div className="wg-lesson">
                      <span className="wg-lock">
                        <LockCheck />
                      </span>
                      <span className="wg-lbar" />
                    </div>
                    <div className="wg-lesson">
                      <span className="wg-lock">
                        <LockCheck />
                      </span>
                      <span className="wg-lbar wg-s" />
                    </div>
                    <div className="wg-lesson">
                      <span className="wg-lock">
                        <LockCheck />
                      </span>
                      <span className="wg-lbar" />
                    </div>
                  </div>
                </div>
                <h3>{t("value.3.title")}</h3>
                <p>{t("value.3.body")}</p>
                <div className="wg-tagrow">
                  <span className="wg-tag">{t("value.3.tag1")}</span>
                </div>
              </article>
            </Reveal>

            {/* ---- 04: certify ---- */}
            <Reveal delay={0.33}>
              <article className="wg-card">
                <div className="wg-num">04</div>
                <div className="wg-stage">
                  <div className="wg-certwrap">
                    <span className="wg-spark" />
                    <span className="wg-spark" />
                    <span className="wg-spark" />
                    <svg className="wg-ring" width="88" height="88" viewBox="0 0 88 88" aria-hidden="true">
                      <circle className="wg-bg" cx="44" cy="44" r="32" />
                      <circle className="wg-fg" cx="44" cy="44" r="32" />
                    </svg>
                    <span className="wg-seal">
                      <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 8l4 4 8-8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </div>
                <h3>{t("value.4.title")}</h3>
                <p>{t("value.4.body")}</p>
                <div className="wg-tagrow">
                  <span className="wg-tag">{t("value.4.tag1")}</span>
                  <span className="wg-tag">{t("value.4.tag2")}</span>
                </div>
              </article>
            </Reveal>
          </div>
        </div>

        {/* ---- facts + shipping strip ---- */}
        <Reveal delay={0.2}>
          <div className="wg-strip">
            <div className="wg-facts">
              <div className="wg-fact">
                <b>52</b>
                <span>{t("value.fact1")}</span>
              </div>
              <div className="wg-fact">
                <b>4</b>
                <span>{t("value.fact2")}</span>
              </div>
              <div className="wg-fact">
                <b>{t("value.fact3num")}</b>
                <span>{t("value.fact3")}</span>
              </div>
            </div>
            <div className="wg-ship">
              <span className="wg-truck">
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M1 4h9v8H1zM10 7h4l3 3v2h-7z" stroke="#8A7A5E" strokeWidth="1.3" strokeLinejoin="round" />
                  <circle cx="5" cy="14" r="1.6" stroke="#8A7A5E" strokeWidth="1.3" />
                  <circle cx="13.5" cy="14" r="1.6" stroke="#8A7A5E" strokeWidth="1.3" />
                </svg>
              </span>
              {t("value.ship")}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
