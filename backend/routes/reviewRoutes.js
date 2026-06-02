import express from "express";
import { createReview, getReviews } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/autherization.js";

const router = express.Router();

router.get("/", getReviews);
router.post("/", authMiddleware, createReview);

export default router;
