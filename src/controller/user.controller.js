const User = require("../models/user.model.js");
const JWT = require("../utils/jwt.js");
const NodeMailer = require("../utils/NodeMailer.js");
require("dotenv").config();

const Redis = require("../utils/Redis.js");

class UserController {
  static getRegister = (req, res) => {
    res.render("signup.ejs");
  };

  static postRegister = async (req, res) => {
    let { name, email, password, phone } = req.body;

    try {
      // 1) check if user is already exists
      const user = await User.findOne({ email });

      if (user) {
        throw new Error("user already exists");
      }

      // 2) encrypt password
      const hashedPassword = await JWT.encryptPassword(password);
      let verification_token = JWT.generateOTP();

      const data = {
        name,
        email,
        password: hashedPassword,
        phone,
        verification_token,
        verification_token_time: Date.now() + JWT.MAX_TOKEN_TIME,
        email_verified: false,
      };

      const newUser = await new User(data).save();

      //payload
      const accessToken = JWT.generateAccessToken(
        { _id: newUser.id },
        process.env.JWT_ACCESS_EXPIRES
      );

      //cookie options

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: parseInt(process.env.JWT_ACCESS_COOKIE_EXPIRES),
      });

      //user registered successfully

      // send verification email
      const doctype_html = `<h4>Hi ${name},your email verification otp : ${verification_token}`;

      await NodeMailer.sendingMail(email, "Email Verification", doctype_html);

      return res.status(200).json({
        success: true,
        message:
          "Your account create successfully,, please check your mail to verify",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getLogin = (req, res) => {
    res.render("login", { message: req.flash() });
  };

  static getHome = (req, res) => {
    res.render("home.ejs");
  };

  static getVerificationScreen = (req, res) => {
    res.render("verify.ejs");
  };

  static verifyEmail = async (req, res) => {
    try {
      let verification_token = req.body.verification_token;

      const user = await User.findOne({
        verification_token,
        verification_token_time: { $gt: Date.now() },
      });

      // 1)check if entered otp is correct or expired
      if (!user) {
        throw new Error("Entered otp is wrong or expired");
      }

      // All are good, then update into database
      const updatedUser = await User.findByIdAndUpdate(
        {
          _id: user.id,
        },
        {
          $set: {
            email_verified: true,
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json({
        success: true,
        message: "Your email has been verified",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static resendEmail = async (req, res) => {
    const id = req.user._id;

    let user = await User.findById({ _id: id });

    console.log(user);

    const email = user.email;
    const verification_token = JWT.generateOTP();

    try {
      const newUser = await User.findOneAndUpdate(
        {
          email,
        },
        {
          updatedAt: new Date(),
          verification_token,
          verification_token_time: Date.now() + JWT.MAX_TOKEN_TIME,
        },
        {
          new: true,
        }
      );

      if (newUser) {
        const doctype_html = `<h4>Hi ${user.name},your resend email verification otp : ${verification_token}`;
        await NodeMailer.sendingMail(email, "Email Verification", doctype_html);

        return res.json({
          success: true,
          message: "Email has been sent successfully",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    try {
      // 1) check user is present with that email
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(409).json({
          message: "User doesn't  exists",
        });
      }

      // 2) compare password
      const passwordMatch = await JWT.comparePassword(password, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Incorrect email or password" });
      }

      // 3) sign the accessToken & refreshToken
      const accessToken = JWT.generateAccessToken(
        { _id: user._id },
        process.env.JWT_ACCESS_EXPIRES
      );

      return res
        .status(200)
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",

          maxAge: parseInt(process.env.JWT_ACCESS_COOKIE_EXPIRES),
        })
        .json({
          success: true,
          message: "Logged in successfully",
        });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static logout = async (req, res) => {
    const decoded_data = req.user;
    try {
      if (decoded_data) {
        res.clearCookie("accessToken");
        return res.status(200).json({
          success: true,
          message: "You have logged out",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getForgotPassword = (req, res) => {
    res.render("reset_password.ejs", { email: req.email });
  };
}

module.exports = UserController;
