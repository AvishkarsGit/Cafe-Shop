const { plugins } = require("./postcss.config");

module.exports = {
  content: ["./views/**/*.ejs"], // Adjust based on your ejs file location,
  theme: {
    extend: {},
  },
  plugins: [],
};
