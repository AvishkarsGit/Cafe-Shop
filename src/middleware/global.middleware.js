const User = require("../models/user.model.js");
const JWT = require("../utils/jwt.js");
require("dotenv").config();

class GlobalMiddleware {
  static isLoggedIn = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    try {
      // check if access token is available in the cookie
      if (!accessToken) {
        throw new Error("You session is expired");
      }

      const decoded = await JWT.jwtVerify(
        accessToken,
        process.env.JWT_ACCESS_SECRETE
      );

      req.user = decoded;
      next();
    } catch (error) {
      req.flash("message", error.message);
      res.redirect("/auth/login");
    }
  };

  static decodeRefreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    try {
      if (!refreshToken) {
        return res.status(403).json({
          message: "Access is forbidden!. User doesn't exists",
        });
      }

      const decoded = await JWT.jwtVerify(
        refreshToken,
        process.env.JWT_REFRESH_SECRETE
      );

      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({
        message:
          "Your session is expired or invalid user!.. Please login again",
        expired: true,
      });
    }
  };
}
module.exports = GlobalMiddleware;
