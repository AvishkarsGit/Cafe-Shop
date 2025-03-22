const express = require("express");
const UserController = require("../controller/user.controller.js");
const GlobalMiddleware = require("../middleware/global.middleware.js");
const HomeController = require("../controller/home.controller.js");
const upload = require("../config/multer.js");
const router = express.Router();

router.use(
  GlobalMiddleware.isLoggedIn,
  GlobalMiddleware.isUserExist,
  GlobalMiddleware.isEmailVerified
);
router.route("/").get(UserController.getHome);

router.route("/orders").get(HomeController.getOrders);

router.route("/cart").get(HomeController.getCart);
router.route("/profile").get(HomeController.getProfile);

router
  .route("/profile/edit/:id")
  .get(HomeController.getProfileEditScreen)
  .post(upload.single("profile"), HomeController.changeProfile);
module.exports = router;
