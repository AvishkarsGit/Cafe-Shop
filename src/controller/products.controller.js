const productData = require("../models/products.model.js");
class ProductController {
  static getHome = (req, res) => {
    res.render("products/index");
  };

  static addProduct = async (req, res) => {
    const { ProductName, ProductPrice, Description, imgUrl, category } =
      req.body;
    try {
      const product = await productData.create({
        ProductName,
        ProductPrice,
        Description,
        imgUrl,
        category,
      });
      return res.json({
        success: true,
        message: "Product added successfully",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static getIndexPage = (req, res) => {
    res.render("products/index.ejs");
  };

  static getAllProducts = async (req, res) => {
    res.redirect("/");
  };

  static deleteProduct = async (req, res) => {
    try {
      const products = await productData.findByIdAndDelete(
        {
          _id: req.params.id,
        },
        {
          new: true,
        }
      );

      return res.json({
        success: true,
        message: "Product deleted successfully",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };

  static editProduct = async (req, res) => {
    const product = await productData.findOne({ _id: req.params.id });
    res.render("products/edit", { product });
  };

  static updateProduct = async (req, res) => {
    try {
      let data = {
        ProductName: req.body.ProductName,
        ProductPrice: req.body.ProductPrice,
        Description: req.body.Description,
        imgUrl: req.body.imgUrl,
      };
      const product = await productData.findOneAndUpdate(
        { _id: req.params.id },
        data,
        { new: true }
      );

      return res.json({
        success: true,
        message: "products data updated successfully",
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };
}

module.exports = ProductController;
