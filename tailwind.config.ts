import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: "#96B591",
          light: "#B8CEB3",
          dark: "#6A9664",
        },
        blush: {
          DEFAULT: "#D4A5A5",
          light: "#E8C9C9",
          dark: "#B87878",
        },
        lavender: {
          DEFAULT: "#C5BDD8",
          light: "#DDD8EC",
          dark: "#9B90BC",
        },
        cream: {
          DEFAULT: "#F7F4EF",
          warm: "#EDE8E0",
          deep: "#E0D9CE",
        },
        warmgray: {
          DEFAULT: "#7D756E",
          light: "#A8A19B",
          dark: "#6B625B",
        },
        ink: "#4A3828",
        gold: {
          DEFAULT: "#C89540",
          light: "#DDB96A",
          dark: "#A67A2E",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 6vw, 5.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.2rem, 4vw, 3.75rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.6rem, 3vw, 2.5rem)", { lineHeight: "1.2" }],
      },
      spacing: {
        "section": "6rem",
        "section-sm": "3.5rem",
      },
      borderRadius: {
        "xl": "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      transitionTimingFunction: {
        "elegant": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
