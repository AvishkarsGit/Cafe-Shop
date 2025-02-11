const Schema = require("../schema.js");
class AuthValidator {
  static validateSignup = (req, res, next) => {
    const { error, value } = Schema.userSchema.validate(req.body, {
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
