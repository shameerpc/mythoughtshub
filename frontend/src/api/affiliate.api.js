import api from "./axios";

export const getAffiliateProducts = async () => {
  const response = await api.get("/api/affiliate");
  return response.data;
};

export const getFeaturedAffiliateProducts = async () => {
  const response = await api.get("/api/affiliate/featured");
  return response.data;
};
