import { UserTable } from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import logger from "../config/winston.js"
export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2️⃣ Check if user already exists
    const existingUser = await UserTable.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 3️⃣ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create new user
    const newUser = await UserTable.create({ email, password: hashedPassword });

     logger.info(`✅ User registered Using: ${email}`);

    // 5️⃣ Return response (never send back password)
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    return res.status(500).json({ message: "Internal Server Error",error: error.message, });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2️⃣ Check if user exists
    const user = await UserTable.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3️⃣ Compare password with hashed password in DB
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4️⃣ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "helloworld", // 👈 must be set in .env file
      { expiresIn: "1d" } // token valid for 1 day
    );

    // Log successful login
     logger.info(`✅ User logged in: ${email}`);


    // 5️⃣ Respond with user data (without password)
    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email },
      token,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error",error: error.message, });
  }
};