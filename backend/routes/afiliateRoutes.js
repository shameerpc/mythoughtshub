import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  updateProduct,
} from "../controllers/afiliateController.js";
import authMiddleware from "../middleware/autherization.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireAdmin];

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:slug", getProductBySlug);

router.post("/", adminOnly, upload.array("media", 10), createProduct);
router.put("/:id", adminOnly, upload.array("media", 10), updateProduct);
router.delete("/:id", adminOnly, deleteProduct);

export default router;
