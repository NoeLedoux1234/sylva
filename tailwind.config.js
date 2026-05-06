/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0E0B",
          deep: "#050706",
          soft: "#11161A",
        },
        moss: {
          50: "#EFF5EE",
          100: "#D6E4D2",
          200: "#A9C3A1",
          300: "#7CA371",
          400: "#598253",
          500: "#3F6638",
          600: "#2C4A26",
          700: "#1E331A",
          800: "#142010",
          900: "#0B1309",
        },
        bark: {
          DEFAULT: "#3A2E22",
          light: "#6B5840",
        },
        bone: {
          DEFAULT: "#F2EFE7",
          dim: "#C5C2B7",
        },
      },
      fontFamily: {
        display: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        body: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "1.25rem",
      },
    },
  },
  plugins: [],
};
