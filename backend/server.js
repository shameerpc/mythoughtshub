import express from "express";
const app=express();
const PORT = process.env.PORT || 4000;
import userRoutes from "./routes/userRoutes.js"
import blogRoutes from "./routes/blogRoutes.js"
import connectDB from "./config/connection.js"; // Import the function
import cors from "cors";
import dotenv from "dotenv";
import commentRoutes from "./routes/commentRoutes.js"
const FRONTEND_URL = process.env.FRONTEND_URL || '*';

dotenv.config();


app.use("/uploads", express.static("uploads"));
// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors({ origin: FRONTEND_URL, credentials: true }));


// Connect to MongoDB
connectDB();


app.use("/api",userRoutes)
app.use("/api/blog",blogRoutes)
app.use("/api/blogs",commentRoutes)

app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`)
})