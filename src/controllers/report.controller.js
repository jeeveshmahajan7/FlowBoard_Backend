const Task = require("../models/task.model");

const completedTasksLastWeek = async (req, res, next) => {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  try {
    const completedTasks = await Task.find({
      status: "Completed",
      updatedAt: {
        $gte: sevenDaysAgo,
        $lte: now,
      },
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      message: "Tasks completed in last 7 days fetched successfully",
      count: completedTasks.length,
      tasks: completedTasks,
    });
  } catch (error) {
    next(error);
  }
};

const getPendingWorkDays = async (req, res, next) => {
  try {
    const pendingTasks = await Task.find({
      status: { $ne: "Completed" },
    });

    const totalPendingDays = pendingTasks.reduce(
      (sum, task) => sum + (task.timeToComplete || 0),
      0
    );

    res.status(200).json({
      message: "Total pending work days calculated successfully",
      pendingDaysOfWork: totalPendingDays,
    });
  } catch (error) {
    next(error);
  }
};

const closedTasks = async (req, res, next) => {
  try {
    const { groupBy } = req.query;

    if (!groupBy) {
      return res.status(400).json({
        message: "Missing required query param: groupBy",
      });
    }

    const allowedGroups = ["team", "project", "owner"];

    if (!allowedGroups.includes(groupBy)) {
      return res
        .status(400)
        .json({ message: "groupBy must be one of: team, project, owner" });
    }

    // 1️⃣ get all completed tasks
    const completedTasks = await Task.find({ status: "Completed" });

    const counts = {};

    completedTasks.forEach((task) => {
      if (groupBy === "owner") {
        task.owners.forEach((ownerId) => {
          counts[ownerId] = (counts[ownerId] || 0) + 1;
        });
      } else {
        const key = task[groupBy];
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    const result = Object.entries(counts).map(([id, count]) => ({
      id,
      count,
    }));

    res.status(200).json({
      message: `Closed tasks grouped by ${groupBy}`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  completedTasksLastWeek,
  getPendingWorkDays,
  closedTasks,
};
