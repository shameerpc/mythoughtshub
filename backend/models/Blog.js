import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      index: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: 200,
      default: "",
    },
    // ✅ UPDATED: Support multiple images with Alt text
    images: [{
      url: {
        type: String,
        required: true
      },
      alt: {
        type: String,
        default: "" // For SEO
      }
    }],
    description: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    likedIPs: [{
      type: String,
    }],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_published: {
      type: Boolean,
      default: true,
    },
    delete_status: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;