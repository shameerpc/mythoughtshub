import mongoose from "mongoose";

const affiliateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    // 🔥 ONE FIELD for both images & videos
 media: [
  {
    url: String,
    type: {
      type: String,
      enum: ["image", "video"]
    },
    public_id: String // 🔥 IMPORTANT
  }
],

    price: {
      type: String,
      required: true,
    },

    originalPrice: String,
    discount: String,

    rating: {
      type: Number,
      default: 4,
    },

    affiliateLink: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      default: "general",
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 🔥 Better slug
affiliateSchema.pre("save", function (next) {
  if (this.isModified("name") || !this.slug) {
    this.slug =
      this.name.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Date.now();
  }
  next();
});

export default mongoose.model("AffiliateProduct", affiliateSchema);
