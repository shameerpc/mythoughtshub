import express from "express";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import authMiddleware from "../middleware/autherization.js";


const router = express.Router();

// Public / protected based on your auth setup
router.post("/",  authMiddleware,  createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.put("/:id",  authMiddleware,  updateBlog);
router.delete("/:id",  authMiddleware,  deleteBlog);

export default router;
