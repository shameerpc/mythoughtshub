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



// NEW: Get Profile Controller
export const profile = async (req, res) => {
  try {
    // 1. Get the user ID from the request object
    // (This is attached by your 'authMiddleware' or 'protect' function)
    const userId = req.user.id;

    // 2. Find the user by ID and select ONLY 'username' and 'email'
    const user = await User.findById(userId).select("username email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Return the user data
    res.status(200).json(user);
    
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const userId = req.user._id; // Get ID from the middleware

    // 1. Basic Validation
    if (!username || !email) {
      return res.status(400).json({ message: "Username and Email are required" });
    }

    // 2. Check if email is already taken by ANOTHER user
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      return res.status(400).json({ message: "Email is already in use by another account" });
    }

    // 3. Update User
    // { new: true } returns the updated document instead of the old one
    // { runValidators: true } ensures your Mongoose schema rules (like required fields) apply
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password from response

    res.status(200).json(updatedUser);

  } catch (error) {
    console.error("Error updating profile:", error);
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server Error" });
  }
};
