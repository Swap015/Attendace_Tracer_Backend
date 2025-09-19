import express from "express";
import { register, login, getUser, logoutUser } from "../controllers/userController.mjs";
import { verifyUser } from "../middleware/authMiddleware.mjs";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", verifyUser, getUser);
router.post("/logout", verifyUser, logoutUser);



export default router;