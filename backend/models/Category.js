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

// ✅ AUTO GENERATE UNIQUE SLUG
categorySchema.pre("save", async function (next) {
  if (this.name) {
    let baseSlug = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    let slug = baseSlug;
    let count = 1;

    // ensure unique slug
    while (await mongoose.models.Category.findOne({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }
  next();
});

const Category = mongoose.model("Category", categorySchema);

export default Category;