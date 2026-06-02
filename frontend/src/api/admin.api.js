import api from "./axios";

export const getAdminStats = async () => {
  const response = await api.get("/api/admin/stats");
  return response.data;
};

export const getAdminUsers = async (params = {}) => {
  const response = await api.get("/api/admin/users", { params });
  return response.data;
};

export const updateAdminUser = async (id, data) => {
  const response = await api.patch(`/api/admin/users/${id}`, data);
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await api.delete(`/api/admin/users/${id}`);
  return response.data;
};

export const getAdminBlogs = async (params = {}) => {
  const response = await api.get("/api/admin/blogs", { params });
  return response.data;
};

export const updateAdminBlog = async (id, data) => {
  const response = await api.patch(`/api/admin/blogs/${id}`, data);
  return response.data;
};

export const deleteAdminBlog = async (id) => {
  const response = await api.delete(`/api/admin/blogs/${id}`);
  return response.data;
};

export const getAdminComments = async (params = {}) => {
  const response = await api.get("/api/admin/comments", { params });
  return response.data;
};

export const updateAdminComment = async (id, data) => {
  const response = await api.patch(`/api/admin/comments/${id}`, data);
  return response.data;
};

export const deleteAdminComment = async (id) => {
  const response = await api.delete(`/api/admin/comments/${id}`);
  return response.data;
};

export const getAdminReviews = async (params = {}) => {
  const response = await api.get("/api/admin/reviews", { params });
  return response.data;
};

export const updateAdminReview = async (id, data) => {
  const response = await api.patch(`/api/admin/reviews/${id}`, data);
  return response.data;
};

export const deleteAdminReview = async (id) => {
  const response = await api.delete(`/api/admin/reviews/${id}`);
  return response.data;
};

export const getAdminAffiliates = async () => {
  const response = await api.get("/api/admin/affiliates");
  return response.data;
};

export const createAdminAffiliate = async (formData) => {
  const response = await api.post("/api/admin/affiliates", formData);
  return response.data;
};

export const updateAdminAffiliate = async (id, formData) => {
  const response = await api.put(`/api/admin/affiliates/${id}`, formData);
  return response.data;
};

export const deleteAdminAffiliate = async (id) => {
  const response = await api.delete(`/api/admin/affiliates/${id}`);
  return response.data;
};
