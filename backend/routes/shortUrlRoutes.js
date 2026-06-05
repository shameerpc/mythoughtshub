import express from "express";
import { shortenUrl, redirectUrl } from "../controllers/shortUrlController.js";

const router = express.Router();

// Route to generate a short link
router.post("/api/shorten", shortenUrl);

// Route to redirect a short link (at root level)
router.get("/s/:code", redirectUrl);

export default router;
