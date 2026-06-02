import Review from "../models/Review.js";
import AffiliateProduct from "../models/AffleateProduct.js";

const buildQuery = (req, includeInactive = false) => {
  const query = { delete_status: false };
  if (req.query.product) query.product = req.query.product;
  if (!includeInactive) query.is_active = true;
  return query;
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find(buildQuery(req))
      .populate("product", "name slug price media")
      .populate("creator", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, response: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { product, userName, email, rating, title, body } = req.body;

    if (!product || !userName || !rating || !title || !body) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const productExists = await AffiliateProduct.exists({ _id: product });
    if (!productExists) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const review = await Review.create({
      product,
      creator: req.user?.id,
      userName,
      email,
      rating: Number(rating),
      title,
      body,
    });

    await review.populate("product", "name slug price media");
    res.status(201).json({ success: true, result: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminReviews = async (req, res) => {
  try {
    const reviews = await Review.find(buildQuery(req, true))
      .populate("product", "name slug price media")
      .populate("creator", "username email")
      .sort({ createdAt: -1 });

    res.json({ success: true, response: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const allowed = ["userName", "email", "rating", "title", "body", "verified", "helpful", "is_active"];
    const update = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) update[field] = req.body[field];
    });

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, delete_status: false },
      update,
      { new: true, runValidators: true }
    )
      .populate("product", "name slug price media")
      .populate("creator", "username email");

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    res.json({ success: true, result: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.delete_status) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.delete_status = true;
    await review.save();

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
