import Team from "../models/Team.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

export const createTeam = async (req, res) => {
  try {
    const { hackathonName, problemStatement, deadline, roles } = req.body;

    const team = await Team.create({
      hackathonName,
      problemStatement,
      deadline,
      roles,
      leader: req.user.id
    });

    await User.findByIdAndUpdate(req.user.id, { role: "leader" });

    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate("leader", "fullName email department year");
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyToRole = async (req, res) => {
  try {
    const { roleApplied } = req.body;
    const { teamId } = req.params;

    const existing = await Application.findOne({
      user: req.user.id,
      team: teamId,
      roleApplied
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied for this role" });
    }

    const application = await Application.create({
      user: req.user.id,
      team: teamId,
      roleApplied
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderApplications = async (req, res) => {
  try {
    const teams = await Team.find({ leader: req.user.id });
    const teamIds = teams.map((team) => team._id);

    const applications = await Application.find({ team: { $in: teamIds } })
      .populate("user", "fullName email department year github linkedin")
      .populate("team", "hackathonName");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { appId } = req.params;

    const application = await Application.findByIdAndUpdate(
      appId,
      { status },
      { new: true }
    );

    if (status === "accepted") {
      await User.findByIdAndUpdate(application.user, {
        $inc: { experiencePoints: 10 }
      });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};