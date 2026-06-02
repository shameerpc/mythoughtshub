import mongoose from "mongoose";
import AffiliateProduct from "./models/AffleateProduct.js";
import Review from "./models/Review.js";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    console.log("Connecting to", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected! Fetching products...");

    const products = await AffiliateProduct.find();
    if (products.length === 0) {
      console.log("No products found! Please add products first or run test-schema.js.");
      return;
    }

    console.log(`Found ${products.length} products. Deleting existing reviews to prevent duplicates...`);
    await Review.deleteMany({});

    const mockReviews = [
      {
        userName: "Alice Smith",
        email: "alice@example.com",
        rating: 5,
        title: "Absolutely Amazing!",
        body: "This product exceeded all my expectations. The quality is stellar and shipping was super fast. Highly recommend!",
        helpful: 12,
        verified: true,
      },
      {
        userName: "Bob Jones",
        email: "bob@example.com",
        rating: 4,
        title: "Great value for money",
        body: "Very solid build and performs exactly as described. One minor issue with the setup instructions but customer service helped me immediately.",
        helpful: 5,
        verified: true,
      },
      {
        userName: "Charlie Brown",
        email: "charlie@example.com",
        rating: 3,
        title: "Average product",
        body: "It's decent, but I feel like there are better options at this price range. It does the job but doesn't feel premium.",
        helpful: 2,
        verified: false,
      },
      {
        userName: "Diana Prince",
        email: "diana@example.com",
        rating: 5,
        title: "Best purchase this year!",
        body: "I am super happy with this purchase. Lives up to the hype and is worth every single penny.",
        helpful: 8,
        verified: true,
      },
    ];

    console.log("Seeding reviews...");
    for (const product of products) {
      for (const reviewTemplate of mockReviews) {
        await Review.create({
          ...reviewTemplate,
          product: product._id,
        });
      }
      console.log(`Added reviews for product: ${product.name}`);
    }

    console.log("Reviews seeded successfully!");
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    await mongoose.disconnect();
  }
}

run();
