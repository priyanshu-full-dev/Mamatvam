/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#e62a09",
          dark: "#c72306",
          light: "#FFF1EE",
        },
        coral: {
          50: "#FFF5F4",
          100: "#FCE2E2",
          200: "#F9C6C1",
          500: "#e62a09",
          600: "#E53935",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          muted: "#F8FAFC",
        },
        text: {
          DEFAULT: "#1E1E1E",
          muted: "#6B7280",
          light: "#9CA3AF",
        },
        peach: {
          100: "#FDE8D7",
        },
        mint: {
          100: "#DFF8D8",
        },
        sky: {
          100: "#D5ECFD",
        },
      },
    },
  },
  plugins: [],
};
