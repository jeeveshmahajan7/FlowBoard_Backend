const express = require("express");
const router = express.Router();

const { body } = require("express-validator");
const validate = require("../middlewares/validation.middleware");
const verifyJWT = require("../middlewares/auth.middleware");

const {
  createTeam,
  getAllTeams,
  getTeamById,
  addMemberToTeam,
} = require("../controllers/team.controller");

// post team request is protected by verifyJWT
// POST /teams
router.post(
  "/",
  verifyJWT,
  [
    body("name")
      .notEmpty()
      .withMessage("Team name is required")
      .isString()
      .withMessage("Team name must be a string"),

    body("description")
      .optional()
      .isString()
      .withMessage("Task description must be a string"),
  ],
  validate,
  createTeam,
);

// GET /teams
router.get("/", getAllTeams);

// GET /teams/:teamId
router.get("/:teamId", getTeamById);

// POST /teams/:teamId/members
router.put(
  "/:teamId/members",
  verifyJWT,
  [body("userId").notEmpty().withMessage("User Id is required")],
  validate,
  addMemberToTeam,
);

module.exports = router;
