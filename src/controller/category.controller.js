const Category = require("../models/category.model");

class CategoryController {
  static getCategoryPage = (req, res) => {
    res.render("category/add_category.ejs");
  };
  static addCategory = async (req, res) => {
    try {
      const { category } = req.body;

      const cat = await new Category({ category }).save();
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
}
module.exports = CategoryController;
