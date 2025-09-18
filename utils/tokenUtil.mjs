import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRY = process.env.ACCESS_EXPIRY;
const REFRESH_EXPIRY = process.env.REFRESH_EXPIRY;

export const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        JWT_ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRY }
    );
};

export const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_EXPIRY }
    );
};
