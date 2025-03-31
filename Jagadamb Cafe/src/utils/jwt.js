const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class JWT {
  static encryptPassword = async (password) => {
    return await bcrypt.hash(password, 10);
  };

  static generateJwtToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "5d",
    });
  };

  static comparePassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
 
}

module.exports = JWT;
