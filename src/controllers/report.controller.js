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
    })
      .populate("team", "name")
      .populate("project", "name")
      .populate("owners", "name")
      .sort({ updatedAt: -1 });

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
      0,
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

    if (!["team", "project", "owner"].includes(groupBy)) {
      return res.status(400).json({
        message: "groupBy must be one of: team, project, owner",
      });
    }

    // 1️⃣ get all completed tasks
    const completedTasks = await Task.find({ status: "Completed" })
      .populate("team", "name")
      .populate("project", "name")
      .populate("owners", "name");

    const map = {};

    completedTasks.forEach((task) => {
      if (groupBy === "owner") {
        task.owners.forEach((owner) => {
          // ??= is the nullish coalescing assignment operator in JavaScript
          // The operator performs an assignment only if the variable's current value is null or undefined.
          map[owner._id] ??= {
            id: owner._id,
            name: owner.name,
            count: 0,
          };
          map[owner._id].count++;
        });
      } else {
        const entity = task[groupBy]; //team or project
        if (!entity) return;

        map[entity._id] ??= {
          id: entity._id,
          name: entity.name,
          count: 0,
        };
        map[entity._id].count++;
      }
    });

    res.status(200).json({
      message: `Closed tasks grouped by ${groupBy}`,
      data: Object.values(map),
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
