// src/api/comment.api.js
import api from "./axios";

// Get all comments for a specific blog
export const getCommentsByBlogId = async (blogId) => {
  const response = await api.get(`/api/blogs/${blogId}/comments`);
  return response.data;
};

// Add a comment to a specific blog
export const addComment = async (blogId, content) => {
  const response = await api.post(`/api/blogs/${blogId}/comment`, { content });
  return response.data;
};