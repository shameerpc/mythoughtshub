import Blog from "../models/Blog.js";
import Category from "../models/Category.js";

// Create
export const createBlog = async (req, res) => {
  try {
    const { title, description, is_active, category } = req.body;

    // Basic validation
    if (!title || !description || !category) {
      return res.status(400).json({ error: "Title, Description, and Category are required" });
    }

    const blog = new Blog({
      title,
      description,
      category, // This should be the Category ID
      image: req.file ? `/uploads/${req.file.filename}` : null,
      is_active,
      creator: req.user.id,
    });

    await blog.save();
    // Populate category details before sending back
    await blog.populate("category", "name slug");

    res.status(201).json({
      success: true,
      message: "Blog created",
      result: blog,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ delete_status: false })
      .populate("creator", "username email")
      .populate("category", "name slug"); // Populate category
    res.status(200).json({success:true, message:"Blogs retrieved", response:blogs});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("creator", "name email")
      .populate("category", "name slug");

    if (!blog || blog.delete_status)
      return res.status(404).json({ error: "Blog not found" });

    res.status(200).json({
      success: true,
      response: blog,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Blogs by Category SLUG (For the Category Page)
export const getBlogsByCategorySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // 1. Find the category by slug first
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // 2. Find blogs that reference this category's ID
    const blogs = await Blog.find({
      category: category._id,
      delete_status: false,
    })
      .populate("creator", "username email")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      category: category,
      blogs: blogs,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.delete_status) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const { title, description, category, is_active } = req.body;

    // Explicit updates
    if (title) blog.title = title;
    if (description) blog.description = description;
    if (category) blog.category = category;
    if (is_active !== undefined) blog.is_active = is_active;

    if (req.file) {
      blog.image = `/uploads/${req.file.filename}`;
    }

    await blog.save();
    await blog.populate("category", "name slug");

    res.status(200).json({
      success: true,
      message: "Blog updated",
      blog,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete (Fixed Typo)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.delete_status) return res.status(404).json({ error: "Blog not found" });

    blog.delete_status = true;
    await blog.save();

    // FIXED: changed 'bog' to 'blog'
    res.status(200).json({ success: true, message: "Blog deleted (soft)", blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};