const Team = require("../models/team.model");
const User = require("../models/user.model");

const createTeam = async (req, res, next) => {
  try {
    const team = new Team({
      ...req.body,

      // creator becomes first member automatically
      members: [req.user.userId],
    });
    const savedTeam = await team.save();

    const populatedTeam = await Team.findById(savedTeam._id).populate(
      "members",
      "name email",
    );

    res.status(201).json({
      message: "Team created successfully.",
      team: populatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

const getAllTeams = async (req, res, next) => {
  try {
    const teams = await Team.find().populate("members", "name email");

    res.status(200).json({
      message: "Fetched teams successfully.",
      count: teams.length,
      teams,
    });
  } catch (error) {
    next(error);
  }
};

const getTeamById = async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.teamId).populate(
      "members",
      "name email",
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    res.status(200).json({
      message: "Fetched Team Successfully.",
      team,
    });
  } catch (error) {
    next(error);
  }
};

const addMemberToTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { userId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // checking user existence
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // prevent duplicates
    if (team.members.includes(userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push(userId);
    await team.save();

    const updatedTeam = await Team.findById(teamId).populate(
      "members",
      "name email",
    );

    res.status(200).json({
      message: "Member added successfully.",
      team: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

// REMOVE MEMBER FROM TEAM
const removeMemberFromTeam = async (req, res, next) => {
  try {
    const { teamId, userId } = req.params;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Prevent removing creator (first member)
    if (team.members[0].toString() === userId) {
      return res.status(400).json({
        message: "Team creator cannot be removed.",
      });
    }

    // Remove member
    team.members = team.members.filter(
      (memberId) => memberId.toString() !== userId,
    );

    await team.save();

    const updatedTeam = await Team.findById(teamId).populate(
      "members",
      "name email",
    );

    res.status(200).json({
      message: "Member removed successfully.",
      team: updatedTeam,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  addMemberToTeam,
  removeMemberFromTeam,
};
