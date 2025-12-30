const Team = require("../models/team.model");

const createTeam = async (req, res, next) => {
  try {
    const team = new Team(req.body);
    const savedTeam = await team.save();

    res
      .status(201)
      .json({ message: "Team created successfully.", team: savedTeam });
  } catch (error) {
    next(error);
  }
};

const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find();

    res.status(200).json({
      message: "Fetched teams successfully.",
      count: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getAllTeams,
};
