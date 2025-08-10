import express from "express";
const app=express();
const PORT=3000
import userRoutes from "./routes/userRoutes.js"
import blogRoutes from "./routes/blogRoutes.js"
import connectDB from "./config/connection.js"; // Import the function
import cors from "cors";
import dotenv from "dotenv";
import commentRoutes from "./routes/commentRoutes.js"


dotenv.config();



// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

// Connect to MongoDB
connectDB();


app.use("/api",userRoutes)
app.use("/api/blog",blogRoutes)
app.use("/api/blogs",commentRoutes)

app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`)
})