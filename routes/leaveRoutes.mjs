import express from "express";
import { applyLeave, getMyLeaves, getAllLeaves, updateLeaveStatus } from "../controllers/leaveController.mjs";
import { verifyUser, verifyRole } from "../middleware/authMiddleware.mjs";

const router = express.Router();


router.post("/applyForLeave", verifyUser, applyLeave);

router.get("/myLeaves", verifyUser, getMyLeaves);

router.get("/allLeaves", verifyUser, verifyRole("admin"), getAllLeaves);

router.put("/status/:leaveId", verifyUser, verifyRole("admin"), updateLeaveStatus);

export default router;
