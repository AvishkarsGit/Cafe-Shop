const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("categories", categorySchema);
module.exports = Category;
