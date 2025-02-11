const express = require("express");
const ProductController = require("../controller/products.controller");
const router = express.Router();

router.route("/").get(ProductController.getHome);
router.route("/create").post(ProductController.addProduct);

router.route("/read").get(ProductController.getAllProducts);

router.route("/delete/:id").get(ProductController.deleteProduct);

router.route("/edit/:id").get(ProductController.editProduct);

router.route("/update/:id").post(ProductController.updateProduct);

module.exports = router;
