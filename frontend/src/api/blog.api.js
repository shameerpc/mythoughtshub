import api from "./axios";

// --- ADDED THIS FUNCTION ---
// Get All Blogs (Public Feed)
export const getAllBlogs = async () => {
  const response = await api.get("/blog"); 
  return response.data;
};

// Get Single Blog
export const getBlogById = async (id) => {
  const response = await api.get(`/blog/${id}`);
  return response.data;
};

// Update Blog
export const updateBlog = async (id, formData) => {
  const response = await api.put(`/blog/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Delete Blog
export const deleteBlog = async (id) => {
  const response = await api.delete(`/blog/${id}`);
  return response.data;
};

// Get My Blogs (User specific)
export const getMyBlogs = async () => {
  const response = await api.get("/blog/user/me");
  return response.data;
};