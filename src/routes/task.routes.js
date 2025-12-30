const express = require("express");
const router = express.Router();

const { body, param } = require("express-validator");
const validate = require("../middlewares/validation.middleware");
const verifyJWT = require("../middlewares/auth.middleware");

const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require("../controllers/task.controller");

// post task request is protected by verifyJWT
// POST /tasks
router.post(
  "/",
  verifyJWT, // 🔐
  [
    body("name")
      .notEmpty()
      .withMessage("Task name is required")
      .isString()
      .withMessage("Task name must be a string"),

    body("project")
      .notEmpty()
      .withMessage("Project name is required")
      .isMongoId()
      .withMessage("Project must be a valid ObjectId"),

    body("team")
      .notEmpty()
      .withMessage("Team name is required")
      .isMongoId()
      .withMessage("Team must be a valid ObjectId"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("tags.*")
      .optional()
      .isString()
      .withMessage("Each tag must be a string"),

    body("timeToComplete")
      .notEmpty()
      .withMessage("timeToComplete is required")
      .isNumeric()
      .withMessage("timeToComplete must be a number"),

    body("status")
      .optional()
      .isIn(["To Do", "In Progress", "Completed", "Blocked"])
      .withMessage("Invalid task status"),
  ],
  validate,
  createTask
);

// GET /tasks
router.get("/", getAllTasks);

// put task request is protected by verifyJWT
// PUT /tasks/:taskId
router.put(
  "/:taskId",
  verifyJWT,
  [
    param("taskId").isMongoId().withMessage("Invalid taskId"),

    body("name")
      .optional()
      .isString()
      .withMessage("Task name must be a string"),

    body("project")
      .optional()
      .isMongoId()
      .withMessage("Project must be a valid ObjectId"),

    body("team")
      .optional()
      .isMongoId()
      .withMessage("Team must be a valid ObjectId"),

    body("tags").optional().isArray().withMessage("Tags must be an array"),

    body("tags.*")
      .optional()
      .isString()
      .withMessage("Each tag must be a string"),

    body("timeToComplete")
      .optional()
      .isNumeric()
      .withMessage("timeToComplete must be a number"),

    body("status")
      .optional()
      .isIn(["To Do", "In Progress", "Completed", "Blocked"])
      .withMessage("Invalid task status"),
  ],
  validate,
  updateTask
);

// DELETE /tasks/:taskId
router.delete(
  "/:taskId",
  verifyJWT,
  [param("taskId").isMongoId().withMessage("Invalid taskId")],
  validate,
  deleteTask
);

module.exports = router;
