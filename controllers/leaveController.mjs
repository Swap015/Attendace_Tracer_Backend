import Leave from "../models/leave.js";


export const applyLeave = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { from, to, reason } = req.body;

        const leave = await Leave.create({
            user: userId,
            from,
            to,
            reason,
        });

        res.status(201).json({ msg: "Leave applied successfully", leave });
    } catch (err) {
        res.status(500).json({ msg: "Error applying leave", error: err.message });
    }
};


export const getMyLeaves = async (req, res) => {
    try {
        const userId = req.user.userId;
        const leaves = await Leave.find({ user: userId }).sort({ appliedAt: -1 });

        res.status(200).json({ msg: "Fetched leave records", leaves });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching leaves", error: err.message });
    }
};

//  Admin
export const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .sort({ appliedAt: -1 })
            .populate("user", "name email role");

        res.status(200).json({ msg: "Fetched all leave requests", leaves });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching all leaves", error: err.message });
    }
};

//  Admin
export const updateLeaveStatus = async (req, res) => {
    try {
        const { leaveId } = req.params;
        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ msg: "Invalid status" });
        }

        const leave = await Leave.findByIdAndUpdate(
            leaveId,
            { status },
            { new: true }
        );

        res.status(200).json({ msg: `Leave ${status}`, leave });
    } catch (err) {
        res.status(500).json({ msg: "Error updating leave status", error: err.message });
    }
};
