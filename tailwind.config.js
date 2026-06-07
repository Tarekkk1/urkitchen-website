import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0C382C",
          50: "#E6EFEC",
          100: "#BFD5CD",
          200: "#94B8AD",
          300: "#699B8D",
          400: "#3D7E6D",
          500: "#0C382C",
          600: "#0A3026",
          700: "#08281E",
          800: "#062018",
          900: "#041510",
        },
        accent: {
          DEFAULT: "#f1be49",
        },
        background: {
          footer: "#0C382C",
        },
        wallet: {
          recharge: {
            DEFAULT: "#EFF6FF",
            text: "#1E40AF",
            icon: "#2563EB",
          },
          withdraw: {
            DEFAULT: "#ECFDF5",
            text: "#064E3B",
            icon: "#10B981",
          },
        },
      },
    },
    fontFamily: {
      sans: ["Quicksand", "sans-serif"],
    },
    animation: {
      "spin-slow": "spin 3s linear infinite",
    },
  },
  darkMode: false,
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#0C382C",
              foreground: "#ffffff",
            },
          },
        },
      },
    }),
  ],
};
