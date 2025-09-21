
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export const sendLateEmail = async (to, name, checkInTime) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject: "Late Attendance Alert ",
        text: `Hello ${name},\n\nYou checked in late today at ${checkInTime.toLocaleTimeString()}.\nPlease be punctual.\n\nRegards,\nAttendance Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Late email sent to ${to}`);
    } catch (err) {
        console.error("Email send error:", err.message);
    }
};


export const sendLeaveStatusEmail = async (to, name, status, reason = "") => {
    const subject = `Leave ${status.toUpperCase()}`;
    const text =
        status === "approved"
            ? `Hello ${name},\n\nYour leave has been approved.\n\nRegards,\nHR Team`
            : `Hello ${name},\n\nYour leave has been rejected.\nReason: ${reason}\n\nRegards,\nHR Team`;

    try {
        await transporter.sendMail({ from: EMAIL_USER, to, subject, text });
        console.log(`Leave status email sent to ${to}`);
    } catch (err) {
        console.error("Error sending leave status email:", err.message);
    }
};

