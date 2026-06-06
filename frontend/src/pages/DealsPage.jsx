import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { 
  Star, ShoppingBag, MessageSquare, Search, ArrowUpDown, Flame, Inbox,
  Share2, Copy, Check, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { getAffiliateProducts } from "../api/affiliate.api";
import { getShortUrl } from "../api/shorten.api";
import { Helmet } from "react-helmet-async";

const normalizeUrl = (url) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
};

const MOCK_PRODUCTS = [
  {
    _id: "mock1",
    name: "Noise-Cancelling Headphones Pro",
    description: "Experience premium sound quality with active noise cancelling technology. Up to 40 hours of battery life and quick charge features.",
    price: "$199.99",
    category: "Electronics",
    affiliateLink: "https://amazon.com",
    isFeatured: true,
    rating: 5,
    media: [{ url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", type: "image" }],
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock2",
    name: "Ultra-Speed Blender 2000W",
    description: "Blend smoothies, hot soups, and frozen desserts with ease. Powerful motor with 10 adjustable speeds and pulse feature.",
    price: "$89.99",
    category: "Kitchen",
    affiliateLink: "https://amazon.com",
    isFeatured: false,
    rating: 4,
    media: [{ url: "https://images.unsplash.com/photo-1578643463396-0997cb5328c1?w=600", type: "image" }],
    createdAt: new Date(Date.now() - 100000).toISOString()
  },
  {
    _id: "mock3",
    name: "Ergonomic Office Chair",
    description: "Fully adjustable lumbar support, 3D armrests, and breathable mesh back for long working hours.",
    price: "$149.50",
    category: "Home",
    affiliateLink: "https://amazon.com",
    isFeatured: true,
    rating: 4.5,
    media: [{ url: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600", type: "image" }],
    createdAt: new Date(Date.now() - 200000).toISOString()
  },
  {
    _id: "mock4",
    name: "Smart Watch Series X",
    description: "Track your fitness, heart rate, sleep, and receive notifications. Waterproof design with a vibrant AMOLED display.",
    price: "$129.00",
    category: "Electronics",
    affiliateLink: "https://amazon.com",
    isFeatured: false,
    rating: 4.2,
    media: [{ url: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600", type: "image" }],
    createdAt: new Date(Date.now() - 300000).toISOString()
  },
  {
    _id: "mock5",
    name: "Professional Chef Knife Set",
    description: "Premium high-carbon stainless steel blades. Ergonomic pakkawood handles for comfortable and precise cutting.",
    price: "$79.95",
    category: "Kitchen",
    affiliateLink: "https://amazon.com",
    isFeatured: false,
    rating: 4.7,
    media: [{ url: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=600", type: "image" }],
    createdAt: new Date(Date.now() - 400000).toISOString()
  },
  {
    _id: "mock6",
    name: "Adjustable Dumbbell Set (50 lbs)",
    description: "Space-saving adjustable weights for home workout. Simply turn the dial to change weights from 5 to 50 lbs.",
    price: "$249.00",
    category: "Fitness",
    affiliateLink: "https://amazon.com",
    isFeatured: true,
    rating: 4.9,
    media: [{ url: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600", type: "image" }],
    createdAt: new Date(Date.now() - 500000).toISOString()
  },
  {
    _id: "mock7",
    name: "Minimalist Ceramic Vase Set",
    description: "Handcrafted decorative vases for modern farmhouse style. Perfect for displaying dried flowers or fresh bouquets.",
    price: "$29.99",
    category: "Home",
    affiliateLink: "https://amazon.com",
    isFeatured: false,
    rating: 4,
    media: [{ url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600", type: "image" }],
    createdAt: new Date(Date.now() - 600000).toISOString()
  },
  {
    _id: "mock8",
    name: "Wireless Charging Pad 3-in-1",
    description: "Fast charge your phone, smartwatch, and wireless earbuds simultaneously. Clean and space-saving charging station.",
    price: "$39.99",
    category: "Electronics",
    affiliateLink: "https://amazon.com",
    isFeatured: false,
    rating: 4.3,
    media: [{ url: "https://images.unsplash.com/photo-1622445262465-2481c4574875?w=600", type: "image" }],
    createdAt: new Date(Date.now() - 700000).toISOString()
  },
  {
    _id: "mock9",
    name: "Electric Gooseneck Kettle",
    description: "100% stainless steel inner lid and bottom. 1200W rapid heating with precise temperature control for pour over coffee.",
    price: "$65.00",
    category: "Kitchen",
    affiliateLink: "https://amazon.com",
    isFeatured: false,
    rating: 4.6,
    media: [{ url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600", type: "image" }],
    createdAt: new Date(Date.now() - 800000).toISOString()
  },
  {
    _id: "mock10",
    name: "Yoga Mat with Alignment Lines",
    description: "Eco-friendly TPE material with non-slip texture. Helpful alignment lines for perfect hand and foot placement.",
    price: "$24.99",
    category: "Fitness",
    affiliateLink: "https://amazon.com",
    isFeatured: false,
    rating: 4.5,
    media: [{ url: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600", type: "image" }],
    createdAt: new Date(Date.now() - 900000).toISOString()
  }
];

const DealsPageCard = ({ product, onShare, onClick }) => {
  const images = Array.isArray(product.media) && product.media.length > 0
    ? product.media.map((item) => getImageUrl(item.url))
    : Array.isArray(product.images)
      ? product.images.map((img) => getImageUrl(img))
      : (product.image ? [getImageUrl(product.image)] : [getImageUrl(null)]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="group relative bg-white rounded-3xl shadow-[0_10px_35px_-10px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.2)] hover:-translate-y-2 border border-slate-100 flex flex-col h-full">
      <div 
        onClick={() => onClick(product)}
        className="relative w-full h-56 overflow-hidden bg-slate-50 flex-shrink-0 cursor-pointer"
      >
        <div className="relative w-full h-full">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                idx === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            >
              <img
                src={img}
                alt={product.pinAltText || product.name || `Product image ${idx + 1}`}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x400/1e293b/FFF?text=Image+Unavailable";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40" />
            </div>
          ))}
        </div>

        <div className="absolute flex flex-col gap-2 pointer-events-none top-4 left-4 z-10">
          {product.isFeatured && (
            <div className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white rounded-full shadow-md bg-gradient-to-r from-amber-500 to-orange-600 animate-pulse">
              <Flame size={12} fill="currentColor" /> HOT DEAL
            </div>
          )}
        </div>

        {/* Share Button (Pinterest-style Overlay) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onShare(product);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 bg-white/90 hover:bg-indigo-600 text-slate-600 hover:text-white backdrop-blur-sm rounded-full shadow-md border border-slate-100 transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Share Deal"
        >
          <Share2 size={15} />
        </button>

        <div className="absolute flex flex-col items-center p-2 px-3 bg-white/90 backdrop-blur-sm border border-slate-100 shadow-md bottom-4 right-4 rounded-xl z-10">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Price</span>
          <span className="text-md font-extrabold text-indigo-600">{product.price || "$99.00"}</span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-100">
            {product.category || "General"}
          </span>
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={12} fill={i < (product.rating || 4) ? "currentColor" : "none"} />
            ))}
          </div>
        </div>

        <h3 
          onClick={() => onClick(product)}
          className="text-lg font-bold text-slate-900 leading-snug mb-2 line-clamp-2 min-h-[2.75rem] group-hover:text-indigo-600 transition-colors cursor-pointer"
        >
          {product.name}
        </h3>
        
        <p className="text-sm text-slate-500 line-clamp-3 mb-6 flex-grow">
          {product.description}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 mt-auto">
          <a
            href={normalizeUrl(product.affiliateLink)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-100 transition-all text-xs"
          >
            <ShoppingBag size={14} />
            View Deal
          </a>
          <Link
            to={`/reviews?product=${product._id}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 font-bold rounded-xl transition-all text-xs"
          >
            <MessageSquare size={14} />
            Reviews
          </Link>
        </div>
      </div>
    </div>
  );
};

// Share Modal Component
const ShareModal = ({ isOpen, onClose, product }) => {
  const [copied, setCopied] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !product) return;
    const fetchLink = async () => {
      setLoading(true);
      try {
        const longUrl = `${window.location.origin}/deals?product=${product._id}`;
        const res = await getShortUrl(longUrl);
        setShortUrl(res.shortUrl);
      } catch (err) {
        console.error("Failed to generate short code", err);
        setShortUrl(`${window.location.origin}/deals?product=${product._id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `Check out this amazing deal: ${product.name}`;
  
  const socialShares = [
    {
      name: "WhatsApp",
      color: "bg-[#25D366] hover:bg-[#20ba5a]",
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + shortUrl)}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.402.002 9.791-4.382 9.794-9.786.002-2.586-1.002-5.02-2.828-6.848S14.595 1.26 12.012 1.26c-5.41 0-9.801 4.382-9.805 9.789-.001 1.77.481 3.5 1.393 5.008L2.613 21.33l5.034-1.321h.001zM17.15 14.65c-.282-.142-1.673-.825-1.932-.92-.257-.094-.446-.142-.633.142-.187.284-.725.92-.888 1.11-.162.188-.325.212-.607.07-.282-.142-1.194-.44-2.274-1.402-.84-.75-1.408-1.675-1.573-1.958-.164-.283-.018-.435.123-.576.127-.127.282-.329.424-.495.142-.165.19-.283.284-.471.094-.188.047-.354-.023-.495-.071-.142-.633-1.527-.868-2.092-.228-.551-.48-.475-.66-.484-.17-.008-.367-.01-.565-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.673-.684 1.908-1.344.235-.66.235-1.226.164-1.344-.07-.118-.258-.188-.54-.33z"/>
        </svg>
      )
    },
    {
      name: "X",
      color: "bg-[#000000] hover:bg-[#1a1a1a]",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shortUrl)}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    {
      name: "Facebook",
      color: "bg-[#1877F2] hover:bg-[#166FE5]",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shortUrl)}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      name: "Telegram",
      color: "bg-[#0088cc] hover:bg-[#0077b5]",
      url: `https://t.me/share/url?url=${encodeURIComponent(shortUrl)}&text=${encodeURIComponent(shareText)}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.87 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.46c.538-.196 1.006.128.832.909z"/>
        </svg>
      )
    },
    {
      name: "Pinterest",
      color: "bg-[#BD081C] hover:bg-[#ad0719]",
      url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shortUrl)}&media=${encodeURIComponent(getImageUrl(product.media?.[0]?.url || product.image))}&description=${encodeURIComponent(product.name)}`,
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.966 1.406-5.966s-.359-.72-.359-1.781c0-1.663.967-2.907 2.17-2.907 1.02 0 1.513.769 1.513 1.689 0 1.029-.656 2.568-.994 3.995-.28 1.189.599 2.158 1.77 2.158 2.124 0 3.758-2.241 3.758-5.474 0-2.861-2.056-4.86-4.991-4.86-3.399 0-5.395 2.548-5.395 5.182 0 1.027.395 2.13.89 2.73.098.12.112.223.083.345-.09.375-.293 1.199-.334 1.363-.053.211-.174.256-.402.15-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.162 0 7.396 2.965 7.396 6.927 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.743-1.37l-.749 2.853c-.27 1.039-1.001 2.34-1.492 3.14 1.124.347 2.317.535 3.551.535 6.621 0 11.985-5.367 11.985-11.987C24.007 5.368 18.64 0 12.017 0z"/>
        </svg>
      )
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Share2 className="text-indigo-600" size={20} />
            Share Deal
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Card Preview */}
          <div className="flex gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border border-slate-200 flex-shrink-0">
              <img
                src={getImageUrl(product.media?.[0]?.url || product.image)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-grow">
              <h4 className="text-sm font-bold text-slate-800 truncate">{product.name}</h4>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold">{product.category}</p>
              <p className="text-sm font-extrabold text-indigo-600 mt-1">{product.price}</p>
            </div>
          </div>

          {/* Copy Link Row */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Short Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={loading ? "Generating short URL..." : shortUrl}
                className="flex-grow px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none text-sm text-slate-600 select-all font-medium"
              />
              <button
                onClick={copyToClipboard}
                disabled={loading}
                className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  copied
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-100"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {/* Social Icons */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Share to Social Media</label>
            <div className="grid grid-cols-5 gap-3">
              {socialShares.map((share) => (
                <a
                  key={share.name}
                  href={share.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl text-white font-semibold gap-1 text-[11px] transition-all transform hover:-translate-y-1 hover:shadow-lg ${share.color}`}
                >
                  {share.icon}
                  <span className="mt-1 font-bold">{share.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detailed Product Modal Component
const ProductDetailModal = ({ isOpen, onClose, product, onShare }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || !product) return null;

  const images = Array.isArray(product.media) && product.media.length > 0
    ? product.media.map((item) => getImageUrl(item.url))
    : Array.isArray(product.images)
      ? product.images.map((img) => getImageUrl(img))
      : (product.image ? [getImageUrl(product.image)] : [getImageUrl(null)]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 relative bg-slate-50 min-h-[300px] md:h-auto flex flex-col">
          <button 
            onClick={onClose} 
            className="absolute top-4 left-4 z-20 md:hidden p-2 rounded-full bg-white/80 backdrop-blur-sm text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
          
          <div className="relative flex-grow h-64 md:h-full overflow-hidden">
            <img
              src={images[currentIndex]}
              alt={product.pinAltText || product.name}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentIndex ? "bg-indigo-600 w-5" : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-between overflow-y-auto relative">
          {/* Close button for desktop */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-20 hidden md:block p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded border border-indigo-100">
                {product.category || "General"}
              </span>
              <div className="flex text-yellow-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} size={14} fill={i < (product.rating || 4) ? "currentColor" : "none"} />
                ))}
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 leading-snug mb-3">
              {product.name}
            </h2>

            <div className="inline-block px-4 py-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xl rounded-2xl mb-6">
              {product.price || "$99.00"}
            </div>

            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 mt-auto">
            <a
              href={normalizeUrl(product.affiliateLink)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-md shadow-indigo-100 transition-all text-sm text-center"
            >
              <ShoppingBag size={16} />
              View Deal
            </a>
            <button
              onClick={() => onShare(product)}
              className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-700 font-bold rounded-2xl transition-all text-sm cursor-pointer"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

const DealsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState("");

  // Pagination & Modals State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [shareProduct, setShareProduct] = useState(null);
  const [activeDetailProduct, setActiveDetailProduct] = useState(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await getAffiliateProducts();
        const items = res.result || res.response || res || [];
        if (items.length === 0) {
          console.warn("No products in database, loading mock products for preview.");
          setProducts(MOCK_PRODUCTS);
        } else {
          setProducts(items);
        }
      } catch (err) {
        console.error("Database connection failed, loading mock products for preview.", err);
        setError("Database connection failed. Displaying mock deals for preview.");
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // Check for shared product query param
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const sharedProductId = queryParams.get("product");
    if (!loading && sharedProductId && products.length > 0) {
      const prod = products.find((p) => p._id === sharedProductId);
      if (prod) {
        setActiveDetailProduct(prod);
      }
    }
  }, [loading, products]);

  // Derive Pinterest Category Boards
  const categoryBoards = useMemo(() => {
    const groups = {};
    products.forEach((p) => {
      const cat = p.category || "General";
      const catKey = cat.toLowerCase();
      if (!groups[catKey]) {
        groups[catKey] = {
          name: cat,
          products: [],
        };
      }
      groups[catKey].products.push(p);
    });

    return Object.keys(groups).map((key) => {
      const group = groups[key];
      const prodImages = [];
      group.products.forEach((p) => {
        const pImages = Array.isArray(p.media) && p.media.length > 0
          ? p.media.map(m => m.url)
          : Array.isArray(p.images)
            ? p.images
            : (p.image ? [p.image] : []);
        
        pImages.forEach((url) => {
          if (prodImages.length < 3 && url) {
            prodImages.push(getImageUrl(url));
          }
        });
      });

      while (prodImages.length < 3) {
        if (prodImages.length > 0) {
          prodImages.push(prodImages[0]);
        } else {
          prodImages.push("https://placehold.co/600x400?text=MyThoughtsHub");
        }
      }

      return {
        key,
        name: group.name,
        count: group.products.length,
        images: prodImages,
      };
    });
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    if (selectedCat !== "all") {
      result = result.filter((p) => (p.category || "").toLowerCase() === selectedCat.toLowerCase());
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => {
        const valA = parseFloat((a.price || "0").replace(/[^0-9.]/g, "")) || 0;
        const valB = parseFloat((b.price || "0").replace(/[^0-9.]/g, "")) || 0;
        return valA - valB;
      });
    } else if (sortBy === "price-high") {
      result.sort((a, b) => {
        const valA = parseFloat((a.price || "0").replace(/[^0-9.]/g, "")) || 0;
        const valB = parseFloat((b.price || "0").replace(/[^0-9.]/g, "")) || 0;
        return valB - valA;
      });
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, search, selectedCat, sortBy]);

  // Reset page to 1 when filters/sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCat, sortBy]);

  // Pagination bounds
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const listSection = document.getElementById("deals-list-section");
    if (listSection) {
      listSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openShare = (product) => {
    setShareProduct(product);
  };

  const openDetail = (product) => {
    setActiveDetailProduct(product);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {activeDetailProduct ? (
        <Helmet>
          <title>{activeDetailProduct.pinTitle || activeDetailProduct.ogTitle || activeDetailProduct.name}</title>
          <meta name="description" content={activeDetailProduct.pinDescription || activeDetailProduct.ogDescription || activeDetailProduct.description} />
          
          <meta property="og:title" content={activeDetailProduct.ogTitle || activeDetailProduct.name} />
          <meta property="og:description" content={activeDetailProduct.ogDescription || activeDetailProduct.description} />
          <meta property="og:image" content={getImageUrl(activeDetailProduct.ogImage?.url || activeDetailProduct.media?.[0]?.url || activeDetailProduct.image)} />
          <meta property="og:url" content={`${window.location.origin}/deals?product=${activeDetailProduct._id}`} />
          <meta property="og:type" content="product" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={activeDetailProduct.ogTitle || activeDetailProduct.name} />
          <meta name="twitter:description" content={activeDetailProduct.ogDescription || activeDetailProduct.description} />
          <meta name="twitter:image" content={getImageUrl(activeDetailProduct.ogImage?.url || activeDetailProduct.media?.[0]?.url || activeDetailProduct.image)} />
          
          <meta name="pinterest-rich-pin" content="true" />
          {activeDetailProduct.pinTags && activeDetailProduct.pinTags.length > 0 && (
            <meta name="keywords" content={activeDetailProduct.pinTags.join(", ")} />
          )}
        </Helmet>
      ) : (
        <Helmet>
          <title>Exclusive Deals & Offers | MyThoughtsHub</title>
          <meta name="description" content="Hand-picked products, authentic database verified reviews, and price drops." />
        </Helmet>
      )}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] py-16">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold tracking-widest text-indigo-600 uppercase bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            Marketplace
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Exclusive Deals & Offers
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Hand-picked products, authentic database verified reviews, and price drops.
          </p>
        </div>

        {/* Pinterest-style Category Boards */}
        {!loading && products.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 flex items-center gap-2">
              <span>Browse Category Boards</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">Pinterest-style</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              
              {/* "All" Board */}
              <div
                onClick={() => setSelectedCat("all")}
                className={`group cursor-pointer flex flex-col gap-3 rounded-3xl p-3 border transition-all duration-300 ${
                  selectedCat === "all"
                    ? "bg-indigo-50/50 border-indigo-200 shadow-sm ring-2 ring-indigo-600/10"
                    : "bg-white border-slate-155 hover:border-slate-300 hover:shadow-md"
                }`}
              >
                <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden h-28 bg-slate-100 flex-shrink-0 relative">
                  <div className="col-span-2 h-full">
                    <img
                      src={products[0] ? getImageUrl(products[0].media?.[0]?.url || products[0].image) : "https://placehold.co/600x400?text=All"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt=""
                    />
                  </div>
                  <div className="grid grid-rows-2 gap-1 h-full">
                    <img
                      src={products[1] ? getImageUrl(products[1].media?.[0]?.url || products[1].image) : "https://placehold.co/600x400?text=All"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt=""
                    />
                    <img
                      src={products[2] ? getImageUrl(products[2].media?.[0]?.url || products[2].image) : "https://placehold.co/600x400?text=All"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt=""
                    />
                  </div>
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-slate-800 text-sm truncate">All Categories</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">{products.length} Products</p>
                </div>
              </div>

              {/* Dynamic Category Boards */}
              {categoryBoards.map((board) => (
                <div
                  key={board.key}
                  onClick={() => setSelectedCat(board.name)}
                  className={`group cursor-pointer flex flex-col gap-3 rounded-3xl p-3 border transition-all duration-300 ${
                    selectedCat.toLowerCase() === board.name.toLowerCase()
                      ? "bg-indigo-50/50 border-indigo-200 shadow-sm ring-2 ring-indigo-600/10"
                      : "bg-white border-slate-155 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden h-28 bg-slate-100 flex-shrink-0">
                    <div className="col-span-2 h-full">
                      <img
                        src={board.images[0]}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt=""
                      />
                    </div>
                    <div className="grid grid-rows-2 gap-1 h-full">
                      <img
                        src={board.images[1]}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt=""
                      />
                      <img
                        src={board.images[2]}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="font-bold text-slate-800 text-sm truncate capitalize">{board.name}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">{board.count} Products</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div id="deals-list-section" className="flex flex-col gap-4 p-4 bg-white border border-slate-100 shadow-sm rounded-3xl mb-12 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-grow max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search deals..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            {/* Category Filter dropdown */}
            <select
              className="px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-600 bg-white cursor-pointer"
              value={selectedCat.toLowerCase()}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categoryBoards.map((board) => (
                <option key={board.key} value={board.name.toLowerCase()}>
                  {board.name.charAt(0).toUpperCase() + board.name.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 border border-slate-200 px-4 py-3 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                className="focus:outline-none text-sm text-slate-600 bg-transparent cursor-pointer"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest Deals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {error && (
          <div className="p-4 mb-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[420px] bg-slate-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white border border-dashed border-slate-200 rounded-3xl max-w-2xl mx-auto shadow-sm">
            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl mb-4">
              <Inbox size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No Deals Found</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xs">
              {search ? "No products match your current search queries. Try different keywords!" : "Check back later for curated Amazon affiliate deals."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {paginatedProducts.map((product) => (
                <div key={product._id} className="h-full">
                  <DealsPageCard 
                    product={product} 
                    onShare={openShare} 
                    onClick={openDetail}
                  />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-500 font-medium">
                  Showing <span className="font-semibold text-slate-800">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-semibold text-slate-800">
                    {Math.min(indexOfLastItem, filteredProducts.length)}
                  </span>{" "}
                  of <span className="font-semibold text-slate-800">{filteredProducts.length}</span> deals
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[40px] h-[40px] text-sm font-bold rounded-xl transition-all cursor-pointer ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-500 hover:text-indigo-600"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-slate-200 disabled:hover:text-slate-600 transition-all cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal 
        isOpen={!!shareProduct} 
        onClose={() => setShareProduct(null)} 
        product={shareProduct}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal 
        isOpen={!!activeDetailProduct} 
        onClose={() => {
          setActiveDetailProduct(null);
          // Clean up product query param when modal is closed
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }} 
        product={activeDetailProduct}
        onShare={openShare}
      />
    </div>
  );
};

export default DealsPage;
