import express from "express";
import { register, login,profile,updateProfile } from "../controllers/userController.js";
import authMiddleware from "../middleware/autherization.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, profile);
router.put("/me", authMiddleware, updateProfile);

export default router;
