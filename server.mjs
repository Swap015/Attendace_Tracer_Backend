import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import attendanceRoutes from "./routes/attendanceRoutes.mjs"
import userRoutes from "./routes/userRoutes.mjs"
import leaveRoutes from "./routes/leaveRoutes.mjs"
import dotenv from "dotenv";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));


// Routes

app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));