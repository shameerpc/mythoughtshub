import AffiliateProduct from "../models/AffleateProduct.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";
import { generateSeoMetadata } from "../utils/aiService.js";

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
  delete data.existingPinImage;
  delete data.existingOgImage;

  if (body.rating !== undefined && body.rating !== "") data.rating = Number(body.rating);
  if (body.isFeatured !== undefined) data.isFeatured = parseBoolean(body.isFeatured);
  if (body.clicks !== undefined && body.clicks !== "") data.clicks = Number(body.clicks);

  if (body.pinTags !== undefined) {
    if (typeof body.pinTags === "string") {
      data.pinTags = body.pinTags.split(",").map(t => t.trim()).filter(Boolean);
    } else {
      data.pinTags = body.pinTags;
    }
  }

  // Parse structured JSON strings sent via FormData
  if (typeof body.socialSharing === "string") {
    try { data.socialSharing = JSON.parse(body.socialSharing); } catch (e) {}
  }
  if (typeof body.imageSeo === "string") {
    try { data.imageSeo = JSON.parse(body.imageSeo); } catch (e) {}
  }
  if (typeof body.seoScore === "string") {
    try { data.seoScore = JSON.parse(body.seoScore); } catch (e) {}
  }
  if (typeof body.trendSuggestions === "string") {
    try { data.trendSuggestions = JSON.parse(body.trendSuggestions); } catch (e) {}
  }

  return data;
};

export const createProduct = async (req, res) => {
  try {
    const mediaFiles = req.files?.media || [];
    const pinImageFiles = req.files?.pinImage || [];
    const ogImageFiles = req.files?.ogImage || [];

    const media = await uploadMedia(mediaFiles);
    const pinImageResults = await uploadMedia(pinImageFiles);
    const ogImageResults = await uploadMedia(ogImageFiles);

    const productData = normalizeProductBody(req.body);
    if (pinImageResults.length > 0) {
      productData.pinImage = pinImageResults[0];
    }
    if (ogImageResults.length > 0) {
      productData.ogImage = ogImageResults[0];
    }

    const product = new AffiliateProduct({
      ...productData,
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
    const existingProduct = await AffiliateProduct.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ message: "Product not found" });

    const mediaFiles = req.files?.media || [];
    const pinImageFiles = req.files?.pinImage || [];
    const ogImageFiles = req.files?.ogImage || [];

    const newMedia = await uploadMedia(mediaFiles);
    const newPinImage = await uploadMedia(pinImageFiles);
    const newOgImage = await uploadMedia(ogImageFiles);

    const updateData = normalizeProductBody(req.body);

    let finalMedia = [];
    if (req.body.existingMedia) {
      try {
        finalMedia = JSON.parse(req.body.existingMedia);
      } catch {
        return res.status(400).json({ message: "Invalid existingMedia payload" });
      }
    } else if (existingProduct.media) {
      finalMedia = existingProduct.media;
    }

    // Identify deleted media to remove from Cloudinary
    if (existingProduct.media && existingProduct.media.length > 0) {
      const remainingPublicIds = new Set(finalMedia.map(m => m.public_id).filter(Boolean));
      const deletedMedia = existingProduct.media.filter(
        m => m.public_id && !remainingPublicIds.has(m.public_id)
      );

      if (deletedMedia.length > 0) {
        await Promise.all(
          deletedMedia.map((item) =>
            deleteFromCloudinary(
              item.public_id,
              item.type === "video" ? "video" : "image"
            )
          )
        );
      }
    }

    if (newMedia.length > 0) {
      finalMedia = [...finalMedia, ...newMedia];
    }
    updateData.media = finalMedia;

    // Handle custom Pinterest Image update
    if (newPinImage.length > 0) {
      if (existingProduct.pinImage?.public_id) {
        await deleteFromCloudinary(existingProduct.pinImage.public_id, "image");
      }
      updateData.pinImage = newPinImage[0];
    } else {
      if (req.body.existingPinImage === "" || req.body.existingPinImage === "null" || !req.body.existingPinImage) {
        if (existingProduct.pinImage?.public_id) {
          await deleteFromCloudinary(existingProduct.pinImage.public_id, "image");
        }
        updateData.pinImage = null;
      }
    }

    // Handle custom OG Image update
    if (newOgImage.length > 0) {
      if (existingProduct.ogImage?.public_id) {
        await deleteFromCloudinary(existingProduct.ogImage.public_id, "image");
      }
      updateData.ogImage = newOgImage[0];
    } else {
      if (req.body.existingOgImage === "" || req.body.existingOgImage === "null" || !req.body.existingOgImage) {
        if (existingProduct.ogImage?.public_id) {
          await deleteFromCloudinary(existingProduct.ogImage.public_id, "image");
        }
        updateData.ogImage = null;
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

    if (product.pinImage?.public_id) {
      await deleteFromCloudinary(product.pinImage.public_id, "image");
    }

    if (product.ogImage?.public_id) {
      await deleteFromCloudinary(product.ogImage.public_id, "image");
    }

    await AffiliateProduct.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product and media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const generateProductSeo = async (req, res) => {
  try {
    const { name, description, category, brand } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Product name and description are required to generate SEO content."
      });
    }

    const seoData = await generateSeoMetadata({ name, description, category, brand });
    res.json({ success: true, result: seoData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
