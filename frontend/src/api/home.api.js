import api from "./axios";

// Fetch all blogs
// We ignore the 'params' argument to force a clean call like Postman
export const fetchBlogs = async (params = {}) => {
  try {
    // ✅ SIMPLE CALL: No params, no cleaning, nothing.
    // This sends: GET /api/blog
    const response = await api.get("/api/blog");
    
    console.log("Raw API Response:", response); // Check console
    return response.data; 
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Fetch Affiliate/Amazon Products
export const fetchAffiliateProducts = async () => {
  return [
    {
      id: 1,
      name: "Logitech MX Master 3S",
      description: "The advanced performance mouse with 8K DPI tracking and ultra-fast scrolling. Designed for creators and developers.",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80",
      affiliateLink: "https://www.amazon.com/s?k=logitech+mx+master+3s",
      price: "$99.99",
      rating: 5,
    },
    {
      id: 2,
      name: "Keychron K2 Pro Keyboard",
      description: "A 75% layout wireless mechanical keyboard with QMK/VIA support and hot-swappable switches for Mac/Windows.",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80",
      affiliateLink: "https://www.amazon.com/s?k=keychron+k2+pro",
      price: "$109.00",
      rating: 4.8,
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      description: "Industry-leading noise cancellation with two processors controlling 8 microphones for unprecedented noise cancellation.",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      affiliateLink: "https://www.amazon.com/s?k=sony+wh+1000xm5",
      price: "$348.00",
      rating: 4.9,
    },
    {
      id: 4,
      name: "Dell UltraSharp Monitor",
      description: "27-inch 4K UHD monitor with 99% sRGB color coverage. Perfect for designers and photographers.",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
      affiliateLink: "https://www.amazon.com/s?k=dell+ultrasharp+27+4k",
      price: "$450.00",
      rating: 4.7,
    },
    {
      id: 5,
      name: "MacBook Air M2",
      description: "Supercharged by M2. Absurdly thin. Incredible performance. The future of the notebook.",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&w=800&q=80",
      affiliateLink: "https://www.amazon.com/s?k=macbook+air+m2",
      price: "$1099.00",
      rating: 5,
    }
  ];
};