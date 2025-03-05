const express = require("express");
const CategoryController = require("../controller/category.controller");
const GlobalMiddleware = require("../middleware/global.middleware");
const router = express.Router();

router.use(
  GlobalMiddleware.isLoggedIn,
  GlobalMiddleware.isEmailVerified,
  GlobalMiddleware.isAdmin
);

router
  .route("/new")
  .get(CategoryController.getCategoryPage)
  .post(CategoryController.addCategory);

router.route("/categories").get(CategoryController.allCategories);

module.exports = router;
