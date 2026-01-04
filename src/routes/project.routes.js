const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const validate = require("../middlewares/validation.middleware");
const verifyJWT = require("../middlewares/auth.middleware");

const Project = require("../models/project.model");
const {
  createProject,
  getAllProjects,
} = require("../controllers/project.controller");

// post project request is protected by verifyJWT
// POST /projects
router.post(
  "/",
  verifyJWT,
  [
    body("name")
      .notEmpty()
      .withMessage("Project name is required")
      .isString()
      .withMessage("Project name must be a string")
      .custom(async (value) => {
        const existingProject = await Project.findOne({ name: value });
        if (existingProject) {
          throw new Error("Project name already exists");
        }
        return true;
      }),

    body("description")
      .optional()
      .isString()
      .withMessage("Project description must be a string"),
    body("status")
      .notEmpty()
      .withMessage("Project status is required")
      .isIn(["Not Started", "In Progress", "Completed", "On Hold"])
      .withMessage("Invalid project status"),
  ],
  validate,
  createProject
);

// GET /projects
router.get("/", getAllProjects);

module.exports = router;
