const User = require("../models/user.model");
const cloudinary = require("../config/cloudinary.js");
const { Category } = require("../models/category.model");

class HomeController {
  static getOrders = (req, res) => {
    res.render("users/orders.ejs");
  };
  static getCart = (req, res) => {
    res.render("users/cart.ejs");
  };
  static getProfile = async (req, res) => {
    const id = req.user._id;
    const user = await User.findOne({ _id: id });
    res.render("users/profile.ejs", { user });
  };

  static getProfileEditScreen = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    res.render("users/profile-edit.ejs", { user });
  };

  static changeProfile = async (req, res) => {
    try {
      const { name, phone } = req.body;

      const user = await User.findOne({ _id: req.params.id });

      if (!user) {
        throw new Error("user not found!!");
      }

      let profileUrl = user.profile;
      let cloudinaryId = user.cloudinaryId;

      if (req.file) {
        if (cloudinaryId) {
          await cloudinary.uploader.destroy(cloudinaryId);
        }

        console.log(req.file);

        profileUrl = req.file.path;
        cloudinaryId = req.file.filename;
      }

      const updated = await User.findOneAndUpdate(
        {
          name: name,
        },
        {
          name,
          phone,
          profile: profileUrl,
          cloudinaryId,
        },
        {
          new: true,
        }
      );

      console.log(updated);

      return res.json({
        success: true,
        message: "Profile updated successfully",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static getHomePage = async (req, res) => {
    try {
      const categories = await Category.find();
      res.render("auth/home.ejs", { categories });
    } catch (error) {
      console.log(error);
    }
  };
}
module.exports = HomeController;
