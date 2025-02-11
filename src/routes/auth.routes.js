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
  .get(
    GlobalMiddleware.isLoggedIn,
    GlobalMiddleware.isEmailNotVerified,
    UserController.getVerificationScreen
  )
  .post(GlobalMiddleware.isLoggedIn, UserController.verifyEmail)
  .patch(GlobalMiddleware.isLoggedIn, UserController.resendEmail);

router
  .route("/login")
  .get(GlobalMiddleware.isLoggedOut, UserController.getLogin)
  .post(AuthValidator.validateLogin, UserController.login);

router
  .route("/logout")
  .post(GlobalMiddleware.isLoggedIn, UserController.logout);

router
  .route("/forgot-password")
  .get(GlobalMiddleware.isLoggedOut, UserController.getForgotPassword);
router
  .route("/reset/password/verify")
  .post(GlobalMiddleware.isLoggedOut, UserController.verifyResetPasswordToken);

router
  .route("/reset/password")
  .get(GlobalMiddleware.isLoggedOut, UserController.getResetPassword)
  .post(UserController.resetPassword);

 

module.exports = router;
