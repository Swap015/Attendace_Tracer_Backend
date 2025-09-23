import bcrypt from "bcryptjs";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtil.mjs";

const isProduction = process.env.NODE_ENV === "production";

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({ msg: "User Registered" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        if (role && role !== user.role) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) return res.status(400).json({ message: "Invalid credentials" });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 2 * 60 * 60 * 1000
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 10 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            msg: "Login successful",
            accessToken,
            refreshToken,
            role: user.role,
            name: user.name,
            email: user.email
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const logoutUser = async (req, res) => {

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(401).json({ msg: "user not found" });
        }
        user.refreshToken = null;
        await user.save();
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        });

        res.status(200).json({ msg: "Logged Out" });
    }
    catch (err) {
        res.status(400).json({ msg: "Logout failed" });
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ msg: "user not found" });
        }
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json({ msg: "Failed to get user." });
    }
}

export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({ msg: "No refresh token" });

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== token) {
            return res.status(403).json({ msg: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 2 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            maxAge: 10 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            msg: "New access token issued",
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (err) {
        return res.status(403).json({ msg: "Invalid or expired refresh token" });
    }
};
