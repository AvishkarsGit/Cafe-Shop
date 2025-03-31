const express = require("express");
const UserController = require("../controllers/user.controller");
const HomeController = require("../controllers/home.controller");
const { AuthMiddleware } = require("../middleware/auth.middleware");
const router = express.Router();

router.route("/").get(AuthMiddleware.isLoggedIn, HomeController.getHomePage);

module.exports = router;
