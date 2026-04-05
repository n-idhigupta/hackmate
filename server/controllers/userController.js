import User from "../models/User.js";
import Application from "../models/Application.js";
import Team from "../models/Team.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    const applications = await Application.find({ user: req.user.id })
      .populate("team", "hackathonName")
      .sort({ createdAt: -1 });

    const createdTeams = await Team.find({ leader: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({ user, applications, createdTeams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};