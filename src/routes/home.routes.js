const express = require("express");
const UserController = require("../controller/user.controller.js");
const GlobalMiddleware = require("../middleware/global.middleware.js");
const HomeController = require("../controller/home.controller.js");
const router = express.Router();

router
  .route("/home")
  .get(
    GlobalMiddleware.isLoggedIn,
    GlobalMiddleware.isUserExist,
    GlobalMiddleware.isEmailVerified,
    UserController.getHome
  );

router
  .route("/orders")
  .get(
    GlobalMiddleware.isLoggedIn,
    GlobalMiddleware.isUserExist,
    GlobalMiddleware.isEmailVerified,
    HomeController.getOrders
  );

router
  .route("/cart")
  .get(
    GlobalMiddleware.isLoggedIn,
    GlobalMiddleware.isUserExist,
    GlobalMiddleware.isEmailVerified,
    HomeController.getCart
  );
router
  .route("/profile")
  .get(
    GlobalMiddleware.isLoggedIn,
    GlobalMiddleware.isUserExist,
    GlobalMiddleware.isEmailVerified,
    HomeController.getProfile
  );
module.exports = router;
