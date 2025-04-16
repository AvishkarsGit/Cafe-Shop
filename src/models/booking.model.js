const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    tableIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Table",
      },
    ],
    bookingCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports.Booking = mongoose.model("Booking", bookingSchema);
