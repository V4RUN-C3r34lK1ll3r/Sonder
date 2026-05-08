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
        canvas: "#F8F5F1",        // warm ivory page background
        surface: "#EDE8E0",       // slightly deeper ivory for cards
        border: "#D6CFC5",        // warm light border
        ivory: "#1A1614",         // near-black for body text
        muted: "#9A8E84",         // warm medium gray
        gold: "#D4682A",          // vibrant sunset orange
        "gold-light": "#E8843E",  // lighter orange hover
        teal: "#1F8C74",          // vibrant cactus teal
        "teal-light": "#3AAA8C",  // lighter teal hover
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        crossfade: "crossfade 8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        crossfade: {
          "0%, 45%": { opacity: "1" },
          "55%, 100%": { opacity: "0" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
