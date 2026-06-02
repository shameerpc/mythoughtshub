import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByCategorySlug,
  getMyBlogs,
  likeBlog
} from "../controllers/blogController.js";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/autherization.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        ...decoded,
        _id: decoded.id
      };
    } catch (err) {
      // ignore and proceed as guest
    }
  }
  next();
};



// Accept up to 5 images
router.post("/",authMiddleware, upload.array("images", 5), createBlog);

// For updates:
router.patch("/:id",authMiddleware, upload.array("images", 5), updateBlog);

// Read
router.get("/", getAllBlogs);

// CRITICAL: /category/:slug must come BEFORE /:id
router.get("/category/:slug", getBlogsByCategorySlug); 
router.get("/user/me", authMiddleware, getMyBlogs);

router.get("/:id", getBlogById);
router.post("/:id/like", optionalAuth, likeBlog);


// Delete
router.delete("/:id", authMiddleware, deleteBlog);
router.post("/:id", authMiddleware, deleteBlog);

export default router;
