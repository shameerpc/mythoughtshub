import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: "AffiliateProduct",
      required: true,
      index: true,
    },
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    delete_status: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
