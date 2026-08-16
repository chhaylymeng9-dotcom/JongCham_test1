import { useEffect, useState } from "react";
import { useI18n } from "../i18n.jsx";
import { Button, LinkButton, cx } from "../ui.jsx";

/* ---------- Certificate ----------
Printed alone via the .print-area rule in index.css. Everything is drawn
with borders and type rather than images so it stays sharp on paper.

Only one certificate on a page may carry .print-area at a time — two would
be positioned on top of each other in the print layout — so the list below
hands the class to whichever one is being printed.
--------------------------------- */

export default function Certificate({
  name,
  deckName,
  score,
  total,
  certId,
  date,
  printable = true,
  onPrintRequest,
}) {
  const { t } = useI18n();
  const issued = date ? new Date(date) : new Date();

  return (
    <div>
      <div className={cx(printable && "print-area", "bg-paper p-2 sm:p-3")}>
        <div className="border-[3px] border-chalk rounded-sm p-2">
          <div className="border border-manila relative px-6 sm:px-10 py-10 sm:py-14 text-center">
            {/* corner rules */}
            {[
              "top-3 left-3 border-t-2 border-l-2",
              "top-3 right-3 border-t-2 border-r-2",
              "bottom-3 left-3 border-b-2 border-l-2",
              "bottom-3 right-3 border-b-2 border-r-2",
            ].map((pos) => (
              <span key={pos} className={`absolute ${pos} w-4 h-4 border-chalk`} aria-hidden="true" />
            ))}

            <span className="label tracking-seal text-ink/55 text-[10px]">{t("cert.issuer")}</span>

            <h2 className="font-display text-3xl sm:text-[2.6rem] leading-tight mt-5 mb-1">
              {t("cert.title")}
            </h2>

            <div className="w-[72px] h-px bg-manila mx-auto my-6" />

            <p className="text-sm text-ink/65 mb-3">{t("cert.certifies")}</p>

            <p className="font-display text-2xl sm:text-3xl text-grease mb-4 break-words px-2">
              {name}
            </p>

            <p className="text-sm text-ink/75 leading-relaxed max-w-sm mx-auto mb-1">
              {t("cert.completed")}
            </p>
            <p className="font-mono text-lg mb-8">
              {deckName} {t("cert.deckSuffix")}
            </p>

            <div className="flex items-center justify-center gap-8 sm:gap-12 mb-9">
              <div className="text-center">
                <p className="label text-ink/45 text-[10px]">{t("common.score")}</p>
                <p className="text-lg mt-1 font-mono tabular-nums">
                  {score} / {total}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-chalk text-cardstock flex items-center justify-center font-display text-sm shrink-0">
                JJ
              </div>
              <div className="text-center">
                <p className="label text-ink/45 text-[10px]">{t("common.date")}</p>
                <p className="text-lg mt-1">{issued.toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex justify-center mb-3">
              <div className="text-center">
                <p className="font-display text-lg text-chalk">{t("brand.name")}</p>
                <div className="border-t border-ink/30 w-40 mt-1 pt-1">
                  <p className="label text-ink/45 text-[9px]">{t("cert.authority")}</p>
                </div>
              </div>
            </div>

            <p className="label text-ink/35 text-[9px] mt-5">
              {t("cert.id")} · {certId}
            </p>
          </div>
        </div>
      </div>

      <div className="print:hidden mt-5">
        <Button variant="dark" onClick={onPrintRequest ?? (() => window.print())}>
          {t("cert.saveAsPdf")}
        </Button>
        <p className="text-xs text-ink/45 mt-2.5">{t("cert.printHint")}</p>
      </div>
    </div>
  );
}

/* ---------- saved certificates tab ---------- */

export function CertificateList({ certificates, onDelete }) {
  const { t } = useI18n();
  // The first one is print-ready by default so Ctrl+P is never a blank page.
  const [printingId, setPrintingId] = useState(certificates[0]?.certId ?? null);
  const [printRequested, setPrintRequested] = useState(false);
  // Two-click confirm, same pattern as Profile.jsx's "Delete my account" —
  // deleting a certificate isn't reversible, so one stray click shouldn't do it.
  const [armedId, setArmedId] = useState(null);

  // Wait for the class to land on the right certificate before printing.
  useEffect(() => {
    if (!printRequested) return;
    setPrintRequested(false);
    window.print();
  }, [printRequested]);

  // Restyled to match the ported dashboard mockup's locked-certificate box
  // (Dashboard.jsx / dashboard.css, jd- prefixed classes). The earned-
  // certificate render below is untouched — it's a real printable
  // certificate, not something to downgrade to the mockup's placeholder.
  if (certificates.length === 0) {
    return (
      <div className="jd-cert">
        <div className="jd-seal">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h4>{t("cert.none")}</h4>
        <p>{t("cert.noneBody")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {certificates.map((c) => (
        <div key={c.certId}>
          <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
            <p className="label text-ink/45">
              {t("cert.earned", { date: new Date(c.date).toLocaleDateString() })}
            </p>
            {onDelete && (
              <LinkButton
                className="text-grease decoration-grease/40"
                onClick={() => {
                  if (armedId === c.certId) {
                    onDelete(c.certId);
                    setArmedId(null);
                  } else {
                    setArmedId(c.certId);
                  }
                }}
              >
                {armedId === c.certId ? "Click again to confirm" : "Delete certificate"}
              </LinkButton>
            )}
          </div>
          <Certificate
            name={c.name}
            deckName={c.deckName}
            score={c.score}
            total={c.total}
            certId={c.certId}
            date={c.date}
            printable={printingId === c.certId}
            onPrintRequest={() => {
              setPrintingId(c.certId);
              setPrintRequested(true);
            }}
          />
        </div>
      ))}
    </div>
  );
}
