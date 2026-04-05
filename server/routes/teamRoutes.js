import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTeam,
  getTeams,
  applyToRole,
  getLeaderApplications,
  updateApplicationStatus
} from "../controllers/teamController.js";

const router = express.Router();

router.get("/", getTeams);
router.post("/", authMiddleware, createTeam);
router.post("/:teamId/apply", authMiddleware, applyToRole);
router.get("/leader/applications", authMiddleware, getLeaderApplications);
router.patch("/application/:appId", authMiddleware, updateApplicationStatus);

export default router;