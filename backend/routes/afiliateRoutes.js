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

const uploadFields = upload.fields([
  { name: "media", maxCount: 10 },
  { name: "pinImage", maxCount: 1 },
  { name: "ogImage", maxCount: 1 }
]);

router.post("/", adminOnly, uploadFields, createProduct);
router.put("/:id", adminOnly, uploadFields, updateProduct);
router.delete("/:id", adminOnly, deleteProduct);

export default router;
