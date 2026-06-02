import React, { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getAffiliateProducts } from "../api/affiliate.api";
import { createReview, getReviews } from "../api/review.api";

const normalizeUrl = (url) => {
  if (!url) return "#";
  return url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
};

const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
};

const StarRating = ({ rating }) => (
  <div className="flex text-yellow-400">
    {Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className="h-5 w-5" fill={i < Math.round(rating || 0) ? "currentColor" : "none"} />
    ))}
  </div>
);

const ReviewsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [productSearch, setProductSearch] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [form, setForm] = useState({ userName: "", email: "", rating: 5, title: "", body: "" });
  const [error, setError] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const productIdFromUrl = queryParams.get("product");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await getAffiliateProducts();
        const list = response.result || response.response || [];
        setProducts(list);
        const initialSelected = list.find((p) => p._id === productIdFromUrl) || list[0];
        if (initialSelected?._id) setSelectedProductId(initialSelected._id);
      } catch (err) {
        setError("Failed to load products.");
      }
    };
    loadProducts();
  }, [productIdFromUrl]);

  useEffect(() => {
    if (!selectedProductId) {
      setLoading(false);
      return;
    }

    const loadReviews = async () => {
      setLoading(true);
      try {
        const response = await getReviews({ product: selectedProductId });
        setReviews(response.response || []);
      } catch (err) {
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
    loadReviews();
  }, [selectedProductId]);

  const currentProduct = products.find((product) => product._id === selectedProductId);

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const s = productSearch.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(s));
  }, [products, productSearch]);

  const filteredReviews = useMemo(() => {
    let result = [...reviews];
    if (filterRating !== "all") result = result.filter((review) => review.rating === Number(filterRating));
    if (reviewSearch.trim()) {
      const s = reviewSearch.toLowerCase();
      result = result.filter((review) =>
        (review.title || "").toLowerCase().includes(s) ||
        (review.body || "").toLowerCase().includes(s) ||
        (review.userName || "").toLowerCase().includes(s)
      );
    }
    if (sortBy === "highest") result.sort((a, b) => b.rating - a.rating);
    if (sortBy === "helpful") result.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
    if (sortBy === "recent") result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return result;
  }, [reviews, filterRating, sortBy, reviewSearch]);

  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  const submitReview = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await createReview({ ...form, product: selectedProductId });
      setReviews((prev) => [response.result, ...prev]);
      setForm({ userName: "", email: "", rating: 5, title: "", body: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post review. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Product Reviews</h1>
          <p className="mt-2 text-slate-500">Real reviews connected to affiliate products in MongoDB.</p>
        </div>

        {error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-16 text-center text-slate-500">No products available for reviews yet.</div>
        ) : (
          <>
            <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-6 md:grid-cols-[220px_1fr]">
                <div className="h-52 overflow-hidden rounded-xl bg-slate-100">
                  {currentProduct ? (
                    currentProduct.media?.[0]?.type === "video" ? (
                      <video src={getImageUrl(currentProduct.media[0].url)} className="h-full w-full object-cover" />
                    ) : (
                      <img src={getImageUrl(currentProduct.media?.[0]?.url || currentProduct.image)} alt={currentProduct.name} className="h-full w-full object-cover" />
                    )
                  ) : null}
                </div>
                <div>
                  <div className="mb-4 flex flex-wrap gap-2 items-center">
                    <input
                      type="text"
                      placeholder="Search product..."
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm w-48 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                    <select
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm max-w-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      {filteredProducts.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">{currentProduct?.name}</h2>
                  <p className="mt-2 max-w-3xl text-slate-600">{currentProduct?.description}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-5">
                    <div>
                      <p className="text-3xl font-bold text-slate-900">{averageRating.toFixed(1)}</p>
                      <StarRating rating={averageRating} />
                    </div>
                    <div className="text-sm text-slate-500">{reviews.length} reviews</div>
                    <a href={normalizeUrl(currentProduct?.affiliateLink)} target="_blank" rel="noreferrer" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">View Deal</a>
                  </div>
                </div>
              </div>
            </section>

            <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
              <aside className="space-y-5">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900 mb-3">Filters</h3>
                  <input
                    type="text"
                    placeholder="Search reviews..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none mb-3"
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                  />
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm mb-3" value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                    <option value="all">All ratings</option>
                    {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
                  </select>
                  <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="recent">Most recent</option>
                    <option value="highest">Highest rated</option>
                    <option value="helpful">Most helpful</option>
                  </select>
                </div>

                <form onSubmit={submitReview} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-900">Write a Review</h3>
                  <div className="mt-4 space-y-3">
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Name" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} required />
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <select className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
                      {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
                    </select>
                    <input className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                    <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" rows="4" placeholder="Review" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} required />
                    <button className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Submit Review</button>
                  </div>
                </form>
              </aside>

              <section className="space-y-4">
                {loading ? (
                  [1, 2, 3].map((i) => <div key={i} className="h-36 animate-pulse rounded-xl bg-slate-200" />)
                ) : filteredReviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No reviews match this filter.</div>
                ) : filteredReviews.map((review) => (
                  <article key={review._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <h3 className="font-semibold text-slate-900">{review.title}</h3>
                        <p className="mt-1 text-xs text-slate-500">By {review.userName} on {new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-700">{review.body}</p>
                  </article>
                ))}
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReviewsPage;
