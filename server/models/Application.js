import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    roleApplied: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications to same team + same role
applicationSchema.index({ user: 1, team: 1, roleApplied: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);