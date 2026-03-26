import AffiliateProduct from "../models/AffleateProduct.js";

// ✅ CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const product = new AffiliateProduct(req.body);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created",
      result: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await AffiliateProduct.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      result: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ✅ GET FEATURED PRODUCTS (Top Deals)
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await AffiliateProduct.find({ isFeatured: true }).limit(5);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET SINGLE PRODUCT
export const getProductBySlug = async (req, res) => {
  try {
    const product = await AffiliateProduct.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await AffiliateProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      result: product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await AffiliateProduct.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};