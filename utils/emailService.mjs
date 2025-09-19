import http from "http";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const server = http.createServer((req, res) => {
    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const PORT = process.env.PORT;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: EMAIL_USER,
        to: EMAIL_USER,
        subject: "Test Email",
        text: "This is a test email",
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("Error:", err);
            res.statusCode = 500;
            res.end("Failed to send email");
        } else {
            console.log("SUCCESS!", info.response);
            res.statusCode = 200;
            res.end("Email Sent Successfully");
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`);
});
