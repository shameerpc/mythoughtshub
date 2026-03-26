import api from "./axios";

// Get all categories (Used in Navbar & Home)
export const getAllCategories = async () => {
  try {
    const response = await api.get("/api/category");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Get blogs by category slug (Used in CategoryPage)
export const getBlogsByCategorySlug = async (slug) => {
  try {
    // Matches backend route: router.get("/category/:slug", ...)
    const response = await api.get(`/api/blog/category/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category blogs for ${slug}:`, error);
    throw error;
  }
};