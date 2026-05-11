import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} from "../controllers/afiliateController.js";

const router = express.Router();

// ✅ CREATE with multiple files
router.post("/", upload.array("media", 10), createProduct);

// GET ALL
router.get("/", getAllProducts);

// FEATURED
router.get("/featured", getFeaturedProducts);

// SINGLE
router.get("/:slug", getProductBySlug);

// ✅ UPDATE with optional files
router.put("/:id", upload.array("media", 10), updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

export default router;