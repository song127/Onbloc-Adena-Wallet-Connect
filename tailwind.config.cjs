// === tailwind.config.cjs ===
// Tailwind v3 표준 + 커스텀 컬러(require) 적용
const { COLORS } = require("./src/theme/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: COLORS,
      spinner: "#2C4BE2",
      fontSize: {
        header: "24px",
        cardTitle: "20px",
        body: "16px",
        input: "12px",
        button: "16px",
      },
      borderRadius: {
        card: "6px",
        button: "8px",
        input: "8px",
      },
      boxShadow: {
        toast: "0 2px 8px 0 rgba(0,0,0,0.12)",
        card: "0 1px 4px 0 rgba(44,75,226,0.08)",
      },
      spacing: {
        card: "32px",
        section: "24px",
        input: "8px",
        "t-card": "12px",
        "b-card": "12px",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },
      zIndex: {
        toast: "1000",
        modal: "1100",
      },
      opacity: {
        disabled: "0.5",
      },
      width: {
        spinner: "2.5rem", // 40px
      },
      height: {
        spinner: "2.5rem",
      },
      keyframes: {
        toastIn: {
          "0%": { opacity: "0", transform: "translateX(40px)", maxHeight: "0", marginBottom: "0" },
          "100%": { opacity: "1", transform: "translateX(0)", maxHeight: "120px", marginBottom: "0.5rem" },
        },
        toastOut: {
          "0%": { opacity: "1", transform: "translateX(0)", maxHeight: "120px", marginBottom: "0.5rem" },
          "100%": { opacity: "0", transform: "translateX(40px)", maxHeight: "0", marginBottom: "0" },
        },
        spinnerSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        toastIn: "toastIn 0.3s ease-out forwards",
        toastOut: "toastOut 0.45s ease-in forwards",
        spinnerSpin: "spinnerSpin 1s linear infinite",
      },
    },
  },
  plugins: [],
  safelist: [
    // Tailwind spacing scale keys
    ...[
      0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60,
      64, 72, 80, 96,
    ].flatMap((k) => [`mr-${k}`, `mb-${k}`]),
  ],
};
