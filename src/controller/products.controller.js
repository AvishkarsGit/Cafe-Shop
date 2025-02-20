const productData = require("../models/products.model.js");
class ProductController {
  static getHome = (req, res) => {
    res.render("products/index");
  };

  static addProduct = async (req, res) => {
    const { ProductName, ProductPrice, Description, imgUrl } = req.body;
    const product = await productData.create({
      ProductName,
      ProductPrice,
      Description,
      imgUrl,
    });
    res.redirect("/products/read");
  };

  static getAllProducts = async (req, res) => {
    let cafeproduct = await productData.find();
    res.render("products/read", { cafeproduct });
  };

  static deleteProduct = async (req, res) => {
    const products = await productData.findByIdAndDelete({
      _id: req.params.id,
    });
    res.redirect("/products/read");
  };

  static editProduct = async (req, res) => {
    const product = await productData.findOne({ _id: req.params.id });
    res.render("products/edit", { product });
  };

  static updateProduct = async (req, res) => {
    let { ProductName, ProductPrice, Description, imgUrl } = req.body;
    const product = await productData.findOneAndUpdate(
      { _id: req.params.id },
      { ProductName, ProductPrice, Description, imgUrl },
      { new: true }
    );
    res.redirect("/products/read");
  };
}

module.exports = ProductController;
