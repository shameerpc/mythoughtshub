import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBlogs, deleteBlog } from "../api/blog.api";
import { getUserProfile, updateUserProfile } from "../api/auth.api";
import CreateBlogForm from "../components/CreateBlogForm";
// ✅ IMPORT THE NEW MODAL
import DeleteModal from "../components/DeleteModal"; 
import {
  PenLine, Trash2, Mail,
  BookOpen, Plus, X, AlertTriangle, CheckCircle2,
  Loader2, Edit3, Save
} from "lucide-react";

// ── helpers ──────────────────────────────────
const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const stripHtml = (html = "") =>
  html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  return imagePath.startsWith("http") ? imagePath : `${API_URL}${imagePath}`;
};

// ── main ──────────────────────────────────────
export default function Profile() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [editForm, setEditForm] = useState({ username: "", email: "" });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");

  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [refreshBlogs, setRefreshBlogs] = useState(0);

  // --- MODAL STATE ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  
  // ✅ DELETE STATE
  const [deleteTarget, setDeleteTarget] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // ── auth guard & data loading ──
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
        setEditForm({ username: data.username, email: data.email });
      } catch (e) {
        console.error(e);
      } finally {
        setProfileLoading(false);
      }
    };

    const loadBlogs = async () => {
      setBlogsLoading(true);
      try {
        const res = await getMyBlogs();
        const list = res?.response ?? res ?? [];
        setBlogs(Array.isArray(list) ? list : []);
      } catch (e) {
        console.error("Failed to load blogs", e);
      } finally {
        setBlogsLoading(false);
      }
    };

    loadProfile();
    loadBlogs();
  }, [token, navigate, refreshBlogs]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg("");
    try {
      const updated = await updateUserProfile(editForm);
      setUser(updated);
      setIsEditingProfile(false);
      setProfileMsg("Profile updated!");
      setTimeout(() => setProfileMsg(""), 3000);
    } catch (e) {
      setProfileMsg("Update failed. Please try again.");
    } finally {
      setProfileSaving(false);
    }
  };

  // ── Modal Handlers ──
  const handleOpenCreate = () => {
    setEditingBlog(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (blog) => {
    setEditingBlog(blog);
    setIsFormOpen(true);
  };

  const handleModalClose = () => {
    setIsFormOpen(false);
    setEditingBlog(null);
    setRefreshBlogs(prev => prev + 1);
  };

  // ── delete blog logic ──
  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      setBlogs((prev) => prev.filter((b) => b._id !== id));
      // Close modal after success
      setDeleteTarget(null);
    } catch {
      // Fallback refresh
      const res = await getMyBlogs();
      setBlogs(res?.response || res || []);
      setDeleteTarget(null);
    }
  };

  const initials = user.username?.substring(0, 2).toUpperCase() || "ME";

  if (!token) return null;

  return (
    <>
      {/* CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        .pf-root { font-family: 'DM Sans', sans-serif; min-height: 100vh; background: #f0f2f5; padding: 2rem 1rem 4rem; }
        .pf-container { max-width: 1100px; margin: 0 auto; }
        .pf-card { background: #fff; border-radius: 1.25rem; box-shadow: 0 2px 16px rgba(0,0,0,.07); overflow: hidden; margin-bottom: 1.5rem; }
        .pf-banner { height: 120px; background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%); position: relative; overflow: hidden; }
        .pf-banner::before { content:''; position:absolute; inset:0; background: radial-gradient(circle at 20% 50%, rgba(99,102,241,.4) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139,92,246,.3) 0%, transparent 40%); }
        .pf-banner-dots { position:absolute; inset:0; background-image: radial-gradient(rgba(255,255,255,.08) 1px, transparent 1px); background-size: 24px 24px; }
        .pf-avatar-wrap { padding: 0 2rem; display: flex; align-items: flex-end; justify-content: space-between; margin-top: -44px; position: relative; z-index: 1; }
        .pf-avatar { width: 88px; height: 88px; border-radius: 50%; background: linear-gradient(135deg, #6366f1, #8b5cf6); border: 4px solid #fff; box-shadow: 0 4px 16px rgba(99,102,241,.35); display: flex; align-items: center; justify-content: center; font-family: 'Sora', sans-serif; font-size: 1.6rem; font-weight: 700; color: #fff; flex-shrink: 0; }
        .pf-avatar-actions { display: flex; gap: .6rem; padding-bottom: .5rem; }
        .pf-user-info { padding: .75rem 2rem 1.5rem; }
        .pf-username { font-family: 'Sora', sans-serif; font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0 0 .2rem; }
        .pf-email { font-size: .9rem; color: #64748b; display: flex; align-items: center; gap: .4rem; margin-bottom: .75rem; }
        .pf-stats { display: flex; gap: 1.5rem; }
        .pf-stat { text-align: center; }
        .pf-stat-num { font-family:'Sora',sans-serif; font-weight:700; font-size:1.15rem; color:#1e293b; }
        .pf-stat-label { font-size:.75rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.05em; }
        .pf-profile-msg { margin: .75rem 2rem 0; padding: .6rem 1rem; border-radius: .6rem; font-size: .85rem; font-weight: 500; display: flex; align-items: center; gap: .4rem; }
        .pf-profile-msg.success { background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
        .pf-profile-msg.error { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; }
        .pf-edit-panel { margin: 0 2rem 1.5rem; padding: 1.25rem; border: 1.5px solid #e2e8f0; border-radius: .85rem; background: #f8fafc; animation: pf-slide-in .2s ease; }
        @keyframes pf-slide-in { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
        .pf-edit-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
        @media(max-width:500px){ .pf-edit-grid{ grid-template-columns:1fr; } }
        .pf-edit-label { font-size:.8rem; font-weight:600; color:#475569; text-transform:uppercase; letter-spacing:.05em; margin-bottom:.35rem; display:block; }
        .pf-edit-input { width:100%; padding:.65rem .9rem; border-radius:.6rem; border:1.5px solid #e2e8f0; background:#fff; font-size:.9rem; color:#0f172a; outline:none; box-sizing:border-box; transition: border-color .2s, box-shadow .2s; }
        .pf-edit-input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.12); }
        .pf-btn { display:inline-flex; align-items:center; gap:.4rem; padding:.55rem 1.1rem; border-radius:.65rem; font-size:.875rem; font-weight:600; cursor:pointer; border:none; transition: all .18s; }
        .pf-btn-outline { background:#fff; border:1.5px solid #e2e8f0; color:#475569; }
        .pf-btn-outline:hover { border-color:#6366f1; color:#6366f1; background:#eef2ff; }
        .pf-btn-primary { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; box-shadow:0 4px 12px rgba(99,102,241,.35); }
        .pf-btn-primary:hover { opacity:.9; transform:translateY(-1px); box-shadow:0 6px 16px rgba(99,102,241,.4); }
        .pf-btn-ghost { background:transparent; border:1.5px solid #e2e8f0; color:#64748b; padding:.55rem 1.1rem; border-radius:.6rem; font-weight:600; font-size:.875rem; cursor:pointer; }
        .pf-btn-ghost:hover { background:#f1f5f9; }
        .pf-btn-danger { background:#dc2626; color:#fff; border:none; padding:.55rem 1.1rem; border-radius:.6rem; font-weight:600; font-size:.875rem; cursor:pointer; }
        .pf-btn-danger:hover { background:#b91c1c; }
        .pf-btn-save { background:linear-gradient(135deg,#16a34a,#15803d); color:#fff; box-shadow:0 4px 12px rgba(22,163,74,.3); }
        .pf-btn-save:hover { opacity:.9; transform:translateY(-1px); }
        .pf-btn-sm { padding:.38rem .75rem; font-size:.8rem; border-radius:.5rem; }
        .pf-btn-icon-edit { display:inline-flex; align-items:center; gap:.3rem; padding:.35rem .7rem; border-radius:.5rem; font-size:.8rem; font-weight:600; background:#eef2ff; color:#6366f1; border:1.5px solid #c7d2fe; cursor:pointer; transition: all .15s; }
        .pf-btn-icon-edit:hover { background:#e0e7ff; }
        .pf-btn-icon-del { display:inline-flex; align-items:center; gap:.3rem; padding:.35rem .7rem; border-radius:.5rem; font-size:.8rem; font-weight:600; background:#fef2f2; color:#dc2626; border:1.5px solid #fecaca; cursor:pointer; transition: all .15s; }
        .pf-btn-icon-del:hover { background:#fee2e2; }
        .pf-section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem; }
        .pf-section-title { font-family:'Sora',sans-serif; font-size:1.25rem; font-weight:700; color:#0f172a; }
        .pf-table-card { background:#fff; border-radius:1.1rem; box-shadow:0 2px 16px rgba(0,0,0,.07); overflow:hidden; }
        table.pf-table { width:100%; border-collapse:collapse; }
        .pf-table thead { background:linear-gradient(135deg,#1e293b,#334155); }
        .pf-table th { padding:.85rem 1.25rem; text-align:left; font-size:.78rem; font-weight:600; color:#94a3b8; text-transform:uppercase; letter-spacing:.07em; }
        .pf-table th:last-child { text-align:right; }
        .pf-table tbody tr { border-bottom:1px solid #f1f5f9; transition:background .15s; }
        .pf-table tbody tr:last-child { border-bottom:none; }
        .pf-table tbody tr:hover { background:#f8fafc; }
        .pf-table td { padding:.9rem 1.25rem; vertical-align:middle; }
        .pf-table td:last-child { text-align:right; }
        .pf-blog-row { display:flex; align-items:center; gap:.85rem; }
        .pf-blog-thumb { width:52px; height:52px; border-radius:.6rem; object-fit:cover; flex-shrink:0; border:1px solid #e2e8f0; }
        .pf-blog-thumb-placeholder { width:52px; height:52px; border-radius:.6rem; background:linear-gradient(135deg,#e2e8f0,#f1f5f9); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#94a3b8; font-size:.75rem; font-weight:500; border:1px solid #e2e8f0; }
        .pf-blog-title { font-weight:600; color:#0f172a; font-size:.92rem; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
        .pf-blog-excerpt { font-size:.8rem; color:#64748b; margin-top:.15rem; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; max-width:300px; }
        .pf-cat-badge { display:inline-block; padding:.2rem .6rem; border-radius:999px; font-size:.73rem; font-weight:600; background:#eef2ff; color:#6366f1; border:1px solid #c7d2fe; }
        .pf-badge-active { display:inline-flex; align-items:center; gap:.3rem; padding:.25rem .65rem; border-radius:999px; font-size:.75rem; font-weight:600; background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0; }
        .pf-badge-draft { display:inline-flex; align-items:center; gap:.3rem; padding:.25rem .65rem; border-radius:999px; font-size:.75rem; font-weight:600; background:#fffbeb; color:#d97706; border:1px solid #fde68a; }
        .pf-date { font-size:.82rem; color:#64748b; font-weight:500; }
        .pf-actions-cell { display:flex; align-items:center; justify-content:flex-end; gap:.5rem; }
        .pf-state-box { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:3.5rem 1rem; text-align:center; background:#fff; border-radius:1.1rem; box-shadow:0 2px 16px rgba(0,0,0,.07); }
        .pf-state-icon { width:64px; height:64px; border-radius:50%; background:linear-gradient(135deg,#eef2ff,#e0e7ff); display:flex; align-items:center; justify-content:center; color:#6366f1; margin-bottom:1rem; }
        .pf-state-title { font-family:'Sora',sans-serif; font-size:1.1rem; font-weight:700; color:#0f172a; margin-bottom:.4rem; }
        .pf-state-sub { font-size:.9rem; color:#64748b; max-width:320px; }
        .pf-spin { animation:pf-spin .8s linear infinite; }
        @keyframes pf-spin { to { transform:rotate(360deg); } }
        .pf-overlay { position:fixed; inset:0; z-index:999; background:rgba(15,23,42,.65); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; padding:1rem; animation:pf-fade-in .2s ease; }
        @keyframes pf-fade-in { from{opacity:0} to{opacity:1} }
        .pf-modal { background:#fff; border-radius:1.25rem; width:100%; max-width:780px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 60px rgba(0,0,0,.25); animation:pf-modal-in .25s ease; position:relative; }
        @keyframes pf-modal-in { from{opacity:0;transform:translateY(20px) scale(.97)} to{opacity:1;transform:none} }
        .pf-modal-close { position:absolute; top:1rem; right:1rem; z-index:10; width:32px; height:32px; border-radius:50%; background:rgba(255,255,255,.15); backdrop-filter:blur(4px); border:none; color:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center; transition: background .2s; }
        .pf-modal-close:hover { background:rgba(220,38,38,.7); }
        @media(max-width:640px){ .pf-avatar-wrap { padding:0 1.25rem; } .pf-user-info { padding:.75rem 1.25rem 1.25rem; } .pf-edit-panel { margin:0 1.25rem 1.25rem; } .pf-table th, .pf-table td { padding:.75rem 1rem; } }
      `}</style>

      <div className="pf-root">
        <div className="pf-container">

          {/* ════════ PROFILE CARD ════════ */}
          <div className="pf-card">
            <div className="pf-banner">
              <div className="pf-banner-dots" />
            </div>

            <div className="pf-avatar-wrap">
              <div className="pf-avatar">
                {profileLoading ? "…" : initials}
              </div>
              <div className="pf-avatar-actions">
                <button
                  className={`pf-btn ${isEditingProfile ? "pf-btn-outline" : "pf-btn-outline"}`}
                  onClick={() => { setIsEditingProfile((v) => !v); setProfileMsg(""); }}
                >
                  {isEditingProfile ? <><X size={14} /> Cancel</> : <><Edit3 size={14} /> Edit Profile</>}
                </button>
                <button
                  className="pf-btn pf-btn-primary"
                  onClick={handleOpenCreate}
                >
                  <Plus size={15} /> New Post
                </button>
              </div>
            </div>

            <div className="pf-user-info">
              {profileLoading ? (
                <p style={{ color: "#94a3b8" }}>Loading profile…</p>
              ) : (
                <>
                  <h1 className="pf-username">Hello, {user.username}! 👋</h1>
                  <p className="pf-email"><Mail size={14} />{user.email}</p>
                  <div className="pf-stats">
                    <div className="pf-stat">
                      <div className="pf-stat-num">{blogs.length}</div>
                      <div className="pf-stat-label">Articles</div>
                    </div>
                    <div className="pf-stat">
                      <div className="pf-stat-num">{blogs.filter((b) => b.is_published).length}</div>
                      <div className="pf-stat-label">Published</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {profileMsg && (
              <div className={`pf-profile-msg ${profileMsg.includes("failed") || profileMsg.includes("Failed") ? "error" : "success"}`}>
                {profileMsg.includes("failed") || profileMsg.includes("Failed")
                  ? <AlertTriangle size={14} />
                  : <CheckCircle2 size={14} />}
                {profileMsg}
              </div>
            )}

            {isEditingProfile && (
              <div className="pf-edit-panel">
                <form onSubmit={handleProfileSave}>
                  <div className="pf-edit-grid" style={{ marginBottom: "1rem" }}>
                    <div>
                      <label className="pf-edit-label">Username</label>
                      <input
                        className="pf-edit-input"
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm((p) => ({ ...p, username: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="pf-edit-label">Email</label>
                      <input
                        className="pf-edit-input"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className={`pf-btn pf-btn-save`} disabled={profileSaving}>
                    {profileSaving ? <><Loader2 size={14} className="pf-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* ════════ BLOGS SECTION ════════ */}
          <div className="pf-section-header">
            <h2 className="pf-section-title">
              <BookOpen size={18} style={{ display: "inline", marginRight: ".4rem", verticalAlign: "middle" }} />
              Your Articles
            </h2>
            <button className="pf-btn pf-btn-primary pf-btn-sm" onClick={handleOpenCreate}>
              <Plus size={14} /> Write New
            </button>
          </div>

          {blogsLoading ? (
            <div className="pf-state-box">
              <Loader2 size={28} className="pf-spin" style={{ color: "#6366f1" }} />
              <p style={{ color: "#94a3b8", marginTop: ".75rem" }}>Loading your articles…</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="pf-state-box">
              <div className="pf-state-icon"><PenLine size={26} /></div>
              <div className="pf-state-title">No articles yet</div>
              <p className="pf-state-sub" style={{ marginBottom: "1.25rem" }}>
                You haven't written anything yet. Start sharing your thoughts!
              </p>
              <button className="pf-btn pf-btn-primary" onClick={handleOpenCreate}>
                <Plus size={15} /> Write first post
              </button>
            </div>
          ) : (
            <div className="pf-table-card">
              <div style={{ overflowX: "auto" }}>
                <table className="pf-table">
                  <thead>
                    <tr>
                      <th>Article</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Published</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog._id}>
                        <td>
                          <div className="pf-blog-row">
                            {blog.images && blog.images.length > 0 && blog.images[0].url ? (
                              <img 
                                src={getImageUrl(blog.images[0].url)} 
                                alt={blog.title} 
                                className="pf-blog-thumb"
                                onError={(e) => { e.target.style.display = "none"; }} 
                              />
                            ) : (
                              <div className="pf-blog-thumb-placeholder">
                                <BookOpen size={18} />
                              </div>
                            )}
                            <div>
                              <div className="pf-blog-title">{blog.title}</div>
                              <div className="pf-blog-excerpt">
                                {stripHtml(blog.description) || "No description"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="pf-cat-badge">
                            {blog.category?.name || (typeof blog.category === 'string' ? blog.category : "—")}
                          </span>
                        </td>
                        <td>
                          {blog.is_published
                            ? <span className="pf-badge-active"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} /> Published</span>
                            : <span className="pf-badge-draft"><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#d97706", display: "inline-block" }} /> Draft</span>
                          }
                        </td>
                        <td>
                          <span className="pf-date">{formatDate(blog.createdAt)}</span>
                        </td>
                        <td>
                          <div className="pf-actions-cell">
                            <button className="pf-btn-icon-edit" onClick={() => handleOpenEdit(blog)}>
                              <Edit3 size={13} /> Edit
                            </button>
                            <button className="pf-btn-icon-del" onClick={() => setDeleteTarget(blog)}>
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ════════ UNIFIED BLOG MODAL (Create & Edit) ════════ */}
      {isFormOpen && (
        <div className="pf-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleModalClose(); }}>
          <div className="pf-modal">
            <button className="pf-modal-close" onClick={handleModalClose}>
              <X size={16} />
            </button>
            <CreateBlogForm
              isOpen={isFormOpen}
              onClose={handleModalClose}
              initialData={editingBlog}
            />
          </div>
        </div>
      )}

      {/* ════════ ADVANCED DELETE MODAL ════════ */}
      {/* We pass the blog object to get the title, and the ID for deletion */}
      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => handleDelete(deleteTarget._id)}
        blogTitle={deleteTarget?.title || "this item"}
      />
    </>
  );
}