import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { generateAccessToken, generateRefreshToken } from "../utils/tokenUtil.mjs";


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

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) return res.status(400).json({ message: "Invalid credentials" });

        if (role && role !== user.role) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 2 * 60 * 60 * 1000
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 10 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ msg: "Login successful", accessToken, refreshToken });
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
            secure: false,
            sameSite: "lax"
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
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