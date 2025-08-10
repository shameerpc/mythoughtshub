import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Types.ObjectId,
      ref: "Blog",
    },
    content: {
      type: String,
      required: [true, "content is required"],
      // unique: true,
      // trim: true,
    },
    is_active: {
      type: Boolean,
          default: true,
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
commentSchema.index({ creator: 1 });
commentSchema.index({ is_active: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
