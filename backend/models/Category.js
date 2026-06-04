import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "📁",
    },
  },
  { timestamps: true }
);

// ✅ AUTO GENERATE UNIQUE SLUG (FIXED)
categorySchema.pre("save", async function (next) {
  if (this.isModified("name") || !this.slug) {
    let baseSlug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    let slug = baseSlug;
    let count = 1;

    // ensure unique slug (exclude current document itself)
    while (await mongoose.models.Category.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;