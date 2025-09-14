import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register / Signup
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Email already registered" });

        // hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // create user
        const newUser = new User({ name, email, passwordHash, role });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        // compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Logout
export const logout = async (req, res) => {
    // With JWT, logout is handled on client side by removing token
    res.status(200).json({ message: "Logged out successfully" });
};

// Get single user
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-passwordHash");
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
