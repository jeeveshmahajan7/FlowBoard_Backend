const Project = require("../models/project.model");

const createProject = async (req, res, next) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();

    res
      .status(201)
      .json({ message: "Project created successfully", project: savedProject });
  } catch (error) {
    next(error);
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find();

    res
      .status(200)
      .json({
        message: "Fetched projects successfully",
        count: projects.length,
        projects,
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getAllProjects,
};
