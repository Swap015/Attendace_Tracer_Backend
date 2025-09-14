import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    from: {
        type: String, 
        required: true,
    },
    to: {
        type: String, 
        required: true,
    },
    reason: {
        type: String,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    appliedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Leave", LeaveSchema);
