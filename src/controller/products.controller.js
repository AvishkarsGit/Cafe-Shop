const productData = require("../models/products.model.js");

class ProductController {
  static getHome = async (req, res) => {
    try {
        const cafeproduct = await productData.find(); // Fetch all products
        res.render("products/index", { cafeproduct }); // Pass products to the view
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).send("Server Error");
    }
};


static addProduct = async (req, res) => {
  try {
      const { ProductName, ProductPrice, Description } = req.body;
      const imgUrl = req.file ? req.file.filename : null; // Only set imgUrl if file exists

      if (!ProductName || !ProductPrice) {
          return res.status(400).send("Product Name and Price are required.");
      }

      const product = await productData.create({
          ProductName,
          ProductPrice,
          Description,
          imgUrl,
      });

      res.redirect("/products/read");
  } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("Server Error");
  }
};


  static getAllProducts = async (req, res) => {
    let cafeproduct = await productData.find();
    res.render("products/read", { cafeproduct });
  };

  static deleteProduct = async (req, res) => {
    await productData.findByIdAndDelete(req.params.id);
    res.redirect("/products/read");
  };

  static editProduct = async (req, res) => {
    const product = await productData.findOne({ _id: req.params.id });
    res.render("products/edit", { product });
  };

  static updateProduct = async (req, res) => {
    let { ProductName, ProductPrice, Description } = req.body;
    const imgUrl = req.file ? req.file.filename : req.body.imgUrl; // Update image if a new one is uploaded

    await productData.findOneAndUpdate(
      { _id: req.params.id },
      { ProductName, ProductPrice, Description, imgUrl },
      { new: true }
    );

    res.redirect("/products/read");
  };
}

module.exports = ProductController;
