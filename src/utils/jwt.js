const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

class JWT {
  static encryptPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };

  static generateOTP = () => {
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  };

  static generateAccessToken = (payload, expires) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRETE, {
      expiresIn: expires,
    });
  };

  static generateRefreshToken = (payload, expires) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRETE, {
      expiresIn: expires,
    });
  };

  static MAX_TOKEN_TIME = 60 * 1000;

  static jwtVerify = (accessToken, secret) => {
    return new Promise((resolve, reject) => {
      jwt.verify(accessToken, secret, function (err, decoded) {
        if (err) {
          reject(err);
        } else if (!decoded) {
          reject("user is not authorized");
        } else {
          resolve(decoded);
        }
      });
    });
  };

  static comparePassword = async (password, encryptedPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, encryptedPassword, function (err, same) {
        if (err) {
          reject(err);
        } else if (!same) {
          reject(new Error("invalid credentials"));
        } else {
          resolve(true);
        }
      });
    });
  };
}

module.exports = JWT;
