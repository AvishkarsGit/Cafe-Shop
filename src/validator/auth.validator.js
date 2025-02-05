const Schema = require("../schema");

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
      return res.render("signup.ejs", { error: errorMsg, data: req.body });
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
}

module.exports = AuthValidator;
