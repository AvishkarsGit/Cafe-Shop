const express = require("express");
const UserController = require("../controller/user.controller.js");
const GlobalMiddleware = require("../middleware/global.middleware.js");
const HomeController = require("../controller/home.controller.js");
const upload = require("../config/multer.js");
const CartController = require("../controller/cart.controller.js");
const router = express.Router();

router.route("/home").get(HomeController.getHomePage);

// call middleware
router.use(
  GlobalMiddleware.isLoggedIn,
  GlobalMiddleware.isUserExist,
  GlobalMiddleware.isEmailVerified
);

router.route("/").get(UserController.getHome);

router.route("/orders").get(HomeController.getOrders);

router.route("/getCart").get(HomeController.getCart);
router.route("/profile").get(HomeController.getProfile);

router
  .route("/profile/edit/:id")
  .get(HomeController.getProfileEditScreen)
  .post(upload.single("profile"), HomeController.changeProfile);

module.exports = router;
