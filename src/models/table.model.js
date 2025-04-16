const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
  },
  tableCode: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    required: true,
  },
});
module.exports.Table = mongoose.model("Table", tableSchema);
