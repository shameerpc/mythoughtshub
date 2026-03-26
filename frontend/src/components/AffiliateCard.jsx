import React from "react";

const AffiliateCard = ({ product }) => {
  return (
    <div className="group relative overflow-hidden transition-all duration-300 transform bg-white shadow-md rounded-2xl hover:shadow-xl hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        <img
          src={product.image || "https://placehold.co/400x300?text=No+Image"}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          // FIX: Handle broken images gracefully
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = "https://placehold.co/400x300?text=Image+Error";
          }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity duration-300 backdrop-blur-sm">
          <a 
            href={product.affiliateLink} 
            target="_blank" 
            rel="noreferrer" 
            className="px-6 py-2 text-white font-bold rounded-full bg-primary hover:bg-primary-focus"
          >
            View Deal
          </a>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="mb-2 text-lg font-bold text-base-content line-clamp-1 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-primary">Amazon</span>
          <span className="text-xs text-gray-400">
            {new Date(product.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AffiliateCard;