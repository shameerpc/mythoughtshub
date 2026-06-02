import React, { useState, useEffect } from "react";
import { MoveLeft, MoveRight, ShoppingBag, Star, Flame } from "lucide-react";

const AffiliateCard = ({ product }) => {
  // State for Image Carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 1. Normalize Images: Handle both array and single string
  const images = Array.isArray(product.media) && product.media.length > 0
    ? product.media.map((item) => item.url)
    : Array.isArray(product.images) 
      ? product.images 
      : (product.image ? [product.image] : ["https://placehold.co/600x400?text=No+Image"]);

  // 2. Auto-Rotate Images Logic
  useEffect(() => {
    if (images.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500); // Change image every 3.5 seconds
    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // 3. Placeholder for missing images
  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = "https://placehold.co/600x400/1e293b/FFF?text=Image+Unavailable";
  };

  return (
    <div 
      className="group relative bg-white rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.25)] hover:-translate-y-2 border border-gray-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* ────── IMAGE GALLERY SECTION ────── */}
      <div className="relative w-full h-64 overflow-hidden bg-gray-100">
        
        {/* The Sliding Images */}
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
                alt={`${product.name} ${idx + 1}`}
                className="object-cover w-full h-full"
                onError={handleImageError}
              />
              
              {/* Gradient Overlay for text readability if needed, or aesthetic */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>
          ))}
        </div>

        {/* ────── CAROUSEL CONTROLS (Only show if multiple images) ────── */}
        {images.length > 1 && (
          <>
            {/* Navigation Arrows */}
            <button 
              onClick={prevImage} 
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 duration-300"
            >
              <MoveLeft size={18} />
            </button>
            <button 
              onClick={nextImage} 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-all opacity-0 group-hover:opacity-100 translate-x-[10px] group-hover:translate-x-0 duration-300"
            >
              <MoveRight size={18} />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* ────── BADGES ────── */}
        <div className="absolute flex flex-col gap-2 pointer-events-none top-4 left-4">
          {product.isTrending && (
            <div className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-pink-600 animate-pulse">
              <Flame size={12} fill="currentColor" /> TRENDING
            </div>
          )}
          {product.discount && (
            <div className="px-3 py-1 text-xs font-bold text-white bg-green-500 rounded-full shadow-lg">
              -{product.discount}% OFF
            </div>
          )}
        </div>

        {/* ────── HOVER "VIEW DEAL" OVERLAY ────── */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-20">
          <a 
            href={product.affiliateLink} 
            target="_blank" 
            rel="noreferrer"
            className="relative inline-flex items-center gap-2 px-8 py-3 bg-white text-indigo-900 font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.4)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-105 active:scale-95"
          >
            <ShoppingBag size={20} />
            View Deal
          </a>
        </div>
      </div>

      {/* ────── CONTENT SECTION ────── */}
      <div className="relative p-5">
        {/* Floating Price Tag overlapping image/content boundary */}
        <div className="absolute flex flex-col items-center p-2 px-4 bg-white border border-gray-100 shadow-lg -top-8 right-5 rounded-xl animate-bounce-short">
          <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Price</span>
          <span className="text-lg font-extrabold text-indigo-600">
            {product.price || "$99.00"}
          </span>
        </div>

        {/* Content Grid */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded border border-indigo-100">
              Amazon
            </span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill={i < (product.rating || 4) ? "currentColor" : "none"} />
              ))}
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          
          <p className="h-10 mb-4 text-sm text-gray-500 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <span className="text-xs font-medium text-gray-400">
              Listed {new Date(product.createdAt).toLocaleDateString()}
            </span>
            <span className="px-2 py-1 text-xs font-semibold text-green-600 rounded bg-green-50">
              In Stock
            </span>
          </div>
        </div>
      </div>

      {/* ────── CUSTOM ANIMATIONS ────── */}
      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short {
          animation: bounce-short 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default AffiliateCard;
