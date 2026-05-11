import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, folder, resource_type) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder, resource_type },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      )
      .end(fileBuffer);
  });
};