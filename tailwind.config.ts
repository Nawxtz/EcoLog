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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#4d6152",
        "on-primary": "#ffffff",
        "primary-container": "#c5dbc8",
        surface: "#ffffff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f8f9fa",
        "surface-container": "#f1f3f4",
        "surface-container-high": "#e8eaed",
        "on-surface": "#202124",
        "on-surface-variant": "#5f6368",
        outline: "#dadce0",
        "outline-variant": "#e8eaed",
        error: "#d93025",
        "error-container": "#fce8e6",
      },
    },
  },
  plugins: [],
};
export default config;