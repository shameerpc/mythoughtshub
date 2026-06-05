import api from "./axios";

export const getShortUrl = async (originalUrl) => {
  const response = await api.post("/api/shorten", { originalUrl });
  return response.data;
};
