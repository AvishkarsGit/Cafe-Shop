const User = require("../models/user.model.js");
const JWT = require("../utils/jwt.js");
const NodeMailer = require("../utils/NodeMailer.js");
require("dotenv").config();

const Redis = require("../utils/Redis.js");

class UserController {
  static getRegister = (req, res) => {
    res.render("signup.ejs", { error: null, data: {} });
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
      const refreshToken = JWT.generateRefreshToken(
        { _id: newUser.id },
        process.env.JWT_REFRESH_EXPIRES
      );

      //cookie options

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 30 * 1000, //30 seconds for a testing
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        maxAge: 60 * 60 * 1000, //1 hour
      });

      //user registered successfully

      // send verification email
      const doctype_html = `<h4>Hi ${name},your email verification otp : ${verification_token}`;

      await NodeMailer.sendingMail(email, "Email Verification", doctype_html);

      res.redirect("/auth/verify");
    } catch (error) {
      req.flash("message", error.message);
      return res.redirect("/auth/register");
    }
  };

  static getLogin = (req, res) => {
    res.render("login.ejs", {
      error: null,
      data: {},
    });
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
      console.log(updatedUser);

      req.flash("success", "Registration Successfully... ");
      return res.redirect("/");
    } catch (error) {
      req.flash("message", error.message);
      return res.redirect("/auth/verify");
    }
  };

  static resendEmail = async (req, res) => {
    const id = req.user._id;
    let user = await User.findById({ _id: id });
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
        }
      );

      if (newUser) {
        res.json({
          success: true,
        });
        const doctype_html = `<h4>Hi ${user.name},your resend email verification otp : ${verification_token}`;
        await NodeMailer.sendingMail(email, "Email Verification", doctype_html);
      }
    } catch (error) {
      console.log(error);
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

      // 4) set to the cookie
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        // maxAge: 60 * 60 * 1000,
        maxAge: 30 * 1000,
      });

      req.flash("message", "Logged in successfully");
      return res.redirect("/");
    } catch (error) {
      
      req.flash("message", error.message);
      return res.redirect("/auth/login");
    }
  };

  static getNewToken = (req, res, next) => {
    const decoded_data = req.user;
    console.log(decoded_data);

    try {
      if (decoded_data) {
        const payload = {
          _id: decoded_data._id,
        };

        const accessToken = JWT.generateAccessToken(payload, "60s"); //60 seconds for the testing
        const refreshToken = JWT.generateRefreshToken(payload, "1h"); //1hour for the testing

        console.log("accessToken = ", accessToken);
        console.log("refreshToken = ", refreshToken);

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 1000,
        });
        console.log(res.getHeaders());
      } else {
        throw new Error("access is forbidden");
      }
    } catch (error) {
      res.status(403).json({
        message: error.message,
      });
    }
  };
}

module.exports = UserController;
