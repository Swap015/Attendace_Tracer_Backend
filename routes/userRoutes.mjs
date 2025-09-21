import express from "express";
import { register, login, getUser, logoutUser, refreshToken } from "../controllers/userController.mjs";
import { verifyUser } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyUser, getUser);
router.post("/logout", verifyUser, logoutUser);
router.post("/refresh", refreshToken);


export default router;