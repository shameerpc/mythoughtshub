import Question from "../models/Question.js";
import Blog from "../models/Blog.js";

// 1. Get all questions for a specific blog
export const getQuestions = async (req, res) => {
  try {
    const { blogId } = req.params;

    const questions = await Question.find({ blog: blogId })
      .populate("user", "username email avatar")
      .populate("answers.user", "username email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, response: questions });
  } catch (error) {
    console.error("Get Questions Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Ask a question
export const askQuestion = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { body, userName } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, message: "Question content cannot be empty." });
    }

    const blogExists = await Blog.exists({ _id: blogId, delete_status: false });
    if (!blogExists) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    const userId = req.user?._id;
    // Fallback if not logged in
    const finalUserName = req.user?.username || userName || "Guest";

    const question = await Question.create({
      blog: blogId,
      body,
      userName: finalUserName,
      user: userId || null,
    });

    await question.populate("user", "username email avatar");

    res.status(201).json({ success: true, result: question });
  } catch (error) {
    console.error("Ask Question Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Answer a question
export const answerQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { body, userName } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({ success: false, message: "Answer content cannot be empty." });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    const userId = req.user?._id;
    const finalUserName = req.user?.username || userName || "Guest";

    const newAnswer = {
      body,
      userName: finalUserName,
      user: userId || null,
      upvotes: 0,
      upvotedUsers: [],
    };

    question.answers.push(newAnswer);
    await question.save();

    // Populate question user fields after save
    await question.populate("user", "username email avatar");
    await question.populate("answers.user", "username email avatar");

    // Return the newly added answer (the last element in answers array)
    const addedAnswer = question.answers[question.answers.length - 1];

    res.status(201).json({ success: true, result: addedAnswer });
  } catch (error) {
    console.error("Answer Question Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Upvote an answer
export const upvoteAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const userId = req.user?._id;
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown-ip";
    
    // Identifier to prevent multiple upvotes
    const voterId = userId ? userId.toString() : ip;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: "Question not found." });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ success: false, message: "Answer not found." });
    }

    // Initialize list if missing
    if (!answer.upvotedUsers) {
      answer.upvotedUsers = [];
    }

    const index = answer.upvotedUsers.indexOf(voterId);
    let hasUpvoted = false;

    if (index > -1) {
      // Remove upvote
      answer.upvotedUsers.splice(index, 1);
      answer.upvotes = Math.max(0, answer.upvotes - 1);
      hasUpvoted = false;
    } else {
      // Add upvote
      answer.upvotedUsers.push(voterId);
      answer.upvotes += 1;
      hasUpvoted = true;
    }

    await question.save();

    res.status(200).json({ success: true, upvotes: answer.upvotes, hasUpvoted });
  } catch (error) {
    console.error("Upvote Answer Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
