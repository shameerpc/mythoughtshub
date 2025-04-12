import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      unique: true,
      trim: true,
    },
    is_active: {
      type: Boolean,
      required: true,
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

// Optional: Indexes for faster querying
blogSchema.index({ creator: 1 });
blogSchema.index({ is_active: 1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
