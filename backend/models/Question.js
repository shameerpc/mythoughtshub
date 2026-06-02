import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    upvotedUsers: [
      {
        type: String, // User ID or IP address
      },
    ],
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
      index: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
