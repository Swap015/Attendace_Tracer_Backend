import Attendance from "../models/attendance.js";


export const markAttendance = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const today = new Date().toISOString().split("T")[0]; 

        let attendance = await Attendance.findOne({ user: userId, date: today });

        if (!attendance) {
   
            attendance = await Attendance.create({
                user: userId,
                date: today,
                punchIn: new Date(),
                status: "present",
                isLate: new Date().getHours() > 9,
            });
            return res.status(201).json({ msg: "Punch In recorded", attendance });
        }

        if (!attendance.punchOut) {
            attendance.punchOut = new Date();
            await attendance.save();
            return res.status(200).json({ msg: "Punch Out recorded", attendance });
        }

        return res.status(400).json({ msg: "Already punched in & out for today" });
    } catch (err) {
        res.status(500).json({ msg: "Error marking attendance", error: err.message });
    }
};


export const getMyAttendance = async (req, res) => {
    try {
        const userId = req.user.userId;
        const records = await Attendance.find({ user: userId }).sort({ date: -1 });

        res.status(200).json({ msg: "Attendance records fetched", records });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching attendance", error: err.message });
    }
};

export const getUserAttendance = async (req, res) => {
    try {
        const { userId } = req.params;
        const records = await Attendance.find({ user: userId }).sort({ date: -1 }).populate("user", "name email");

        res.status(200).json({ msg: "User attendance records fetched", records });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching user attendance", error: err.message });
    }
};
