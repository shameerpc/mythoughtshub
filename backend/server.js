import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connection.js";

// Import Routes
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import afiliateRoutes from "./routes/afiliateRoutes.js";



dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// --- 1. Connect to Database ---
connectDB();

// --- 2. Middleware Setup ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// --- 3. CORS CONFIGURATION (CRITICAL FIX) ---
// This list must include your Localhost for development
const allowedOrigins = [
  process.env.FRONTEND_URL, // Your live site (e.g., https://mythoughtshub.vercel.app)
  "http://localhost:3000",  // Local React
  "http://localhost:5173"   // Local Vite
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true // Required if you are sending cookies/tokens
}));

// --- 4. API Routes ---
app.use("/api", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/blogs", commentRoutes); // Note: Ensure this route doesn't conflict with blog routes
app.use("/api/category", categoryRoutes);
app.use("/api/affiliate", afiliateRoutes);

// --- 5. Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});