const express = require("express");
const UserController = require("../controller/user.controller.js");
const GlobalMiddleware = require("../middleware/global.middleware.js");
const router = express.Router();

router
  .route("/")
  .get(
    GlobalMiddleware.isLoggedIn,
    GlobalMiddleware.isEmailVerified,
    UserController.getHome
  );



module.exports = router;
