import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogsByCategorySlug,
  getMyBlogs
} from "../controllers/blogController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/autherization.js";

const router = express.Router();



// Accept up to 5 images
router.post("/",authMiddleware, upload.array("images", 5), createBlog);

// For updates:
router.patch("/:id",authMiddleware, upload.array("images", 5), updateBlog);

// Read
router.get("/", getAllBlogs);

// CRITICAL: /category/:slug must come BEFORE /:id
router.get("/category/:slug", getBlogsByCategorySlug); 

router.get("/:id", getBlogById);


// Delete
router.post("/:id", authMiddleware, deleteBlog);

router.get("/user/me", authMiddleware, getMyBlogs);

export default router;