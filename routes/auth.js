import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();
// ✅ USER REGISTER API
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    // Save user
    const user = new User({ username, email, password: hashed });
    await user.save();
    res.json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});
// ✅ USER LOGIN API
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT secret not configured" });
    }
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    // Compare passwords
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ msg: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET, // from .env
      { expiresIn: "7d" }
    );
    // Set httpOnly cookie for session-style auth
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.json({
      msg: "Login successful",
      token: token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// ✅ USER LOGOUT API
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    });
    return res.json({ msg: "Logged out successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", err });
  }
});

// ✅ GET ALL USERS (without passwords)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ msg: "Server error", err });
  }
});

export default router;
