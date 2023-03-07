/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      serif: ["Roboto", "serif"],
    },
    extend: {
      colors: {
        primary: {
          100: "#fff",
          200: "#cfb39d",
          300: "#a68f7d",
          400: "#7e6b5d",
          500: "#56483e",
          600: "#313030",
          700: "#212121",
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require("@tailwindcss/forms")({
      strategy: 'class',
    }),
  ],
};
