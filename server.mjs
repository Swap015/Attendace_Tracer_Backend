import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import attendanceRoutes from "./routes/attendanceRoutes.mjs"
import userRoutes from "./routes/userRoutes.mjs"
import leaveRoutes from "./routes/leaveRoutes.mjs"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "https://attendace-tracer-frontend-b51hpzrjm-swapnil-motghares-projects.vercel.app",
    credentials: true,
}));


// Connect MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected ✅✅"))
    .catch(err => console.error(err));


// Routes

app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));