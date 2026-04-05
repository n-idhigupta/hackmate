import User from "../models/User.js";
import Application from "../models/Application.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const applications = await Application.find({ user: req.user.id }).populate(
      "team",
      "hackathonName"
    );

    res.status(200).json({ user, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};