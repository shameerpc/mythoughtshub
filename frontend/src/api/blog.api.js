import api from "./axios";

// Get All Blogs (Public Feed)
// Note: Using '/api/blog' to match your backend route definition
export const getAllBlogs = async (params = {}) => {
  const response = await api.get(`/api/blog`, { params }); 
  return response.data;
};

// Get Single Blog
export const getBlogById = async (id) => {
  const response = await api.get(`/api/blog/${id}`);
  return response.data;
};

// Create Blog
// Do NOT pass headers here. Axios handles FormData automatically.
export const createBlog = async (formData) => {
  const response = await api.post("/api/blog", formData);
  return response.data;
};

// Update Blog
// Changed 'put' to 'patch' to match your backend router
export const updateBlog = async (id, formData) => {
  const response = await api.patch(`/api/blog/${id}`, formData);
  return response.data;
};

// Delete Blog
export const deleteBlog = async (id) => {
  const response = await api.delete(`/api/blog/${id}`);
  return response.data;
};

// Get My Blogs (User specific)
export const getMyBlogs = async () => {
  const response = await api.get("/api/blog/user/me");
  return response.data;
};