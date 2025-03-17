const productData = require("../models/products.model");
const cloudinary = require("../config/cloudinary");

class ProductController {
  static getHome = async (req, res) => {
    try {
      const cafeproduct = await productData.find();
      res.render("products/index", { cafeproduct });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Server Error");
    }
  };
  

  static addProduct = async (req, res) => {
    try {
      const { ProductName, ProductPrice, Description } = req.body;

      const imgUrl = req.file ? req.file.path : null;
      const cloudinaryId = req.file ? req.file.filename : null;

      if (!ProductName || !ProductPrice) {
        return res.status(400).send("Product Name and Price are required.");
      }
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
    
    try {  

      res.redirect("/products/read");
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("Server Error");
    }
  };

  static getAllProducts = async (req, res) => {
    try {
      const cafeproduct = await productData.find();
      res.render("products/read", { cafeproduct });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).send("Server Error");
    }

  };

  static deleteProduct = async (req, res) => {
    try {
      const product = await productData.findById(req.params.id);

      if (!product) {
        return res.status(404).send("Product not found");
      }

      // Delete image from Cloudinary
      if (product.cloudinaryId) {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      }

      await productData.findByIdAndDelete(req.params.id);
      res.redirect("/products/read");
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Server Error");
    }
  };

  static editProduct = async (req, res) => {
    try {
      const product = await productData.findById(req.params.id);
      res.render("products/edit", { product });
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).send("Server Error");
    }
  };

  static updateProduct = async (req, res) => {
    try {

      let { ProductName, ProductPrice, Description } = req.body;
      const product = await productData.findById(req.params.id);

      let imgUrl = product.imgUrl;
      let cloudinaryId = product.cloudinaryId;

      if (req.file) {
        if (product.cloudinaryId) {
          await cloudinary.uploader.destroy(product.cloudinaryId);
        }

        imgUrl = req.file.path;
        cloudinaryId = req.file.filename;
      }

      await productData.findByIdAndUpdate(
        req.params.id,
        { ProductName, ProductPrice, Description, imgUrl, cloudinaryId },
        { new: true }
      );

      res.redirect("/products/read");
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send("Server Error");

    }
  };
}

module.exports = ProductController;
