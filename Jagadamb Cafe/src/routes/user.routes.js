const express = require("express");
const UserController = require("../controllers/user.controller");
const router = express.Router();

router
  .route("/register")
  .get(UserController.renderRegister)
  .post(UserController.register);
router
  .route("/login")
  .get(UserController.renderLogin)
  .post(UserController.login);

router.route("/logout").get(UserController.logout);

module.exports = router;
