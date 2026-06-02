import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

// --- Helper Functions ---

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://picsum.photos/seed/blog/800/600";
  
  // ✅ FIX 1: Changed default port to 4000 to match your server.js
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  
  // ✅ FIX 2: Removed the "/" between API_URL and imagePath.
  // Since imagePath already starts with "/", we don't need to add another one.
  return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("en-US", {
    year: "numeric", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
};

// --- Main Component ---

export default function BlogCard({ blog }) {
  // 1. State for Slider
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const autoPlayRef = useRef(null);

  // 2. Data Prep
  // Use images array, or fallback to a single object array for compatibility
  const imagesList = blog.images && blog.images.length > 0 
    ? blog.images 
    : [{ url: null, alt: blog.title }]; // Fallback structure

  // Helper for cache buster (used in the render map)
  const cacheBuster = blog.updatedAt ? `?t=${new Date(blog.updatedAt).getTime()}` : '';

  const displayCategory = blog.category
    ? (typeof blog.category === 'string' ? blog.category : blog.category.name)
    : "General";

  const isSlider = imagesList.length > 1;

  // --- Slider Logic ---

  // Wrapped in useCallback to stabilize the function reference for the useEffect dependency array
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesList.length);
  }, [imagesList.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? imagesList.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Touch / Swipe Handling
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) nextSlide(); // Swipe Left -> Next
    if (touchStart - touchEnd < -50) prevSlide(); // Swipe Right -> Prev
  };

  // Auto-play functionality
  // Added 'nextSlide' to dependency array
  useEffect(() => {
    if (isSlider) {
      autoPlayRef.current = setInterval(nextSlide, 5000); // 5 seconds
      return () => clearInterval(autoPlayRef.current);
    }
  }, [isSlider, nextSlide]);

  // --- Render ---

  return (
    <div className="relative flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm group rounded-2xl hover:shadow-2xl hover:-translate-y-2">
      
      {/* --- IMAGE SECTION --- */}
      <figure 
        className={`relative overflow-hidden bg-gray-100 ${isSlider ? 'h-64' : 'h-56'}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        
        {/* Slider Container */}
        <div 
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imagesList.map((img, idx) => (
            <div key={idx} className="relative h-full min-w-full">
              <img
                src={`${getImageUrl(img.url)}${cacheBuster}`}
                alt={img.alt || blog.title}
                className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                onError={(e) => { e.target.src = "https://picsum.photos/seed/error/800/600"; }}
              />
            </div>
          ))}
        </div>

        {/* Gradient Overlay for readability (Trendy Design) */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 to-transparent opacity-60" />

        {/* Category Badge (Glassmorphism) */}
        {displayCategory && (
          <div className="absolute z-10 top-4 left-4">
            <span className="px-3 py-1 text-xs font-bold tracking-wider text-white uppercase border rounded-full shadow-lg bg-white/20 backdrop-blur-md border-white/30">
              {displayCategory}
            </span>
          </div>
        )}

        {/* Slider Controls (Only show if multiple images) */}
        {isSlider && (
          <>
            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 z-20"
              aria-label="Previous Image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            <button 
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[10px] group-hover:translate-x-0 z-20"
              aria-label="Next Image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute z-20 flex space-x-2 -translate-x-1/2 bottom-4 left-1/2">
              {imagesList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </figure>

      {/* --- CONTENT SECTION --- */}
      <div className="flex flex-col flex-grow p-6 bg-white">
        {/* Meta Info */}
        <div className="flex items-center mb-3 space-x-4 text-xs font-semibold tracking-wide text-gray-400 uppercase">
          <span className="flex items-center text-indigo-600">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            {formatDate(blog.createdAt)}
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <span>5 min read</span>
        </div>

        {/* Title */}
        <h2 className="mb-3 text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-indigo-600">
          <Link to={`/blog/${blog._id}`} className="hover:underline">
            {blog.title}
          </Link>
        </h2>

        {/* Description */}
        <p className="flex-grow mb-6 text-sm leading-relaxed text-gray-500 line-clamp-3">
          {blog.description || "No description available."}
        </p>

        {/* Footer / Actions */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
          
          {/* Author Info */}
          {blog.creator && (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 text-sm font-bold text-white rounded-full shadow-md bg-gradient-to-br from-indigo-500 to-purple-600">
                {typeof blog.creator === 'string' 
                  ? blog.creator.charAt(0).toUpperCase() 
                  : (blog.creator.username?.charAt(0).toUpperCase() || 'U')}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-900">
                  {typeof blog.creator === 'string' ? blog.creator : (blog.creator.username || 'Unknown')}
                </span>
                <span className="text-[10px] text-gray-400 uppercase tracking-wider">Author</span>
              </div>
            </div>
          )}

          {/* Read More Button */}
          <Link 
            to={`/blog/${blog._id}`} 
            className="inline-flex items-center px-5 py-2 text-sm font-medium text-white transition-all duration-300 bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Read More
            <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
