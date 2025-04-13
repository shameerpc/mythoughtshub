import Blog from "../models/Blog.js";

// Create a new blog
export const createBlog = async (req, res) => {
  try {
    console.log(req.user)
    const { title, description, is_active } = req.body;

    const blog = new Blog({
      title,
      description,
      is_active,
      creator: req.user.id, // assuming you’re using auth middleware
    });

    await blog.save();
    res.status(201).json({ success:true, message: "Blog created", result:blog });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ delete_status: false }).populate("creator", "username email");
    res.status(200).json({success:true,message:"Blog retrieved successfully",response:blogs});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single blog
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("creator", "name email");
    if (!blog || blog.delete_status) return res.status(404).json({ error: "Blog not found" });

    res.status(200).json({success:true,message:"Blog retrieved successfully",response:blog});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

 export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog || blog.delete_status) return res.status(404).json({ error: "Blog not found" });

    // Validate that required fields are present in req.body
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    // Update the blog with the request data
    Object.assign(blog, req.body);
    await blog.save();

    res.status(200).json({ message: "Blog updated", blog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(400).json({ error: err.message });
  }
};



// Soft delete
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.delete_status) return res.status(404).json({ error: "Blog not found" });

    blog.delete_status = true;
    await blog.save();

    res.status(200).json({ message: "Blog deleted (soft)",bog:blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
