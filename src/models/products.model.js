const mongoose = require("mongoose");

const productModel = mongoose.Schema({
  ProductName: {
    type: String,
    required: true,
  },
  ProductPrice: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  },
  imgUrl: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("product", productModel);
