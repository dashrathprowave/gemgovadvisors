/** @type {import('tailwindcss').Config} */

// Light-orange brand scale. `green` and `teal` are deliberately aliased to it so
// that the utility classes inherited from the original compiled template stylesheet
// (text-green-700, bg-green-50, focus:border-teal-800, ...) render in brand orange
// without every legacy class name having to be rewritten.
const brand = {
  50: "#FFF7ED",
  100: "#FFEDD8",
  200: "#FDD9B0",
  300: "#FBBF83",
  400: "#F9A253",
  500: "#F8862B",
  600: "#EE6C0F",
  700: "#C6540E",
  800: "#9C4413",
  900: "#7C3813",
  950: "#431C07",
};

module.exports = {
  darkMode: "class",
  // Preflight is already supplied by src/app/compiled-tailwind.css; emitting it a
  // second time would reset the template's own base styles.
  corePlugins: { preflight: false },
  content: ["./src/**/*.{js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand,
        green: brand,
        teal: brand,
        // The template stores these as comma-separated channel lists
        // ("248, 134, 43"), so they must be consumed with rgba(...) — the
        // rgb(... / alpha) space-separated form produces invalid CSS here.
        primary: "rgba(var(--bg-primary), <alpha-value>)",
        secondary: "rgba(var(--bg-secondary), <alpha-value>)",
        tertiary: "rgba(var(--bg-tertiary), <alpha-value>)",
        quaternary: "rgba(var(--bg-quaternary), <alpha-value>)",
        dark: "#24262b",
        darkIndigo: {
          50: "#EAEAEC",
          100: "#D4D3D9",
          300: "#ACAAB5",
          700: "#59556A",
          800: "#444058",
          900: "#2F2B45",
        },
        darkblue: { 900: "#09314D" },
      },
      fontFamily: {
        sans: ["Mulish", "Arial", "sans-serif"],
        heading: ["Poppins", "Arial", "sans-serif"],
      },
      borderWidth: { 1: "1px" },
      zIndex: { "-1": "-1" },
      keyframes: {
        bounceOnce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        bounceOnce: "bounceOnce 0.6s ease-in-out 1",
        fadeUp: "fadeUp 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
