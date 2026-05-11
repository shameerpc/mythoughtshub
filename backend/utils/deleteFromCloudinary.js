import cloudinary from "../config/cloudinary.js";

export const deleteFromCloudinary = async (public_id, resource_type) => {
  try {
    await cloudinary.uploader.destroy(public_id, {
      resource_type: resource_type || "image",
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};