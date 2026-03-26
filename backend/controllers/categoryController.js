import Category from "../models/Category.js";

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({ success: true, response: categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // check duplicate name
    const existing = await Category.findOne({
      name: name.trim(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = new Category({
      name: name.trim(),
      description,
      icon,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};