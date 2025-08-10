import express from "express";
import {
  createComment,
  getAllComment,
  getCommentById,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import authMiddleware from "../middleware/autherization.js";


const router = express.Router();

// Public / protected based on your auth setup
router.post("/:id/comment",  authMiddleware,  createComment);
router.get("/", getAllComment);
router.get("/:id/comments", authMiddleware,getCommentById);
router.put("/:id",  authMiddleware,  updateComment);
router.delete("/:id",  authMiddleware,  deleteComment);

export default router;