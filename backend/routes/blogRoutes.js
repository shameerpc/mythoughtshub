import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByCategorySlug,
} from "../controllers/blogController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/autherization.js";

const router = express.Router();

// Create
router.post("/", authMiddleware, upload.single("image"), createBlog);

// Read
router.get("/", getAllBlogs);

// CRITICAL: /category/:slug must come BEFORE /:id
router.get("/category/:slug", getBlogsByCategorySlug); 

router.get("/:id", getBlogById);

// Update
router.put("/:id", authMiddleware, upload.single("image"), updateBlog);

// Delete
router.delete("/:id", authMiddleware, deleteBlog);

export default router;