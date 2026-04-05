import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  roleName: { type: String, required: true },
  requiredCount: { type: Number, default: 1 }
});

const teamSchema = new mongoose.Schema(
  {
    hackathonName: { type: String, required: true },
    problemStatement: { type: String, required: true },
    deadline: { type: Date, required: true },
    roles: [roleSchema],
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Team", teamSchema);