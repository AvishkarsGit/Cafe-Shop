const { validationResult } = require("express-validator");
const User = require("../models/user.model.js");
const JWT = require("../utils/jwt.js");
require("dotenv").config();

class GlobalMiddleware {
  static isLoggedIn = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    try {
      // check if access token is not available
      if (!accessToken) {
        throw new Error("You have logged out");
      }

      const decoded = await JWT.jwtVerifyAccessToken(accessToken);

      // Find the user based on decoded token
      const user = await User.findById(decoded._id);

      // If user is not found, return an error
      if (!user) {
        throw new Error("User not found. Please log in again.");
      }

      req.user = user; // Assign full user object
      res.locals.currUser = user; // Store user data for EJS templates

      next();
    } catch (error) {
      if (req.xhr || req.headers.accept.indexOf("json") > -1) {
        return res
          .status(401)
          .json({ success: false, message: "You need to login first" });
      } else {
        req.flash("error", error.message);
        return res.redirect(`/home`);
      }
    }
  };

  static isEmailVerified = async (req, res, next) => {
    try {
      const id = req.user._id;

      const user = await User.findById({ _id: id });

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.email_verified) {
        throw new Error("You have to verify your email first");
      }

      req.user = user;

      next();
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/auth/verify");
    }
  };
  static isEmailNotVerified = async (req, res, next) => {
    try {
      const id = req.user._id;

      const user = await User.findById({ _id: id });

      if (!user) {
        throw new Error("User not found");
      }

      if (user.email_verified) {
        return res.redirect("/");
      }

      req.user = user;

      next();
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/auth/verify");
    }
  };

  static isLoggedOut = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      return res.redirect("/");
    }
    next();
  };

  static isAdmin = async (req, res, next) => {
    const id = req.user._id;
    const user = await User.findById({ _id: id });
    if (user.type !== "admin") {
      req.flash("error", "You are not an admin");
      return res.redirect("/");
    }
    next();
  };
  

  static isUserExist = async (req, res, next) => {
    const id = req.user._id;
    try {
      const user = await User.findById({ _id: id });

      //1) check if user exits

      if (!user) {
        //2) check if user not exists, but cookie are still exist in the browser

        const accessToken = req.cookies.accessToken;
        if (accessToken) {
          res.clearCookie("accessToken");
        }
        throw new Error("User doesn't exists ");
      }

      req.user = user._id;
      next();
    } catch (error) {
      req.flash("error", error.message);
      return res.redirect("/auth/login");
    }
  };

  static checkError = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    } else {
      next();
    }
  };
}

module.exports = GlobalMiddleware;
