import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    checkIn: {
        type: Date,
    },
    checkOut: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["present", "absent", "on-leave"],
        default: "present",
    },
    isLate: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model("Attendance", AttendanceSchema);
