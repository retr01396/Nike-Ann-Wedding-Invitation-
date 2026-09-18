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
        burgundy: {
          950: "#0d0204",
          900: "#180306",
          850: "#220509",
          800: "#2c080d",
          700: "#3d0b13",
          600: "#500e19",
          500: "#681422",
        },
        wine: {
          900: "#1d0509",
          800: "#2d080e",
          700: "#440c16",
          600: "#5a111e",
          500: "#751829",
        },
        gold: {
          50: "#fdfbf5",
          100: "#f9f4e5",
          200: "#f3e7c6",
          300: "#e8d39c",
          400: "#dcbe73",
          500: "#caa24d",
          600: "#b3893c",
          700: "#916b2e",
          800: "#745427",
          900: "#5f4422",
          foil: "#e5c57b",
          highlight: "#fff3d1",
          antique: "#a8853a",
          dark: "#68501f",
        },
        velvet: {
          noir: "#090103",
          deep: "#140306",
          surface: "#1f050a",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "Cambria", "serif"],
        display: ["var(--font-playfair)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "-apple-system", "sans-serif"],
        cinzel: ["var(--font-cinzel)", "Cinzel", "serif"],
        script: ["var(--font-pinyon)", "Pinyon Script", "cursive"],
      },
      boxShadow: {
        envelope: "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 10px 25px -5px rgba(26, 3, 7, 0.8)",
        card: "0 20px 50px -10px rgba(0, 0, 0, 0.95), 0 0 30px rgba(212, 175, 55, 0.12)",
        seal: "0 6px 16px rgba(0, 0, 0, 0.7), inset 0 1px 2px rgba(255, 240, 200, 0.4), inset 0 -2px 4px rgba(60, 20, 0, 0.6)",
        goldGlow: "0 0 25px rgba(212, 175, 55, 0.35)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #fcedc5 0%, #d8b257 35%, #ad852c 70%, #f4e3b5 100%)",
        "gold-foil": "linear-gradient(110deg, #bfa054 0%, #f7e6b5 30%, #d1ab4e 55%, #8f6c24 85%, #f1dc9f 100%)",
        "velvet-vignette": "radial-gradient(circle at center, rgba(44, 8, 13, 0.5) 0%, rgba(9, 1, 3, 0.95) 85%)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.85", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.03)" },
        },
      },
      animation: {
        shimmer: "shimmer 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
