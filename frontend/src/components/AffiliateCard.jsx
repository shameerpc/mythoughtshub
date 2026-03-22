// src/components/AffiliateCard.jsx
// import { Link } from "react-router-dom";

export default function AffiliateCard({ product }) {
  return (
    <div className="overflow-hidden transition-all duration-300 border shadow-xl card bg-base-100 hover:shadow-2xl border-base-200 group">
      <figure className="relative h-48 bg-base-200">
        <img 
          src={product.image} 
          alt={product.title} 
          className="object-contain w-full h-full transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute gap-2 top-2 right-2 badge badge-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-3 h-3 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Deal
        </div>
      </figure>
      <div className="p-4 card-body">
        <h2 className="text-sm card-title md:text-base text-base-content">
          {product.title}
        </h2>
        <div className="flex items-center gap-1 text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : "fill-gray-300"}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div className="items-center justify-between mt-2 card-actions">
          <span className="text-xl font-bold text-primary">{product.price}</span>
          <a 
            href={product.link} 
            target="_blank" 
            rel="noopener noreferrer sponsored"
            className="text-white btn btn-sm btn-warning hover:bg-orange-600"
          >
            Buy on Amazon
          </a>
        </div>
      </div>
    </div>
  );
}