import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";

export const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!id || !content?.trim()) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const blog = await Blog.findOne({ _id: id, delete_status: false });
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const comment = new Comment({
      blog: id,
      content: content.trim(),
      creator: req.user.id,
    });

    await comment.save();
    await comment.populate("creator", "username email");

    res.status(201).json({
      success: true,
      message: "Comment created",
      newComment: comment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllComment = async (req, res) => {
  try {
    const comments = await Comment.find({ delete_status: false })
      .populate("creator", "username email")
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Comments retrieved successfully",
      response: comments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCommentById = async (req, res) => {
  try {
    const blogId = req.params.id;

    const comments = await Comment.find({ blog: blogId, delete_status: false })
      .populate("creator", "username email")
      .sort({ createdAt: -1 })
      .select("content creator createdAt updatedAt is_active");

    res.status(200).json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment || comment.delete_status) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (typeof req.body.content === "string") {
      if (!req.body.content.trim()) {
        return res.status(400).json({ error: "Content is required" });
      }
      comment.content = req.body.content.trim();
    }

    if (typeof req.body.is_active === "boolean") {
      comment.is_active = req.body.is_active;
    }

    await comment.save();
    await comment.populate("creator", "username email");

    res.status(200).json({
      success: true,
      message: "Comment updated",
      comment,
    });
  } catch (err) {
    console.error("Error updating comment:", err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment || comment.delete_status) {
      return res.status(404).json({ error: "Comment not found" });
    }

    comment.delete_status = true;
    await comment.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted (soft)",
      comment,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
