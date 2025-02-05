const express = require("express");
const UserController = require("../controller/user.controller");
const GlobalMiddleware = require("../middleware/global.middleware");
const router = express.Router();


router.route("/").get(GlobalMiddleware.isLoggedIn, UserController.getHome);

module.exports = router;
