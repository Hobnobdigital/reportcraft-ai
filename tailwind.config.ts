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
        sans: ['"Geist"', '"Helvetica Neue"', "Helvetica", "Arial", "sans-serif"],
        mono: ['"Geist Mono"', '"SF Mono"', '"Fira Code"', "monospace"],
      },
      fontSize: {
        hero: "clamp(3rem, 5vw, 4.5rem)",
        h1: "clamp(2rem, 3.5vw, 3rem)",
        h2: "clamp(1.5rem, 2.5vw, 2rem)",
        h3: "1.25rem",
        body: "1rem",
        "body-sm": "0.875rem",
        caption: "0.75rem",
        overline: "0.6875rem",
      },
      colors: {
        stripe: {
          primary: "#635BFF",
          "primary-hover": "#5851EA",
          dark: "#0A2540",
          "light-bg": "#F6F9FC",
          cyan: "#00D4AA",
          blue: "#0073E6",
          amber: "#FFBB00",
          red: "#DF1B41",
          green: "#0E6245",
        },
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          elevated: "var(--bg-elevated)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          inverse: "var(--text-inverse)",
        },
        border: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
          focus: "var(--border-focus)",
        },
        accent: {
          primary: "var(--accent-primary)",
          "primary-hover": "var(--accent-primary-hover)",
          "primary-subtle": "var(--accent-primary-subtle)",
        },
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "24px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(10, 37, 64, 0.04)",
        sm: "0 2px 4px rgba(10, 37, 64, 0.06), 0 1px 2px rgba(10, 37, 64, 0.04)",
        md: "0 4px 8px rgba(10, 37, 64, 0.08), 0 2px 4px rgba(10, 37, 64, 0.04)",
        lg: "0 8px 16px rgba(10, 37, 64, 0.08), 0 4px 8px rgba(10, 37, 64, 0.04)",
        xl: "0 16px 32px rgba(10, 37, 64, 0.10), 0 8px 16px rgba(10, 37, 64, 0.06)",
      },
      maxWidth: {
        content: "1280px",
        text: "680px",
        wide: "1440px",
      },
      spacing: {
        "section-y": "clamp(4rem, 8vw, 8rem)",
        "section-x": "clamp(1.5rem, 4vw, 4rem)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        scaleIn: "scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        slideInRight: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer: "shimmer 1.5s ease infinite",
      },
      transitionTimingFunction: {
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-out-custom": "cubic-bezier(0.65, 0, 0.35, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
