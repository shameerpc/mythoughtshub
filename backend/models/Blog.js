import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    image: { type: String, required: false }, 
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    is_active: {
      type: Boolean,
      default: true, // Set default to true
    },
    delete_status: {
      type: Boolean,
      default: false,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

blogSchema.index({ creator: 1 });
blogSchema.index({ category: 1 }); // Index for faster category queries

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;