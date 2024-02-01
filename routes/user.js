const express = require("express");
const authController = require("../controllers/user");
const isAuth = require("../middleware/is_auth");
const router = express.Router();
router.post("/add_money", isAuth, authController.addMoney);
module.exports = router;
