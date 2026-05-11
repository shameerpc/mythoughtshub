import AffiliateProduct from "../models/AffleateProduct.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

// ✅ CREATE PRODUCT WITH MEDIA
export const createProduct = async (req, res) => {
  try {
    let media = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const isVideo = file.mimetype.startsWith("video");

        const result = await uploadToCloudinary(
          file.buffer,
          "affiliate_products",
          isVideo ? "video" : "image"
        );

        // 🔥 FIX: add public_id
        media.push({
          url: result.secure_url,
          type: isVideo ? "video" : "image",
          public_id: result.public_id,
          thumbnail: isVideo ? result.secure_url : undefined,
        });
      }
    }

    const product = new AffiliateProduct({
      ...req.body,
      media,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Product created with media",
      result: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await AffiliateProduct.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      result: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET FEATURED PRODUCTS
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
    let media = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const isVideo = file.mimetype.startsWith("video");

        const result = await uploadToCloudinary(
          file.buffer,
          "affiliate_products",
          isVideo ? "video" : "image"
        );

        // 🔥 FIX: add public_id
        media.push({
          url: result.secure_url,
          type: isVideo ? "video" : "image",
          public_id: result.public_id,
        });
      }
    }

    const updateData = {
      ...req.body,
    };

    // 🔥 Add new media without removing old
    if (media.length > 0) {
      updateData.$push = { media: { $each: media } };
    }

    const product = await AffiliateProduct.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      result: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE PRODUCT + CLOUDINARY CLEANUP
export const deleteProduct = async (req, res) => {
  try {
    const product = await AffiliateProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 FAST PARALLEL DELETE
    if (product.media && product.media.length > 0) {
      await Promise.all(
        product.media.map((item) =>
          deleteFromCloudinary(
            item.public_id,
            item.type === "video" ? "video" : "image"
          )
        )
      );
    }

    await AffiliateProduct.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product and media deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};