import api from "./axios";

export const getReviews = async (params = {}) => {
  const response = await api.get("/api/reviews", { params });
  return response.data;
};

export const createReview = async (data) => {
  const response = await api.post("/api/reviews", data);
  return response.data;
};
