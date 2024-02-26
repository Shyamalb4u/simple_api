const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/user");
const User = require("../models/user");
const router = express.Router();
router.post("/login", authController.login);
router.post(
  "/signup",
  [
    body("mail")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return User.findOne({ mail: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail address already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("spn").custom((value, { req }) => {
      return User.findOne({ keyid: value }).then((userDoc) => {
        if (!userDoc) {
          return Promise.reject("Invalid Sponsor");
        }
      });
    }),
    body("pass")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password Minimum 6 Character"),
  ],
  authController.signup
);
module.exports = router;
