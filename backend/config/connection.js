import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // We removed the options object. Mongoose handles this automatically now.
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit process on failure
  }
};

export default connectDB;