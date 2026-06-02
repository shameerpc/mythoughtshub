import React, { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, Search, Trash2 } from "lucide-react";
import { deleteAdminBlog, getAdminBlogs, updateAdminBlog } from "../../api/admin.api";

const formatDate = (value) => value ? new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "";
const stripHtml = (html = "") => html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const loadBlogs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminBlogs({ search, status });
      setBlogs(response.response || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtered = useMemo(() => blogs, [blogs]);

  const togglePublished = async (blog) => {
    try {
      const response = await updateAdminBlog(blog._id, { is_published: !blog.is_published });
      setBlogs((prev) => prev.map((item) => item._id === blog._id ? response.result : item));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog status.");
    }
  };

  const removeBlog = async (blog) => {
    if (!window.confirm(`Delete "${blog.title}"?`)) return;
    try {
      await deleteAdminBlog(blog._id);
      setBlogs((prev) => prev.filter((item) => item._id !== blog._id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete blog.");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog Management</h1>
          <p className="mt-1 text-sm text-slate-500">Moderate published status and remove posts.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); loadBlogs(); }} className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="h-10 rounded-lg border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-indigo-500" placeholder="Search blogs" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="h-10 rounded-lg border border-slate-300 px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white">Search</button>
        </form>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="space-y-3 p-5">{[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-100" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-500">No blogs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Post</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Author</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-50">
                    <td className="max-w-md px-5 py-4">
                      <p className="font-semibold text-slate-900">{blog.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">{stripHtml(blog.description)}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{blog.category?.name || "Uncategorized"}</td>
                    <td className="px-5 py-4 text-slate-600">{blog.creator?.username || blog.creator?.email || "Unknown"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${blog.is_published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {blog.is_published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{formatDate(blog.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100" onClick={() => togglePublished(blog)} title={blog.is_published ? "Unpublish" : "Publish"}>
                          {blog.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50" onClick={() => removeBlog(blog)} title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBlogs;
