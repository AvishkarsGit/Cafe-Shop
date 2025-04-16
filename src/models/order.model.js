const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    tableIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports.Order = mongoose.model("Order", orderSchema);
