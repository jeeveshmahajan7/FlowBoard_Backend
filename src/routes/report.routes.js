const express = require("express");
const router = express.Router();

const verifyJWT = require("../middlewares/auth.middleware");

const {
  completedTasksLastWeek,
  getPendingWorkDays,
  closedTasks,
} = require("../controllers/report.controller");

// all reports are protected by verifyJWT
// GET /report/last-week
router.get("/last-week", verifyJWT, completedTasksLastWeek);

// GET /report/pending
router.get("/pending", verifyJWT, getPendingWorkDays);

// GET /report/closed-tasks
router.get("/closed-tasks", verifyJWT, closedTasks);

module.exports = router;
