const { Category } = require("../models/category.model.js");
const cloudinary = require("../config/cloudinary");
class CategoryController {
  static getCategoryPage = (req, res) => {
    res.render("category/add_category.ejs");
  };
  static addCategory = async (req, res) => {
    try {
      const { category } = req.body;

      const url = req.file ? req.file.path : null;
      const cloudinaryId = req.file ? req.file.filename : null;

      console.log(url);

      const data = {
        category,
        categoryImgUrl: url,
        cloudinaryId,
      };
      const cat = await Category.create(data);

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
    try {
      const id = req.params.id;
      const category = await Category.findOne({ _id: id });

      if (category.cloudinaryId) {
        const result = await cloudinary.uploader.destroy(category.cloudinaryId);
        if (result.result === "ok") {
          const deleted = await Category.findOneAndDelete(
            {
              _id: id,
            },
            {
              new: true,
            }
          );
          return res.json({
            success: true,
            message: "Category is deleted",
          });
        }
      }
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static getEditForm = async (req, res) => {
    const id = req.params.id;
    const category = await Category.findOne({ _id: id });

    res.render("category/edit_category.ejs", { category });
  };

  static editCategory = async (req, res) => {
    try {
      let { category } = req.body;
      const cat = await Category.findById(req.params.id);

      let imgUrl = cat.imgUrl;
      let cloudinaryId = cat.cloudinaryId;

      if (req.file) {
        if (cat.cloudinaryId) {
          const data = await cloudinary.uploader.destroy(cat.cloudinaryId);
          console.log(data);
        }

        imgUrl = req.file.path;
        cloudinaryId = req.file.filename;
      }

      await Category.findByIdAndUpdate(
        req.params.id,
        { category, categoryImgUrl: imgUrl, cloudinaryId },
        { new: true }
      );

      return res.json({
        success: true,
        message: "Product is updated",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static filteredCategoryPage = async (req, res) => {
    const categoryId = req.params.id;
    try {
      const categories = await Category.find({ _id: categoryId });

      console.log(categories);

      res.render("category/filtered_category.ejs");
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };
}
module.exports = CategoryController;
