import mongoose from "mongoose";
import AffiliateProduct from "./models/AffleateProduct.js";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    console.log("Connecting to", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected! Creating product...");

    const product = new AffiliateProduct({
      name: "Test Affiliate Product",
      description: "This is a test description",
      price: "$10.00",
      affiliateLink: "https://example.com/affiliate",
      category: "general",
      isFeatured: false,
      media: [
        {
          url: "https://example.com/image.jpg",
          type: "image",
          public_id: "test_image"
        }
      ]
    });

    await product.save();
    console.log("Product saved successfully!", product);
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
