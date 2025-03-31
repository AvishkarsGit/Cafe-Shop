const express = require("express");
const UserController = require("../controller/user.controller.js");
const AuthValidator = require("../validator/auth.validator.js");
const GlobalMiddleware = require("../middleware/global.middleware.js");
const router = express.Router();


router
  .route("/register")
  .get(UserController.getRegister)
  .post(
    AuthValidator.validateSignup(),
    GlobalMiddleware.checkError,
    UserController.postRegister
  );

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
  .get(GlobalMiddleware.isLoggedIn, UserController.logout);

router.route("/forgot-password").get(UserController.getForgotPassword);

router
  .route("/reset/password")
  .get(GlobalMiddleware.isLoggedOut, UserController.getResetPassword)
  .post(UserController.resetPassword);

router
  .route("/send/reset/password/token")
  .post(UserController.sendResetPasswordToken);


module.exports = router;
