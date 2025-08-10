import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js"; // Ensure correct import path

// User Registration
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Registering:", { username, email });

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", response: newUser });
  } catch (error) {
    console.error("Error in register route:", error);
    res.status(500).json({ error: "Error registering user" });
  }
};


// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      console.log(token)
    res.json({ token, user: { id: user._id, role:user.role, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};
