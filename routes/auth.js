const express = require("express");
const { body } = require("express-validator/check");
const authController = require("../controllers/user");
const router = express.Router();
router.post("/login", authController.login);
router.post("/signup", authController.signup);
module.exports = router;
