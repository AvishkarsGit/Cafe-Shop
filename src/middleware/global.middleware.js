const { User } = require("../models/user.model");
const JWT = require("../utils/jwt");
require("dotenv").config();

class GlobalMiddleware {
  static isLoggedIn = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    try {
      // check if access token is available in the cookie
      if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = await JWT.jwtVerify(
        accessToken,
        process.env.JWT_ACCESS_SECRETE
      );
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token Expired!", expired: true });
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
      });
    }
  };
}
module.exports = GlobalMiddleware;
