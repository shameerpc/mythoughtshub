import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

import AffiliateProduct from "./models/AffleateProduct.js";

const productsList = [
  {
    name: "Noise-Cancelling Headphones Pro",
    description: "Experience premium sound quality with active noise cancelling technology. Up to 40 hours of battery life and quick charge features.",
    price: "$199.99",
    category: "Electronics",
    affiliateLink: "https://amazon.com/headphones-pro",
    isFeatured: true,
    rating: 4.8,
    media: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", type: "image", public_id: "head_pro" }]
  },
  {
    name: "Ultra-Speed Blender 2000W",
    description: "Blend smoothies, hot soups, and frozen desserts with ease. Powerful motor with 10 adjustable speeds and pulse feature.",
    price: "$89.99",
    category: "Kitchen",
    affiliateLink: "https://amazon.com/blender-2000w",
    isFeatured: false,
    rating: 4.5,
    media: [{ url: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=500", type: "image", public_id: "blend_pro" }]
  },
  {
    name: "Ergonomic Office Chair",
    description: "Fully adjustable lumbar support, 3D armrests, and breathable mesh back for long working hours.",
    price: "$149.50",
    category: "Home",
    affiliateLink: "https://amazon.com/ergonomic-chair",
    isFeatured: true,
    rating: 4.6,
    media: [{ url: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=500", type: "image", public_id: "chair_pro" }]
  },
  {
    name: "Smart Watch Series X",
    description: "Track your fitness, heart rate, sleep, and receive notifications. Waterproof design with a vibrant AMOLED display.",
    price: "$129.00",
    category: "Electronics",
    affiliateLink: "https://amazon.com/smart-watch-x",
    isFeatured: false,
    rating: 4.3,
    media: [{ url: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=500", type: "image", public_id: "watch_pro" }]
  },
  {
    name: "Professional Chef Knife Set",
    description: "Premium high-carbon stainless steel blades. Ergonomic pakkawood handles for comfortable and precise cutting.",
    price: "$79.95",
    category: "Kitchen",
    affiliateLink: "https://amazon.com/chef-knife-set",
    isFeatured: false,
    rating: 4.7,
    media: [{ url: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=500", type: "image", public_id: "knife_pro" }]
  },
  {
    name: "Adjustable Dumbbell Set (50 lbs)",
    description: "Space-saving adjustable weights for home workout. Simply turn the dial to change weights from 5 to 50 lbs.",
    price: "$249.00",
    category: "Fitness",
    affiliateLink: "https://amazon.com/dumbbell-set",
    isFeatured: true,
    rating: 4.9,
    media: [{ url: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500", type: "image", public_id: "bell_pro" }]
  },
  {
    name: "Minimalist Ceramic Vase Set",
    description: "Handcrafted decorative vases for modern farmhouse style. Perfect for displaying dried flowers or fresh bouquets.",
    price: "$29.99",
    category: "Home",
    affiliateLink: "https://amazon.com/ceramic-vases",
    isFeatured: false,
    rating: 4.2,
    media: [{ url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=500", type: "image", public_id: "vase_pro" }]
  },
  {
    name: "Wireless Charging Pad 3-in-1",
    description: "Fast charge your phone, smartwatch, and wireless earbuds simultaneously. Clean and space-saving charging station.",
    price: "$39.99",
    category: "Electronics",
    affiliateLink: "https://amazon.com/wireless-charger",
    isFeatured: false,
    rating: 4.4,
    media: [{ url: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=500", type: "image", public_id: "charger_pro" }]
  },
  {
    name: "Electric Gooseneck Kettle",
    description: "100% stainless steel inner lid and bottom. 1200W rapid heating with precise temperature control for pour over coffee.",
    price: "$65.00",
    category: "Kitchen",
    affiliateLink: "https://amazon.com/gooseneck-kettle",
    isFeatured: false,
    rating: 4.6,
    media: [{ url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500", type: "image", public_id: "kettle_pro" }]
  },
  {
    name: "Yoga Mat with Alignment Lines",
    description: "Eco-friendly TPE material with non-slip texture. Helpful alignment lines for perfect hand and foot placement.",
    price: "$24.99",
    category: "Fitness",
    affiliateLink: "https://amazon.com/yoga-mat",
    isFeatured: false,
    rating: 4.5,
    media: [{ url: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500", type: "image", public_id: "mat_pro" }]
  }
];

async function run() {
  try {
    console.log("Connecting to", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected! Inserting products...");

    for (const p of productsList) {
      const exists = await AffiliateProduct.findOne({ name: p.name });
      if (!exists) {
        const product = new AffiliateProduct(p);
        await product.save();
        console.log(`Inserted: ${p.name}`);
      } else {
        console.log(`Already exists: ${p.name}`);
      }
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
