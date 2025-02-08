const express = require("express");
const UserController = require("../controller/user.controller.js");
const AuthValidator = require("../validator/auth.validator.js");
const GlobalMiddleware = require("../middleware/global.middleware.js");
const router = express.Router();

router
  .route("/register")
  .get(UserController.getRegister)
  .post(AuthValidator.validateSignup, UserController.postRegister);

router
  .route("/verify")
  .get(GlobalMiddleware.isLoggedIn, UserController.getVerificationScreen)
  .post(GlobalMiddleware.isLoggedIn, UserController.verifyEmail)
  .patch(GlobalMiddleware.isLoggedIn, UserController.resendEmail);

router
  .route("/login")
  .get(UserController.getLogin)
  .post(AuthValidator.validateLogin, UserController.login);

router
  .route("/refresh-token")
  .post(GlobalMiddleware.decodeRefreshToken, UserController.getNewToken);

module.exports = router;
