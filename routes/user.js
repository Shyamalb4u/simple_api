const express = require("express");
const authController = require("../controllers/user");
const isAuth = require("../middleware/is_auth");
const router = express.Router();
router.get("/add_money", isAuth, authController.addMoney);
router.get("/direct", isAuth, authController.getDirect);
router.get("/team", isAuth, authController.getTeam);
router.get("/package", authController.getPackages);
module.exports = router;
