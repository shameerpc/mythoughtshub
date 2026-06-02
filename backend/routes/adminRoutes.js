import express from "express";
import {
  deleteBlogAdmin,
  deleteCommentAdmin,
  deleteUser,
  getBlogs,
  getComments,
  getDashboardStats,
  getUsers,
  login,
  updateBlogAdmin,
  updateCommentAdmin,
  updateUser,
} from "../controllers/adminController.js";
import {
  deleteReview,
  getAdminReviews,
  updateReview,
} from "../controllers/reviewController.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../controllers/afiliateController.js";
import authMiddleware from "../middleware/autherization.js";
import requireAdmin from "../middleware/requireAdmin.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireAdmin];

router.post("/login", login);

router.get("/stats", adminOnly, getDashboardStats);

router.get("/users", adminOnly, getUsers);
router.patch("/users/:id", adminOnly, updateUser);
router.delete("/users/:id", adminOnly, deleteUser);

router.get("/blogs", adminOnly, getBlogs);
router.patch("/blogs/:id", adminOnly, updateBlogAdmin);
router.delete("/blogs/:id", adminOnly, deleteBlogAdmin);

router.get("/comments", adminOnly, getComments);
router.patch("/comments/:id", adminOnly, updateCommentAdmin);
router.delete("/comments/:id", adminOnly, deleteCommentAdmin);

router.get("/reviews", adminOnly, getAdminReviews);
router.patch("/reviews/:id", adminOnly, updateReview);
router.delete("/reviews/:id", adminOnly, deleteReview);

router.get("/affiliates", adminOnly, getAllProducts);
router.get("/affleates", adminOnly, getAllProducts); // Alias for spelling variations

router.post("/affiliates", adminOnly, upload.array("media", 10), createProduct);
router.post("/affleates", adminOnly, upload.array("media", 10), createProduct);

router.put("/affiliates/:id", adminOnly, upload.array("media", 10), updateProduct);
router.put("/affleates/:id", adminOnly, upload.array("media", 10), updateProduct);

router.delete("/affiliates/:id", adminOnly, deleteProduct);
router.delete("/affleates/:id", adminOnly, deleteProduct);

export default router;
