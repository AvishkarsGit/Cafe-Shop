const JWT = require("../utils/jwt.js");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError.js");
const { User } = require("../models/user.model.js");
class AuthMiddleware {
  static isLoggedIn = async (req, res, next) => {
    const token = req.cookies.wl_token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
          console.log(err);
          res.redirect("/user/login");
        } else {
          next();
        }
      });
    } else {
      res.redirect("/user/login");
    }
  };

  // check current user
  static checkUser = (req, res, next) => {
    const token = req.cookies.wl_token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.log(err.message);
          res.locals.user = null;
        } else {

          let user = await User.findById(decoded.id);
          res.locals.user = user;
        }
        next();
      });
    } else {
      res.locals.user = null;
      next();
    }
  };
}

module.exports = { AuthMiddleware };
