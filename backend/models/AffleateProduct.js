import mongoose from "mongoose";

const afiliateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    originalPrice: String,
    discount: String,
    rating: {
      type: Number,
      default: 4
    },
    affiliateLink: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: "general"
    },
    isFeatured: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// 🔥 Auto slug generate
afiliateSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
});

export default mongoose.model("AffiliateProduct", afiliateSchema);