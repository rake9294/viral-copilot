import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        background: "#0E0E0E",
        surface: "#1A1919",
        "surface-elevated": "#242323",
        "surface-violet": "#190B30",
        foreground: "#FFFFFF",
        "foreground-inverse": "#0E0E0E",
        muted: "#D1D1D1",
        subtle: "#94949D",
        border: "#343238",
        "border-soft": "#2A282D",
        primary: "#FC69FF",
        "primary-strong": "#FF4CE2",
        secondary: "#8217C3",
        tertiary: "#3E30D8",
        cobalt: "#2455E6",
        success: "#32D583",
        warning: "#F5B942",
        danger: "#F97066",
        info: "#4B73FF",
        tiktok: "#25F4EE",
        meta: "#4B73FF",
      },
      borderRadius: {
        xs: "6px",
        sm: "10px",
        md: "14px",
        lg: "20px",
        xl: "32px",
        pill: "9999px",
      },
      spacing: {
        "1": "4px",
        "2": "8px",
        "3": "12px",
        "4": "16px",
        "5": "20px",
        "6": "24px",
        "8": "32px",
        "10": "40px",
        "12": "48px",
        "16": "64px",
        "20": "80px",
      },
      boxShadow: {
        "card-rest": "0 1px 0 rgba(255,255,255,.04) inset",
        "card-hover":
          "0 1px 0 rgba(255,255,255,.08) inset, 0 18px 44px rgba(0,0,0,.28)",
        popover: "0 18px 60px rgba(0,0,0,.55)",
        modal: "0 32px 96px rgba(0,0,0,.72)",
        "ring-focus": "0 0 0 3px rgba(252,105,255,.32)",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(.4, 0, .2, 1)",
        enter: "cubic-bezier(.2, .6, .2, 1)",
        emphasized: "cubic-bezier(.22, 1, .36, 1)",
      },
      animation: {
        "radar-reveal": "radar-reveal 1s cubic-bezier(.2, .6, .2, 1) forwards",
        "signal-sweep":
          "signal-sweep 1.4s cubic-bezier(.22, 1, .36, 1) forwards",
        "ambient-glow":
          "ambient-glow 10s ease-in-out infinite",
      },
      keyframes: {
        "radar-reveal": {
          from: { opacity: "0", filter: "blur(14px)", transform: "translateY(14px)" },
          to: { opacity: "1", filter: "blur(0)", transform: "translateY(0)" },
        },
        "signal-sweep": {
          from: { transform: "translateX(-110%)", opacity: "0" },
          "15%": { opacity: "1" },
          "85%": { opacity: "1" },
          to: { transform: "translateX(110%)", opacity: "0" },
        },
        "ambient-glow": {
          "0%, 100%": { opacity: "0.72", transform: "scale(1)" },
          "50%": { opacity: "0.9", transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;