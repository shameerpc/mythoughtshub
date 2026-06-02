import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import AffiliateProduct from "../models/AffleateProduct.js";
import Review from "../models/Review.js";

const asNumber = (value) => (Array.isArray(value) && value[0]?.total ? value[0].total : 0);

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase(), role: "ADMIN" });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({
      token,
      user: { id: user._id, role: user.role, email: user.email, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [
      users,
      blogs,
      publishedBlogs,
      comments,
      pendingComments,
      products,
      reviews,
      pendingReviews,
      viewsAgg,
      recentBlogs,
      recentComments,
      recentReviews,
    ] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments({ delete_status: false }),
      Blog.countDocuments({ delete_status: false, is_published: true }),
      Comment.countDocuments({ delete_status: false }),
      Comment.countDocuments({ delete_status: false, is_active: false }),
      AffiliateProduct.countDocuments(),
      Review.countDocuments({ delete_status: false }),
      Review.countDocuments({ delete_status: false, is_active: false }),
      Blog.aggregate([
        { $match: { delete_status: false } },
        { $group: { _id: null, total: { $sum: "$views" } } },
      ]),
      Blog.find({ delete_status: false }).populate("creator", "username email").sort({ createdAt: -1 }).limit(5),
      Comment.find({ delete_status: false }).populate("creator", "username email").populate("blog", "title").sort({ createdAt: -1 }).limit(5),
      Review.find({ delete_status: false }).populate("product", "name").sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      stats: {
        users,
        blogs,
        publishedBlogs,
        comments,
        pendingComments,
        products,
        reviews,
        pendingReviews,
        totalViews: asNumber(viewsAgg),
      },
      recent: {
        blogs: recentBlogs,
        comments: recentComments,
        reviews: recentReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, response: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const update = {};
    if (username) update.username = username;
    if (email) update.email = email;
    if (role && ["USER", "ADMIN"].includes(role)) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, result: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === String(req.admin._id)) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "all";
    const query = { delete_status: false };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (status === "published") query.is_published = true;
    if (status === "draft") query.is_published = false;

    const blogs = await Blog.find(query)
      .populate("category", "name slug")
      .populate("creator", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, response: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBlogAdmin = async (req, res) => {
  try {
    const allowed = ["title", "description", "category", "is_published", "tags"];
    const update = {};
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    });

    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, delete_status: false },
      update,
      { new: true, runValidators: true }
    )
      .populate("category", "name slug")
      .populate("creator", "username email");

    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, result: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBlogAdmin = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.delete_status) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    blog.delete_status = true;
    await blog.save();
    res.json({ success: true, message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const status = req.query.status || "all";
    const query = { delete_status: false };
    if (status === "active") query.is_active = true;
    if (status === "hidden") query.is_active = false;

    const comments = await Comment.find(query)
      .populate("creator", "username email")
      .populate("blog", "title")
      .sort({ createdAt: -1 });

    res.json({ success: true, response: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCommentAdmin = async (req, res) => {
  try {
    const update = {};
    if (typeof req.body.content === "string") update.content = req.body.content.trim();
    if (typeof req.body.is_active === "boolean") update.is_active = req.body.is_active;

    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id, delete_status: false },
      update,
      { new: true, runValidators: true }
    )
      .populate("creator", "username email")
      .populate("blog", "title");

    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });
    res.json({ success: true, result: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCommentAdmin = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment || comment.delete_status) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    comment.delete_status = true;
    await comment.save();
    res.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
