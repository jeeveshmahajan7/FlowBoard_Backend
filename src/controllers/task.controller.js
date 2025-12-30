const Task = require("../models/task.model");

const createTask = async (req, res, next) => {
  try {
    const task = new Task({
      ...req.body,
      owners: [req.user.userId],
    });
    
    const savedTask = await task.save();

    res
      .status(201)
      .json({ message: "Task created successfully", task: savedTask });
  } catch (error) {
    next(error);
  }
};

const getAllTasks = async (req, res, next) => {
  try {
    const { team, owner, tags, project, status } = req.query;

    const filter = {};

    if (team) {
      filter.team = team;
    }

    if (owner) {
      filter.owners = owner;
    }

    if (project) {
      filter.project = project;
    }

    if (status) {
      filter.status = status;
    }

    if (tags) {
      // support comma separated tags
      filter.tags = { $in: tags.split(",") };
    }

    const tasks = await Task.find(filter)
      .populate("project", "name")
      .populate("team", "name")
      .populate("owners", "name email");

    res.status(200).json({
      message: "Fetched tasks successfully",
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", updatedTask });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};
