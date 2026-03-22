import api from "./axios";

export const getAllCategories = async () => {
  const response = await api.get("/api/category");
  return response.data;
};

export const getBlogsByCategorySlug = async (slug) => {
  // Calls: GET /api/blog/category/:slug
  const response = await api.get(`/api/blog/category/${slug}`);
  return response.data;
};