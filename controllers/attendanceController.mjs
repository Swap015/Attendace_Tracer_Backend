import Attendance from "../models/attendance.js";
import User from "../models/user.js";
import { sendLateEmail } from "../utils/emailService.mjs";

export const markAttendance = async (req, res) => {
    try {
        const userId = req.user.userId;
        const today = new Date().toISOString().split("T")[0];

        const officeStartTime = new Date();
        officeStartTime.setHours(10, 0, 0, 0);

        let attendance = await Attendance.findOne({ user: userId, date: today });

        if (!attendance) {
            const checkInTime = new Date();

            attendance = await Attendance.create({
                user: userId,
                date: today,
                checkIn: checkInTime,
                status: "present",
                isLate: checkInTime > officeStartTime,
            });

            //mail
            if (attendance.isLate) {
                const user = await User.findById(userId);
                await sendLateEmail(user.email, user.name, checkInTime);
            }

            return res.status(201).json({ msg: "check In recorded", attendance });
        }

        if (!attendance.checkOut) {
            attendance.checkOut = new Date();
            await attendance.save();
            return res.status(200).json({ msg: "check Out recorded", attendance });
        }

        return res.status(400).json({ msg: "Already checked in & out for today" });
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


export const getLateEmployees = async (req, res) => {
    try {
        const today = new Date().toISOString().split("T")[0]; 
        const lateRecords = await Attendance.find({ date: today, isLate: true })
            .populate("user", "name email"); 
        res.status(200).json({ records: lateRecords });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching late employees", error: err.message });
    }
};