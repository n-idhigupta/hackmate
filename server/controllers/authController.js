import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      uid,
      email,
      phone,
      department,
      year,
      github,
      linkedin,
      password
    } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { uid }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      uid,
      email,
      phone,
      department,
      year,
      github,
      linkedin,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Profile created successfully",
      token: generateToken(user._id, user.role),
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id, user.role),
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};