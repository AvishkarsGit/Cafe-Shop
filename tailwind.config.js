/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/views/**/*.ejs"],
  theme: {
    extend: {
      screens: {
        xs: "400px", // Custom extra small screen
        sm: "640px", // Default Tailwind small screen
        md: "768px", // Default Tailwind medium screen
        lg: "1024px", // Default Tailwind large screen
        xl: "1280px", // Default Tailwind extra-large screen
        "2xl": "1536px", // Default Tailwind 2xl screen
        "4k": "2560px", // Custom ultra-wide screens
        smd: "920px", //custom screen
      },
    },
  },
  plugins: [],
};
