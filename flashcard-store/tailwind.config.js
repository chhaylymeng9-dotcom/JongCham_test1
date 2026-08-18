/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7FAF8",
        cardstock: "#F1E9D2",
        manila: "#D9C08C",
        chalk: "#2F4538",
        "chalk-deep": "#233529",
        moss: "#6F7F63",
        grease: "#D65F42",
        "grease-deep": "#B94A30",
        ink: "#23201B",
      },
      fontFamily: {
        // Khmer faces sit in every stack so mixed-script text falls back
        // per-glyph — no language-conditional CSS needed.
        display: ["'Special Elite'", "'Noto Serif Khmer'", "Georgia", "serif"],
        sans: ["'IBM Plex Sans'", "'Noto Sans Khmer'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "'Noto Sans Khmer'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        label: "0.18em",
        seal: "0.3em",
      },
      boxShadow: {
        // The stacked offset reads as a physical card resting on the page.
        card: "0 6px 0 rgba(35,32,27,0.10), 0 14px 26px -14px rgba(35,32,27,0.40)",
        "card-lift": "0 10px 0 rgba(35,32,27,0.12), 0 22px 34px -16px rgba(35,32,27,0.45)",
        panel: "0 1px 2px rgba(35,32,27,0.04), 0 10px 28px -20px rgba(35,32,27,0.5)",
      },
      borderRadius: {
        card: "10px",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "none" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(.96)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        "fade-up": "fade-up .45s cubic-bezier(.2,.7,.3,1) both",
        "fade-in": "fade-in .3s ease both",
        "scale-in": "scale-in .25s cubic-bezier(.2,.7,.3,1) both",
      },
    },
  },
  plugins: [],
};
