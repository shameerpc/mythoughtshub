import api from "./axios";

// --- ADDED THIS FUNCTION ---
// Get All Blogs (Public Feed)




export const getAllBlogs = async (params = {}) => {
  // params will be { page: 1, limit: 6, search: "...", sort: "..." }
  const response = await api.get(`/api/blogs`, { params }); 
  return response.data;
};

// Get Single Blog
export const getBlogById = async (id) => {
  const response = await api.get(`/api/blog/${id}`);
  return response.data;
};


export const createBlog = async (formData) => {
  const response = await api.post("/api/blog", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};


// Update Blog
export const updateBlog = async (id, formData) => {
  const response = await api.put(`/api/blog/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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