const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const validate = require("../middlewares/validation.middleware");
const verifyJWT = require("../middlewares/auth.middleware");

const Tag = require("../models/tag.model");
const { createTag, getAllTags } = require("../controllers/tag.controller");

// post tag request is protected by verifyJWT
// POST /tags
router.post(
  "/",
  verifyJWT,
  [
    body("name")
      .notEmpty()
      .withMessage("Tag name is required")
      .isString()
      .withMessage("Tag name must be a string")
      .custom(async (value) => {
        const existingTag = await Tag.findOne({ name: value.toLowerCase() });
        if (existingTag) {
          throw new Error("Tag name already exists");
        }
        return true;
      }),
  ],
  validate,
  createTag
);

// GET /tags
router.get("/", getAllTags);

module.exports = router;
