import express from "express";
import {
  getQuestions,
  askQuestion,
  answerQuestion,
  upvoteAnswer,
} from "../controllers/qnaController.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        ...decoded,
        _id: decoded.id,
      };
    } catch (err) {
      // ignore, guest
    }
  }
  next();
};

router.get("/:blogId/questions", getQuestions);
router.post("/:blogId/questions", optionalAuth, askQuestion);
router.post("/questions/:questionId/answers", optionalAuth, answerQuestion);
router.post("/questions/:questionId/answers/:answerId/upvote", optionalAuth, upvoteAnswer);

export default router;
