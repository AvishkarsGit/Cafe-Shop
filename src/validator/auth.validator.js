const { body, query } = require("express-validator");
const Schema = require("../schema.js");
class AuthValidator {
  static validateSignup = (req, res) => {
    return [
      body("name", "Name is required").trim().isString(),
      body("email", "Email is required").trim().isString(),
      body("phone", "Phone number is required").trim().isString(),
      body("password", "Password is required")
        .trim()
        .isAlphanumeric()
        .isLength({ min: 8, max: 15 })
        .withMessage("Password must be between 8-15 characters"),
    ];
  };

  static validateLogin = (req, res, next) => {
    const { error, value } = Schema.loginSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      let errorMsg = {};
      error.details.forEach((err) => {
        errorMsg[err.context.key] = err.message;
      });
      return res.render("login.ejs", { error: errorMsg, data: req.body });
    }
    next();
  };

  static validateResetPasswordEmail = (req, res, next) => {
    const { error, value } = Schema.resetPasswordSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      let errorMsg = {};
      error.details.forEach((err) => {
        errorMsg[err.context.key] = err.message;
      });
      return res.status(400).json({ success: false, message: errorMsg });
    }
    next();
  };
}

module.exports = AuthValidator;
