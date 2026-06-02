import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Search, Star, Trash2, XCircle } from "lucide-react";
import { deleteAdminReview, getAdminReviews, updateAdminReview } from "../../api/admin.api";

const formatDate = (value) => value ? new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminReviews();
      setReviews(response.response || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reviews.filter((review) => {
      const statusMatch = status === "all" || (status === "active" ? review.is_active : !review.is_active);
      const textMatch = review.title?.toLowerCase().includes(q) || review.body?.toLowerCase().includes(q) || review.product?.name?.toLowerCase().includes(q) || review.userName?.toLowerCase().includes(q);
      return statusMatch && textMatch;
    });
  }, [reviews, search, status]);

  const setActive = async (review, isActive) => {
    const response = await updateAdminReview(review._id, { is_active: isActive });
    setReviews((prev) => prev.map((item) => item._id === review._id ? response.result : item));
  };

  const remove = async (review) => {
    if (!window.confirm("Delete this review?")) return;
    await deleteAdminReview(review._id);
    setReviews((prev) => prev.filter((item) => item._id !== review._id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Review Management</h1>
          <p className="mt-1 text-sm text-slate-500">Moderate product reviews and ratings.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="h-10 rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-indigo-500" placeholder="Search reviews" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="h-10 rounded-lg border border-slate-300 px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-4">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200" />)
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No reviews found.</div>
        ) : filtered.map((review) => (
          <article key={review._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">{review.title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${review.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {review.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />)}
                  <span className="ml-2 text-xs text-slate-400">{formatDate(review.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{review.body}</p>
                <p className="mt-2 text-xs text-slate-500">By {review.userName} on {review.product?.name || "Unknown product"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50" onClick={() => setActive(review, true)}>
                  <CheckCircle size={16} /> Approve
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50" onClick={() => setActive(review, false)}>
                  <XCircle size={16} /> Hide
                </button>
                <button className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" onClick={() => remove(review)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
