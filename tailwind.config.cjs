/** @type {import('tailwindcss').Config} */

// Import your custom colors using require (valid in .cjs)
// Ensure the theme.ts file can be required (might need adjustment if it only uses ES modules)
// For now, let's define colors directly here if theme.ts require fails.

// const { colors: customColors } = require('./src/lib/constants/theme.ts');
// ^^^ If the above line causes issues because theme.ts is ESM only,
// define colors directly as a fallback:
const customColors = {
  primary: "#169976",
  secondary: "#1DCD9F",
  dark: "#222222",
  black: "#000000",
  white: "#FFFFFF",
};

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ...customColors, // Spread your custom colors here
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
