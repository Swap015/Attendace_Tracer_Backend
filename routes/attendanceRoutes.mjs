import express from "express";
import { markAttendance, getMyAttendance, getUserAttendance } from "../controllers/attendanceController.mjs";
import { verifyUser, verifyRole } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/mark", verifyUser, markAttendance);

router.get("/myAttendance", verifyUser, getMyAttendance);

router.get("/user/:userId", verifyUser, verifyRole("admin"), getUserAttendance);

export default router;
