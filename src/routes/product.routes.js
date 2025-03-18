const express = require("express");
const ProductController = require("../controller/products.controller");
const GlobalMiddleware = require("../middleware/global.middleware");
const upload = require("../config/multer");

const router = express.Router();

router.use(
  GlobalMiddleware.isLoggedIn,
  GlobalMiddleware.isEmailVerified,
  GlobalMiddleware.isAdmin
);

router
  .route("/create")
  .get(ProductController.getIndexPage)
  .post(upload.single("imgUrl"), ProductController.addProduct);

router.route("/read").get(ProductController.getAllProducts);
router.route("/delete/:id").get(ProductController.deleteProduct);
router.route("/edit/:id").get(ProductController.editProduct);
router
  .route("/update/:id")
  .post(upload.single("imgUrl"), ProductController.updateProduct);

module.exports = router;
