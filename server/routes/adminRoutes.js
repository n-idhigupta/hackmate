import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  getAllTeams,
  getAllApplications,
  deleteTeam,
  deleteUser,
  getAnalytics
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.get("/teams", authMiddleware, adminMiddleware, getAllTeams);
router.get("/applications", authMiddleware, adminMiddleware, getAllApplications);
router.get("/analytics", authMiddleware, adminMiddleware, getAnalytics);

router.delete("/team/:id", authMiddleware, adminMiddleware, deleteTeam);
router.delete("/user/:id", authMiddleware, adminMiddleware, deleteUser);

export default router;