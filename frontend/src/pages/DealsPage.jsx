import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, MessageSquare, Search, ArrowUpDown, Flame, Inbox } from "lucide-react";
import { getAffiliateProducts } from "../api/affiliate.api";

const normalizeUrl = (url) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
};

const DealsPageCard = ({ product }) => {
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
      <div className="relative w-full h-56 overflow-hidden bg-slate-50 flex-shrink-0">
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

        <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 line-clamp-2 min-h-[2.75rem] group-hover:text-indigo-600 transition-colors">
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

const DealsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await getAffiliateProducts();
        setProducts(res.result || res.response || res || []);
      } catch (err) {
        setError("Failed to retrieve deals from database.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const categoriesList = useMemo(() => {
    const list = products.map((p) => p.category).filter(Boolean);
    return ["all", ...new Set(list)];
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
      result = result.filter((p) => p.category === selectedCat);
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

  return (
    <div className="min-h-screen bg-slate-50">
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

        {/* Filter Controls Bar */}
        <div className="flex flex-col gap-4 p-4 bg-white border border-slate-100 shadow-sm rounded-3xl mb-12 md:flex-row md:items-center md:justify-between">
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
            {/* Category Filter */}
            <select
              className="px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm text-slate-600 bg-white"
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categoriesList.filter(c => c !== "all").map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            {/* Sort Selector */}
            <div className="flex items-center gap-2 border border-slate-200 px-4 py-3 rounded-2xl bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                className="focus:outline-none text-sm text-slate-600 bg-transparent"
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
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div key={product._id} className="h-full">
                <DealsPageCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;
