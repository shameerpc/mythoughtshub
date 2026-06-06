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
  generateProductSeo,
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
router.post("/affiliates/generate-seo", adminOnly, generateProductSeo);

const uploadFields = upload.fields([
  { name: "media", maxCount: 10 },
  { name: "pinImage", maxCount: 1 },
  { name: "ogImage", maxCount: 1 }
]);

router.post("/affiliates", adminOnly, uploadFields, createProduct);
router.post("/affleates", adminOnly, uploadFields, createProduct);

router.put("/affiliates/:id", adminOnly, uploadFields, updateProduct);
router.put("/affleates/:id", adminOnly, uploadFields, updateProduct);

router.delete("/affiliates/:id", adminOnly, deleteProduct);
router.delete("/affleates/:id", adminOnly, deleteProduct);

export default router;
