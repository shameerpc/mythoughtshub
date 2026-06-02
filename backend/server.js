import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import fs from "fs"; // Import fs to check/create directories
import path from "path";
import connectDB from "./config/connection.js";

// Import Routes
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import afiliateRoutes from "./routes/afiliateRoutes.js";
import contactRoutes from "./routes/contact.routes.js";
import adminRoutes from "./routes/adminRoutes.js"
import reviewRoutes from "./routes/reviewRoutes.js";
import qnaRoutes from "./routes/qnaRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

// 2. Connect to Database
connectDB();

// 3. Ensure /tmp/uploads exists (Sync with Controller logic)
// This is necessary because the controller saves to /tmp/uploads
const uploadDir = "/tmp/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`📁 Ensured directory exists: ${uploadDir}`);
}

// 4. Middleware Setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SERVE STATIC FILES
// Maps URL '/uploads' -> Physical Folder '/tmp/uploads'
// This ensures images saved by the controller are accessible to the frontend
app.use("/uploads", express.static(uploadDir));

// 5. CORS CONFIGURATION
const allowedOrigins = [
  process.env.FRONTEND_URL, 
  "http://localhost:3000",  
  "http://localhost:5173"   
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// 6. API Routes
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/blogs", commentRoutes); 
app.use("/api/category", categoryRoutes);
app.use("/api/affiliate", afiliateRoutes);
app.use("/api/afiliate", afiliateRoutes);  // Spelling alias
app.use("/api/affleate", afiliateRoutes);  // Spelling alias
app.use("/api/reviews", reviewRoutes);
app.use("/api/qna", qnaRoutes);


app.use("/api/contact", contactRoutes);

// 7. Global Error Handling (Good Practice)
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

// 8. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
