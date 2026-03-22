// src/api/home.api.js
import api from "./axios";

// Fetch all blogs
export const fetchBlogs = async () => {
  try {
    const response = await api.get("/api/blog");
    return response.data; // Adjust based on your backend response structure
  } catch (error) {
    throw error;
  }
};

// Fetch Affiliate/Amazon Products (Mocking this for frontend design)
// In a real app, this would hit your backend which hits the Amazon API
export const fetchAffiliateProducts = async () => {
  // Returning mock data for demonstration
  return [
    {
      id: 1,
      title: "Logitech MX Master 3S",
      price: "$99.99",
      image: "https://m.media-amazon.com/images/I/61JqS3tYbVL._AC_SL1500_.jpg",
      link: "https://www.amazon.com/dp/B0BZRBCC1V?tag=YOUR-TAG-20",
      rating: 5,
    },
    {
      id: 2,
      title: "Keychron K2 Keyboard",
      price: "$79.00",
      image: "https://m.media-amazon.com/images/I/71uKp9Qn2JL._AC_SL1500_.jpg",
      link: "https://www.amazon.com/dp/B0855BVQX7?tag=YOUR-TAG-20",
      rating: 4.5,
    },
    {
      id: 3,
      title: "Sony WH-1000XM5",
      price: "$348.00",
      image: "https://m.media-amazon.com/images/I/61aIy4l2iWL._AC_SL1500_.jpg",
      link: "https://www.amazon.com/dp/B09XS7JWHH?tag=YOUR-TAG-20",
      rating: 5,
    },
  ];
};