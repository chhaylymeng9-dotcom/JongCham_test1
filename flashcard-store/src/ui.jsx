/* ---------- UI primitives ----------
The shared vocabulary the whole store is built from. Nothing here knows
about flashcards — these are just buttons, panels, fields and labels
carrying the Index & Co. house style.
--------------------------------- */

export function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

/* ---------- button ---------- */

const BUTTON_VARIANTS = {
  /* solid black pill — the orange grease primary is retired site-wide */
  primary:
    "bg-ink text-paper border-ink hover:bg-ink/85 hover:border-ink/85 active:translate-y-px",
  /* quiet outline pill, same look as the "See what's included" button —
     the old chalk-green solid lost its colour site-wide */
  dark: "bg-transparent text-ink border-ink/25 hover:border-ink/50 hover:bg-ink/[0.03]",
  outline: "bg-transparent text-ink border-ink/25 hover:border-ink/50 hover:bg-ink/[0.03]",
  "outline-light":
    "bg-transparent text-cardstock border-cardstock/30 hover:border-cardstock/60 hover:bg-cardstock/10",
  ghost: "bg-transparent text-ink border-transparent hover:bg-ink/[0.05]",
  danger: "bg-transparent text-red-700 border-red-700/30 hover:bg-red-700/[0.06]",
};

const BUTTON_SIZES = {
  sm: "text-xs px-3.5 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-[15px] px-7 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  full = false,
  className,
  as: Tag = "button",
  ...props
}) {
  return (
    <Tag
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full border font-medium",
        "transition-colors duration-150 disabled:opacity-40 disabled:pointer-events-none",
        BUTTON_VARIANTS[variant],
        BUTTON_SIZES[size],
        full && "w-full",
        className
      )}
      {...props}
    />
  );
}

/* A quieter text button for "back" / "cancel" style actions. */
export function LinkButton({ className, ...props }) {
  return (
    <button
      className={cx(
        "text-sm underline underline-offset-4 decoration-ink/30",
        "opacity-60 hover:opacity-100 transition-opacity",
        className
      )}
      {...props}
    />
  );
}

/* ---------- surfaces ---------- */

export function Panel({ className, tone = "paper", children, ...props }) {
  const tones = {
    paper: "border-ink/15 bg-paper",
    cardstock: "border-ink/10 bg-cardstock/60",
    dark: "border-cardstock/20 bg-chalk-deep text-cardstock",
    accent: "border-grease/40 bg-grease/[0.06]",
  };
  return (
    <div className={cx("border rounded-card", tones[tone], className)} {...props}>
      {children}
    </div>
  );
}

export function Eyebrow({ children, className, tone = "ink" }) {
  return (
    <span
      className={cx("label block", tone === "ink" ? "text-ink/55" : "text-cardstock/60", className)}
    >
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, tone = "ink", sans = false, className }) {
  const dim = tone === "ink" ? "text-ink/70" : "text-cardstock/75";
  return (
    <div className={cx("max-w-2xl", className)}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      {/* sans: the bold modern sans the About page headings use, for
          sections that drop the typewriter display face */}
      <h2
        className={cx(
          "leading-tight mt-2.5",
          sans ? "font-sans font-bold tracking-tight text-3xl md:text-4xl" : "font-display text-2xl md:text-[2rem]"
        )}
      >
        {title}
      </h2>
      {subtitle && <p className={cx("text-[15px] leading-relaxed mt-3", dim)}>{subtitle}</p>}
    </div>
  );
}

export function Divider({ className }) {
  return <div className={cx("h-px bg-ink/10", className)} />;
}

/* ---------- data display ---------- */

export function Badge({ children, tone = "neutral", className }) {
  const tones = {
    neutral: "border-ink/20 text-ink/70",
    accent: "border-grease/50 text-grease-deep bg-grease/[0.07]",
    dark: "border-chalk/30 text-chalk bg-chalk/[0.07]",
    success: "border-chalk/40 text-chalk bg-chalk/[0.08]",
    light: "border-cardstock/30 text-cardstock/85",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs whitespace-nowrap",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Stat({ label, value, hint, className }) {
  return (
    <div className={cx("border border-ink/15 rounded-card px-4 py-3.5", className)}>
      <p className="label text-ink/45 mb-1.5">{label}</p>
      <p className="font-display text-lg leading-snug break-words">{value}</p>
      {hint && <p className="text-xs text-ink/50 mt-1">{hint}</p>}
    </div>
  );
}

export function KeyValue({ label, value, strong = false }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-1">
      <span className="label text-ink/45 shrink-0">{label}</span>
      <span
        className={cx(
          "text-right",
          strong ? "font-mono text-base" : "text-sm text-ink/85"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function ProgressBar({ value, tone = "chalk", className }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cx("h-1.5 w-full rounded-full bg-ink/10 overflow-hidden", className)}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cx(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          tone === "chalk" ? "bg-chalk" : "bg-grease"
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function Alert({ tone = "info", title, children, className }) {
  const tones = {
    info: "border-chalk/25 bg-chalk/[0.06] text-chalk-deep",
    success: "border-chalk/40 bg-chalk/[0.09] text-chalk-deep",
    warn: "border-grease/40 bg-grease/[0.07] text-grease-deep",
    error: "border-red-700/30 bg-red-700/[0.06] text-red-800",
  };
  return (
    <div className={cx("border rounded-card px-4 py-3.5 text-sm leading-relaxed", tones[tone], className)}>
      {title && <p className="font-medium mb-1">{title}</p>}
      {children}
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="border border-dashed border-ink/20 rounded-card px-6 py-12 text-center">
      {title && <p className="font-display text-xl mb-2">{title}</p>}
      {body && <p className="text-sm text-ink/60 max-w-sm mx-auto leading-relaxed">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ---------- form controls ---------- */

const INPUT_BASE =
  "w-full border border-ink/25 rounded-md bg-paper px-3 py-2.5 text-sm " +
  "placeholder:text-ink/35 transition-colors " +
  "hover:border-ink/40 focus:border-grease focus:outline-none focus:ring-2 focus:ring-grease/30";

export function Field({
  label,
  hint,
  error,
  required = false,
  children,
  className,
  ...inputProps
}) {
  return (
    <label className={cx("block", className)}>
      <span className="label text-ink/60 flex items-center gap-1.5">
        {label}
        {required && <span className="text-grease not-italic">*</span>}
      </span>
      <div className="mt-2">
        {children ?? <input className={cx(INPUT_BASE, error && "border-red-600")} {...inputProps} />}
      </div>
      {hint && !error && <span className="block text-xs text-ink/45 mt-1.5">{hint}</span>}
      {error && <span className="block text-xs text-red-700 mt-1.5">{error}</span>}
    </label>
  );
}

export function Input({ className, error, ...props }) {
  return <input className={cx(INPUT_BASE, error && "border-red-600", className)} {...props} />;
}

export function TextArea({ className, rows = 3, ...props }) {
  return <textarea rows={rows} className={cx(INPUT_BASE, "resize-y leading-relaxed", className)} {...props} />;
}

// Static map — Tailwind can't see class names built by string interpolation.
const GRID_COLS = { 2: "grid grid-cols-2 gap-2", 3: "grid grid-cols-3 gap-2" };

/* A row of mutually exclusive pill options — used all over the customizer. */
export function OptionRow({ label, options, value, onChange, tone = "ink", columns }) {
  const light = tone === "light";
  return (
    <div>
      <span className={cx("label block mb-2.5", light ? "text-cardstock/65" : "text-ink/60")}>
        {label}
      </span>
      <div className={GRID_COLS[columns] || "flex flex-wrap gap-2"}>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              aria-pressed={active}
              style={opt.style}
              className={cx(
                "border rounded-full px-3.5 py-1.5 text-sm transition-colors",
                active
                  ? "bg-ink border-ink text-paper"
                  : light
                  ? "border-cardstock/30 text-cardstock/85 hover:border-cardstock/60"
                  : "border-ink/25 text-ink/80 hover:border-ink/50"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Tabs({ tabs, value, onChange, className }) {
  return (
    <div
      role="tablist"
      className={cx("flex flex-wrap gap-2 border-b border-ink/10 pb-3", className)}
    >
      {tabs.map((tab) => {
        const active = value === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cx(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-chalk border-chalk text-cardstock"
                : "border-ink/20 text-ink/70 hover:border-ink/45"
            )}
          >
            {tab.label}
            {tab.badge != null && (
              <span className={cx("ml-2 font-mono text-[11px]", active ? "opacity-70" : "opacity-50")}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- misc ---------- */

export function Money({ value, className }) {
  return <span className={cx("font-mono tabular-nums", className)}>${value.toFixed(2)}</span>;
}

export function Spinner({ className }) {
  return (
    <span
      className={cx(
        "inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin",
        className
      )}
      aria-hidden="true"
    />
  );
}
