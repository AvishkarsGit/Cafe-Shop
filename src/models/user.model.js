const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "user",
    },
    verification_token: {
      type: String,
      required: true,
    },
    verification_token_time: {
      type: Date,
      required: true,
    },
    reset_password_verification_token: {
      type: String,
    },
    reset_password_verification_token_time: {
      type: Date,
    },
    email_verified: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
