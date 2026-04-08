import express from "express";
import {
  createTeam,
  getTeams,
  applyToRole,
  getLeaderApplications,
  updateApplicationStatus,
} from "../controllers/teamController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   IMPORTANT: KEEP SPECIFIC ROUTES FIRST
========================= */

// Leader dashboard routes
router.get("/manage/applications", protect, getLeaderApplications);
router.put("/manage/applications/:appId", protect, updateApplicationStatus);

// Team routes
router.post("/", protect, createTeam);
router.get("/", getTeams);
router.post("/:teamId/apply", protect, applyToRole);

export default router;