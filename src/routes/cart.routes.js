const express = require("express");

const GlobalMiddleware = require("../middleware/global.middleware.js");
const CartController = require("../controller/cart.controller.js");

const router = express.Router();

router
  .route("/add")
  .post(GlobalMiddleware.isLoggedIn, CartController.addToCart);

router
  .route("/fetch")
  .get(GlobalMiddleware.isLoggedIn, CartController.fetchCart);

router
  .route("/updateCart")
  .post(GlobalMiddleware.isLoggedIn, CartController.addQty);

router
  .route("/removeFromCart")
  .post(GlobalMiddleware.isLoggedIn, CartController.minusQty);

router
  .route("/getItemsCount")
  .get(GlobalMiddleware.isLoggedIn, CartController.getItemsCount);

module.exports = router;
