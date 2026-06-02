import api from "./axios";
import { getAffiliateProducts } from "./affiliate.api";

// Fetch all blogs
// We ignore the 'params' argument to force a clean call like Postman
export const fetchBlogs = async (params = {}) => {
  try {
    // ✅ SIMPLE CALL: No params, no cleaning, nothing.
    // This sends: GET /api/blog
    const response = await api.get("/api/blog");
    
    console.log("Raw API Response:", response); // Check console
    return response.data; 
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Fetch Affiliate/Amazon Products
export const fetchAffiliateProducts = async () => {
  const response = await getAffiliateProducts();
  return response.result || response.response || response || [];
};
