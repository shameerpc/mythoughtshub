import React, { useEffect, useState } from "react";
import { BarChart3, FileText, MessageSquare, Package, Star, Users } from "lucide-react";
import { getAdminStats } from "../../api/admin.api";

const formatNumber = (value) => new Intl.NumberFormat("en-US").format(value || 0);
const formatDate = (value) => value ? new Date(value).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";

const StatCard = ({ label, value, icon: Icon, tone }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{formatNumber(value)}</p>
      </div>
      <div className={`rounded-lg p-3 ${tone}`}>
        <Icon size={22} />
      </div>
    </div>
  </div>
);

const ActivityItem = ({ title, subtitle, date }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-slate-800">{title}</p>
      <p className="mt-1 truncate text-xs text-slate-500">{subtitle}</p>
    </div>
    <span className="shrink-0 text-xs text-slate-400">{formatDate(date)}</span>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getAdminStats();
        setData(response);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200" />)}</div>;
  }

  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>;

  const stats = data?.stats || {};
  const recent = data?.recent || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Live overview from MongoDB.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Users" value={stats.users} icon={Users} tone="bg-blue-50 text-blue-600" />
        <StatCard label="Blogs" value={stats.blogs} icon={FileText} tone="bg-violet-50 text-violet-600" />
        <StatCard label="Products" value={stats.products} icon={Package} tone="bg-emerald-50 text-emerald-600" />
        <StatCard label="Total Views" value={stats.totalViews} icon={BarChart3} tone="bg-amber-50 text-amber-600" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Comments" value={stats.comments} icon={MessageSquare} tone="bg-sky-50 text-sky-600" />
        <StatCard label="Reviews" value={stats.reviews} icon={Star} tone="bg-yellow-50 text-yellow-600" />
        <StatCard label="Pending Moderation" value={(stats.pendingComments || 0) + (stats.pendingReviews || 0)} icon={MessageSquare} tone="bg-rose-50 text-rose-600" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-900">Recent Blogs</h2>
          {recent.blogs?.length ? recent.blogs.map((blog) => (
            <ActivityItem key={blog._id} title={blog.title} subtitle={blog.creator?.username || "Unknown author"} date={blog.createdAt} />
          )) : <p className="py-8 text-center text-sm text-slate-500">No blogs yet.</p>}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-900">Recent Comments</h2>
          {recent.comments?.length ? recent.comments.map((comment) => (
            <ActivityItem key={comment._id} title={comment.content} subtitle={comment.blog?.title || "Unknown blog"} date={comment.createdAt} />
          )) : <p className="py-8 text-center text-sm text-slate-500">No comments yet.</p>}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-slate-900">Recent Reviews</h2>
          {recent.reviews?.length ? recent.reviews.map((review) => (
            <ActivityItem key={review._id} title={review.title} subtitle={review.product?.name || "Unknown product"} date={review.createdAt} />
          )) : <p className="py-8 text-center text-sm text-slate-500">No reviews yet.</p>}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
