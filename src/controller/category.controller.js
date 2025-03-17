const Category = require("../models/category.model");

class CategoryController {
  static getCategoryPage = (req, res) => {
    res.render("category/add_category.ejs");
  };
  static addCategory = async (req, res) => {
    try {
      const url = req.file ? req.file.path : null;

      console.log(url);
      const cloudinaryId = req.file ? req.file.filename : null;

      const data = {
        category: req.body.category,
        categoryImgUrl: url,
      };

      const cat = await new Category(data).save();
      return res.json({
        success: true,
        message: "Category added successfully",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static allCategories = async (req, res) => {
    try {
      const categories = await Category.find();

      return res.json({
        success: true,
        categories,
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static getCategoryForm = async (req, res) => {
    res.render("category/create_category.ejs");
  };

  static deleteCategory = async (req, res) => {
    const id = req.params.id;
    try {
      const category = await Category.findOneAndDelete(
        {
          _id: id,
        },
        {
          new: true,
        }
      );
      if (!category) {
        throw new Error("something went wrong");
      }

      return res.json({
        success: true,
        message: "Category is deleted..",
      });
    } catch (error) {
      return res.json({
        success: false,
        error: error.message,
      });
    }
  };

  static getEditForm = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findOne({ _id: id });

    res.render("category/edit_category.ejs", { category });
  };

  static editCategory = async (req, res) => {
    const id = req.params.id;
    const { category, categoryImgUrl } = req.body;
    try {
      await Category.findOneAndUpdate(
        {
          _id: id,
        },
        {
          category,
          categoryImgUrl,
        },
        {
          new: true,
        }
      );

      return res.json({
        success: true,
        message: "Successfully updated..",
      });
    } catch (error) {
      return res.json({
        success: false,
        error: error.message,
      });
    }
  };
}
module.exports = CategoryController;
