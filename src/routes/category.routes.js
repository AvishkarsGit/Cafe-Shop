const express = require("express");
const CategoryController = require("../controller/category.controller");
const GlobalMiddleware = require("../middleware/global.middleware");
const upload = require("../config/multer");
const router = express.Router();

router.use(
  GlobalMiddleware.isLoggedIn,
  GlobalMiddleware.isEmailVerified,
  GlobalMiddleware.isAdmin
);

router.route("/").get(CategoryController.getCategoryPage);

router
  .route("/create")
  .get(CategoryController.getCategoryForm)
  .post(CategoryController.addCategory);

router.route("/categories").get(CategoryController.allCategories);

router
  .route("/edit/:id")
  .get(CategoryController.getEditForm)
  .post(CategoryController.editCategory);

router.route("/delete/:id").delete(CategoryController.deleteCategory);

module.exports = router;
