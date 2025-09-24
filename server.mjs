import express from "express";
import cors from "cors";
import attendanceRoutes from "./routes/attendanceRoutes.mjs"
import userRoutes from "./routes/userRoutes.mjs"
import leaveRoutes from "./routes/leaveRoutes.mjs"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./configs/db.mjs";


dotenv.config();
const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); 
        if (FRONTEND_URL.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"), false);
        }
    },
    credentials: true,
}));


// Connect MongoDB
connectDB();

// Routes

app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));