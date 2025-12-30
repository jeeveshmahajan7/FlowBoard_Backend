const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const { signup, login } = require("../controllers/auth.controller");
const validate = require("../middlewares/validation.middleware");

// POST /auth/signup
router.post(
  "/signup",
  [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email must be valid"),

    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should have minimum 6 characters"),
  ],
  validate,
  signup
);

// POST /auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  validate,
  login
);

module.exports = router;
