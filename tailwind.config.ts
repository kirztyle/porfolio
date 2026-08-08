import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        panel: "var(--panel)",
        panel2: "var(--panel-2)",
        hairline: "var(--hairline)",
        hairlineSoft: "var(--hairline-soft)",
        primary: "var(--text-primary)",
        muted: "var(--text-muted)",
        dim: "var(--text-dim)",
        teal: "var(--accent-teal)",
        amber: "var(--accent-amber)",
        red: "var(--accent-red)",
        green: "var(--accent-green)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
    },
  },
  plugins: [],
};
export default config;


