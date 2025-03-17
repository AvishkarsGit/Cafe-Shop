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
    type: String, // Cloudinary URL
  },
  cloudinaryId: {
    type: String, // Cloudinary public_id
  },
});

module.exports = mongoose.model("product", productModel);
