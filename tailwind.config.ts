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
        // Brand teal — turunan dari #008199 (aksen utama).
        brand: {
          50: "#eefafd",
          100: "#d3f3f9",
          200: "#ace7f4",
          300: "#79d7ec",
          400: "#43c2de",
          500: "#17a9c8",
          600: "#008199",
          700: "#04697f",
          800: "#0a5466",
          900: "#0e4555",
        },
        // Gold sekunder — turunan dari #c9a96e.
        gold: {
          50: "#faf8f2",
          100: "#f4efe2",
          200: "#e9dfc8",
          300: "#dccfae",
          400: "#d1bb8f",
          500: "#c9a96e",
          600: "#b3914f",
          700: "#95763f",
          800: "#7a6037",
          900: "#655030",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -16px rgba(15, 23, 42, 0.25)",
        "card-hover":
          "0 1px 2px rgba(15, 23, 42, 0.06), 0 12px 28px -14px rgba(15, 23, 42, 0.28)",
        overlay: "0 24px 48px -12px rgba(15, 23, 42, 0.28)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
