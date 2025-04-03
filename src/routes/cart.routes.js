const express = require("express");

const GlobalMiddleware = require("../middleware/global.middleware.js");
const CartController = require("../controller/cart.controller.js");

const router = express.Router();

router
  .route("/add")
  .post(GlobalMiddleware.isLoggedIn, CartController.addToCart);

module.exports = router;
