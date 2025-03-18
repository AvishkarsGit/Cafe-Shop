const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    categoryImgUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports.Category = mongoose.model("categories", categorySchema);
