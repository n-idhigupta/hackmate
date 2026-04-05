import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    password: { type: String, required: true },
    role: { type: String, enum: ["member", "leader"], default: "member" },
    experiencePoints: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);