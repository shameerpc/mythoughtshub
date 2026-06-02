import AffiliateProduct from "../models/AffleateProduct.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";

const parseBoolean = (value) => value === true || value === "true";

const uploadMedia = async (files = []) => {
  const media = [];

  for (const file of files) {
    const isVideo = file.mimetype.startsWith("video");
    const result = await uploadToCloudinary(
      file.buffer,
      "affiliate_products",
      isVideo ? "video" : "image"
    );

    media.push({
      url: result.secure_url,
      type: isVideo ? "video" : "image",
      public_id: result.public_id,
      thumbnail: isVideo ? result.secure_url : undefined,
    });
  }

  return media;
};

const normalizeProductBody = (body) => {
  const data = { ...body };
  delete data.existingMedia;

  if (body.rating !== undefined && body.rating !== "") data.rating = Number(body.rating);
  if (body.isFeatured !== undefined) data.isFeatured = parseBoolean(body.isFeatured);
  if (body.clicks !== undefined && body.clicks !== "") data.clicks = Number(body.clicks);

  return data;
};

export const createProduct = async (req, res) => {
  try {
    const media = await uploadMedia(req.files);
    const product = new AffiliateProduct({
      ...normalizeProductBody(req.body),
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

export const getAllProducts = async (req, res) => {
  try {
    const products = await AffiliateProduct.find().sort({ createdAt: -1 });
    res.json({ success: true, result: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await AffiliateProduct.find({ isFeatured: true }).limit(5);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductBySlug = async (req, res) => {
  try {
    const product = await AffiliateProduct.findOne({ slug: req.params.slug });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const newMedia = await uploadMedia(req.files);
    const updateData = normalizeProductBody(req.body);

    if (req.body.existingMedia) {
      try {
        updateData.media = JSON.parse(req.body.existingMedia);
      } catch {
        return res.status(400).json({ message: "Invalid existingMedia payload" });
      }
    }

    if (newMedia.length > 0) {
      if (Array.isArray(updateData.media)) {
        updateData.media = [...updateData.media, ...newMedia];
      } else {
        updateData.$push = { media: { $each: newMedia } };
      }
    }

    const product = await AffiliateProduct.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ success: true, result: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await AffiliateProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.media && product.media.length > 0) {
      await Promise.all(
        product.media
          .filter((item) => item.public_id)
          .map((item) =>
            deleteFromCloudinary(
              item.public_id,
              item.type === "video" ? "video" : "image"
            )
          )
      );
    }

    await AffiliateProduct.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product and media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
