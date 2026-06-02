import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Search, Trash2, XCircle } from "lucide-react";
import { deleteAdminComment, getAdminComments, updateAdminComment } from "../../api/admin.api";

const formatDate = (value) => value ? new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminComments({ status });
      setComments(response.response || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load comments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return comments.filter((comment) =>
      comment.content?.toLowerCase().includes(q) ||
      comment.creator?.username?.toLowerCase().includes(q) ||
      comment.blog?.title?.toLowerCase().includes(q)
    );
  }, [comments, search]);

  const setActive = async (comment, isActive) => {
    const response = await updateAdminComment(comment._id, { is_active: isActive });
    setComments((prev) => prev.map((item) => item._id === comment._id ? response.result : item));
  };

  const remove = async (comment) => {
    if (!window.confirm("Delete this comment?")) return;
    await deleteAdminComment(comment._id);
    setComments((prev) => prev.filter((item) => item._id !== comment._id));
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Comment Moderation</h1>
          <p className="mt-1 text-sm text-slate-500">Approve, hide, or remove reader comments.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="h-10 rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-indigo-500" placeholder="Search comments" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="h-10 rounded-lg border border-slate-300 px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200" />)
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No comments found.</div>
        ) : filtered.map((comment) => (
          <article key={comment._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900">{comment.creator?.username || comment.creator?.email || "Anonymous"}</span>
                  <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${comment.is_active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                    {comment.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{comment.content}</p>
                <p className="mt-2 text-xs text-slate-500">On: {comment.blog?.title || "Unknown blog"}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50" onClick={() => setActive(comment, true)}>
                  <CheckCircle size={16} /> Approve
                </button>
                <button className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50" onClick={() => setActive(comment, false)}>
                  <XCircle size={16} /> Hide
                </button>
                <button className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" onClick={() => remove(comment)}>
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

export default AdminComments;
