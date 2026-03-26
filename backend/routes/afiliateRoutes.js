import express from "express";
import {
  createProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct
} from "../controllers/afiliateController.js";

const router = express.Router();

// CREATE
router.post("/", createProduct);

// GET ALL
router.get("/", getAllProducts);

// GET FEATURED (Top Deals)
router.get("/featured", getFeaturedProducts);

// GET SINGLE
router.get("/:slug", getProductBySlug);

// UPDATE
router.put("/:id", updateProduct);

// DELETE
router.delete("/:id", deleteProduct);

export default router;