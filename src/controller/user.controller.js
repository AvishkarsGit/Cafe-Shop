const User = require("../models/user.model.js");
const JWT = require("../utils/jwt.js");
const NodeMailer = require("../utils/NodeMailer.js");
const Product = require("../models/products.model.js");
const Query = require("../models/query.model.js");
require("dotenv").config();

const Redis = require("../utils/Redis.js");
const { Category } = require("../models/category.model.js");
const productsModel = require("../models/products.model.js");
const Cart = require("../models/cart.model.js");

class UserController {
  static getRegister = (req, res) => {
    res.render("auth/signup.ejs");
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
        profile: "",
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

      return res.status(200).json({
        success: true,
        message: "Your account created successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    // d-1e26070cbfd54e66bc249f9529d8de69
  };

  static getLogin = (req, res) => {
    res.render("auth/login.ejs");
  };

  static getHome = async (req, res) => {
    const type = req.user.type;

    const categories = await Category.find();
    const cart = await Cart.find();

    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category", // Group by category
          products: { $push: "$$ROOT" }, // Collect all products in an array
        },
      },
      {
        $project: {
          _id: 1,
          products: { $slice: ["$products", 2] }, // Take only 2 products per category
        },
      },
    ]);

    if (type === "admin") {
      res.render("products/all_product.ejs", { productsByCategory });
    } else {
      res.render("auth/home.ejs", { categories, productsByCategory });
    }
  };

  static getVerificationScreen = (req, res) => {
    res.render("auth/verify.ejs");
  };

  static verifyEmail = async (req, res) => {
    try {
      let verification_token = req.body.verification_token;

      const user = await User.findOne({
        verification_token,
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

    const email = user.email;
    const verification_token = JWT.generateOTP();
    console.log(email);

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

      console.log(newUser);

      if (newUser) {
        await NodeMailer.sendingMail(
          email,
          newUser.name,
          verification_token,
          "Your Verification email"
        );

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

  static getForgotPassword = async (req, res) => {
    res.render("auth/send_reset_password_otp.ejs");
  };

  static sendResetPasswordToken = async (req, res) => {
    //generate the otp
    const { email } = req.body;
    const otp = JWT.generateOTP();
    try {
      const user = await User.findOneAndUpdate(
        { email },
        {
          updatedAt: new Date(),
          reset_password_verification_token: otp,
          reset_password_verification_token_time:
            Date.now() + JWT.MAX_TOKEN_TIME,
        },
        {
          new: true,
        }
      );

      if (!user) {
        throw new Error("email does not exists");
      }

      const link = `http://localhost:${process.env.PORT}/auth/reset/password?email=${email}`;
      //send to the email
      await NodeMailer.sendResetPasswordEmail(
        email,
        user.name,
        link,
        "Password reset email"
      );

      return res.json({
        success: true,
        message: "Link has been sent to your email",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static verifyResetPasswordToken = async (req, res) => {
    const { reset_password_verification_token } = req.body;

    try {
      const user = await User.findOne({
        reset_password_verification_token,
        reset_password_verification_token_time: { $gt: Date.now() },
      });

      if (!user) {
        throw new Error("verification token is invalid or may be expired");
      }

      return res.status(200).json({
        success: true,
        message: "Otp verified successfully",
        email: user.email,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static getResetPassword = (req, res) => {
    res.render("auth/reset_password.ejs", { email: req.query.email });
  };

  static resetPassword = async (req, res) => {
    const { password, email } = req.body;
    console.log(email);
    try {
      const hashed = await JWT.encryptPassword(password);
      const user = await User.findOneAndUpdate(
        {
          email,
        },
        {
          password: hashed,
          updatedAt: Date.now(),
        },
        {
          new: true,
        }
      );

      if (!user) {
        throw new Error("failed to update password");
      }

      return res.status(200).json({
        success: true,
        message: "Password is updated successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  //Update only this code
  static contactPage = async (req, res) => {
    try {
      return res.render("auth/contact.ejs");
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static addData = async (req, res) => {
    try {
      const { name, email, phone, description } = req.body;
      const QueryData = await Query.create({
        name,
        email,
        phone,
        description,
      });

      if (!QueryData) {
        throw new Error("failed to saved");
      }

      return res.json({
        success: true,
        message: "Your query has been saved",
        sub_message: "Our admin will contact you soon.",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  // i want only here changes

  static queries = async (req, res) => {
    try {
      const AllQuery = await Query.find(); // fetch all queries
      return res.render("auth/queries.ejs", { AllQuery });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  static deleteQuery = async (req, res) => {
    try {
      const id = req.params.id;

      await Query.findOneAndDelete({ _id: id });
      return res.json({
        success: true,
        message: "We are deleting requested query",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}

module.exports = UserController;
