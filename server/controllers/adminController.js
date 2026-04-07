import User from "../models/User.js";
import Team from "../models/Team.js";
import Application from "../models/Application.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("leader", "fullName email department year")
      .sort({ createdAt: -1 });

    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("user", "fullName email department year")
      .populate("team", "hackathonName")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    await Application.deleteMany({ team: id });
    await Team.findByIdAndDelete(id);

    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await Application.deleteMany({ user: id });

    const leaderTeams = await Team.find({ leader: id });
    const leaderTeamIds = leaderTeams.map((t) => t._id);

    await Application.deleteMany({ team: { $in: leaderTeamIds } });
    await Team.deleteMany({ leader: id });
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLeaders = await User.countDocuments({ role: "leader" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalTeams = await Team.countDocuments();
    const totalApplications = await Application.countDocuments();
    const acceptedApplications = await Application.countDocuments({ status: "accepted" });
    const rejectedApplications = await Application.countDocuments({ status: "rejected" });
    const pendingApplications = await Application.countDocuments({ status: "pending" });

    const topDepartments = await User.aggregate([
      {
        $group: {
          _id: "$department",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topRoles = await Application.aggregate([
      {
        $group: {
          _id: "$roleApplied",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.status(200).json({
      totalUsers,
      totalLeaders,
      totalAdmins,
      totalTeams,
      totalApplications,
      acceptedApplications,
      rejectedApplications,
      pendingApplications,
      topDepartments,
      topRoles
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};