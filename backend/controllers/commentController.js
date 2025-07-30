import Comment from "../models/Comment.js";

// Create a new blog
export const createComment = async (req, res) => {
  try {
    console.log(req.user)
    const { blog }=req.params.body;
    const { content, is_active } = req.body;

    const comment = new Comment({
      blog,
      content,
      is_active,
      creator: req.user.id, // assuming you’re using auth middleware
    });

    await comment.save();
    res.status(201).json({ success:true, message: "comment created", result:blog });
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
    const comments = await Comments.findById(req.params.id).populate("creator", "name email");
    if (!comments || comments.delete_status) return res.status(404).json({ error: "comments not found" });

    res.status(200).json({success:true,message:"comments retrieved successfully",response:comments});
  } catch (err) {
    res.status(500).json({ error: err.message });
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
