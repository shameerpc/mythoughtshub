import Comment from "../models/Comment.js";

// Create a new blog
export const createComment = async (req, res) => {
  try {
    const { id } = req.params; // blog ID
    const { content } = req.body;

        console.log("💬 Creating comment for blog ID:", id);
    console.log("📩 Comment content:", content);
    console.log("👤 User (req.user):", req.user);

    // Validate: optional
    if (!content || !id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const comment = new Comment({
      blog: id,
      content,
      creator: req.user.id, // req.user must be set by middleware
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: "Comment created",
      newComment: comment, // return the actual saved comment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get all blogs
export const getAllComment = async (req, res) => {
  try {
    const comments = await Comment.find({ delete_status: false }).populate("creator", "username email");
    res.status(200).json({success:true,message:"Comment retrieved successfully",response:comments});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single blog
export const getCommentById = async (req, res) => {
   try {
    const blogId = req.params.id;

    const comments = await Comment.find({ blog: blogId, delete_status: false })
      .populate("creator", "username email") // Include user info
      .sort({ createdAt: -1 })
        .select("content creator createdAt");

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

 export const updateComment = async (req, res) => {
  try {
    const comments = await Comment.findById(req.params.id);

    if (!comments || comments.delete_status) return res.status(404).json({ error: "Comment not found" });

    // Validate that required fields are present in req.body
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    // Update the blog with the request data
    Object.assign(blog, req.body);
    await blog.save();

    res.status(200).json({ message: "comments updated", blog });
  } catch (err) {
    console.error("Error updating blog:", err);
    res.status(500).json({ error: err.message });
  }
};



// Soft delete
export const deleteComment = async (req, res) => {
  try {
    const comments = await Comment.findById(req.params.id);
    if (!comments || comments.delete_status) return res.status(404).json({ error: "Comment not found" });

    comments.delete_status = true;
    await comments.save();

    res.status(200).json({ message: "comments deleted (soft)",comments:blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
