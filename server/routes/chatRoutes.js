import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getTeamMessages, saveMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:teamId", authMiddleware, getTeamMessages);
router.post("/:teamId", authMiddleware, saveMessage);

export default router;