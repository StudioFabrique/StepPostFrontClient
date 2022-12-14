/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    colors: {
      blue: "#140a82",
      stone: {
        100: "#f5f5f4",
        200: "#e7e5e4",
        300: "#d6d3d1",
        400: "#a8a29e",
        500: "#78716c",
      },
      orange: "#FF5E1A",
      black: "#000000",
      red: "red",
      white: "white",
      blue_grey: "#6d699a",
    },
  },
  plugins: [],
};
