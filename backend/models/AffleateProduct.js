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

    // 📌 Pinterest SEO & Open Graph fields
    pinTitle: {
      type: String,
      maxLength: 100,
    },
    pinDescription: {
      type: String,
      maxLength: 500,
    },
    pinAltText: {
      type: String,
    },
    pinTags: {
      type: [String],
      default: [],
    },
    pinImage: {
      url: String,
      type: {
        type: String,
        default: "image",
      },
      public_id: String,
    },
    ogTitle: {
      type: String,
    },
    ogDescription: {
      type: String,
    },
    ogImage: {
      url: String,
      type: {
        type: String,
        default: "image",
      },
      public_id: String,
    },

    // 🤖 AI SEO generated metadata
    socialSharing: {
      pinterest: String,
      facebook: String,
      linkedin: String,
      twitter: String,
      whatsapp: String,
      telegram: String,
    },
    imageSeo: {
      filename: String,
      altText: String,
      title: String,
      caption: String,
    },
    seoScore: {
      pinterestScore: { type: Number, default: 0 },
      ogScore: { type: Number, default: 0 },
      imageScore: { type: Number, default: 0 },
      overallScore: { type: Number, default: 0 },
    },
    trendSuggestions: {
      keywords: { type: [String], default: [] },
      tags: { type: [String], default: [] },
      contentAngles: { type: [String], default: [] },
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
