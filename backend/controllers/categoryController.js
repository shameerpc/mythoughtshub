import Category from "../models/Category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, response: categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};