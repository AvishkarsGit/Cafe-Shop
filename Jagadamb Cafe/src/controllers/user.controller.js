const Utils = require("../utils/Utils");
const JWT = require("../utils/jwt");
const { User } = require("../models/user.model.js");
const NodeMailer = require("../utils/NodeMailer.js");

class UserController {
  static renderRegister = (req, res) => {
    res.render("users/signup.ejs");
  };
  static renderLogin = (req, res) => {
    res.render("users/login.ejs");
  };

  static register = async (req, res) => {
    try {
      // 1) get all the data

      let { name, email, password, confirmPassword } = req.body;

      // Check user is already exists
      const isExist = await User.findOne({ email });

      if (isExist) {
        return res.status(401).json({
          success: false,
          error: "User is already exists",
        });
      }

      // 2) Encrypt the password for saving into the database

      let hashedPass = await JWT.encryptPassword(password);

      let data = {
        name,
        email,
        password: hashedPass,
        confirmPassword,
        verification_token: Utils.generateVerificationOTP(),
        verification_token_time: Date.now() + Utils.MAX_TOKEN_TIME,
      };

      // save new user
      const user = await new User(data).save();

      // 3) Generate the jwt token
      const token = JWT.generateJwtToken({ id: user._id });

      // 4) Send the verification email to the users provided email id (additional)

      await NodeMailer.sendMail(
        email,
        "Signup email verification",
        `<h3>Your one time password is :${data.verification_token}</h3>`
      );

      res.cookie("wl_token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      req.user = user;
      res.redirect("/");
    } catch (error) {
      return res.status(400).json({
        success: false,
        msg: error.message,
      });
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // 1) Check if email and password exist.
      if (!email || !password) {
        return new ApiError("please provide email and password", 400);
      }
      // 2) Check if user exists and password is correct.

      const user = await User.findOne({ email });

      // compare the password
      let correct = await JWT.comparePassword(password, user.password);

      if (!user || !correct) {
        return new ApiError("incorrect email or password!", 401);
      }

      // 3) If everything is ok, then send token to the client.
      const token = JWT.generateJwtToken({ id: user._id });

      res.cookie("wl_token", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });

      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  };

  static logout = (req, res) => {
    res.cookie("wl_token", "", { maxAge: 1 });
    res.redirect("/");
  };
}

module.exports = UserController;
