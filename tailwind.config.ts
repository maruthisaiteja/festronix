import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          deep: "#06080C",
          page: "#0B0E14",
          card: "#10141E",
          raised: "#161C2A",
          border: "rgba(255, 255, 255, 0.08)",
          text: "#EEF0F5",
          secondary: "#A3A9B8",
          muted: "#7A8296",
        },
        fest: {
          cyan: "#12A4C4",
          "cyan-bright": "#22D3EE",
          "cyan-glow": "rgba(18, 164, 196, 0.25)",
          violet: "#5145CD",
          "violet-bright": "#6366F1",
          "violet-glow": "rgba(81, 69, 205, 0.3)",
          mint: "#10B981",
          "mint-bright": "#00FF9D",
          "mint-glow": "rgba(16, 185, 129, 0.25)",
          coral: "#F43F5E",
          "coral-bright": "#FB7185",
          "coral-glow": "rgba(244, 63, 94, 0.25)",
          amber: "#F59E0B",
          "amber-bright": "#FBBF24",
        },
        accent: {
          DEFAULT: "#12A4C4",
          hover: "#0F8EA8",
          tint: "rgba(18, 164, 196, 0.12)",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
        display: ["'Syne'", "var(--font-syne)", "sans-serif"],
        marker: ["'Permanent Marker'", "var(--font-syne)", "cursive", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
        card: "14px",
        panel: "18px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
