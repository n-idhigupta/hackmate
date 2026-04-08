import User from "../models/User.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        uid: user.uid,
        email: user.email,
        phone: user.phone,
        department: user.department,
        year: user.year,
        github: user.github,
        linkedin: user.linkedin,
        role: user.role,
        experiencePoints: user.experiencePoints || 0,
      },
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};