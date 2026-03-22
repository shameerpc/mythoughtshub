import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

// Import Blog APIs
import { getBlogById, updateBlog, deleteBlog } from "../api/blog.api";
// Import Comment APIs
import { getCommentsByBlogId, addComment } from "../api/comment.api";

// Helper for Images
const getImageUrl = (path) => {
  if (!path) return "https://picsum.photos/seed/blog/1200/600";
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";
  return path.startsWith("http") ? path : `${API_URL}/${path}`;
};

// Helper for Dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
  });
};

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ title: "", description: "" });
  
  // Comment State
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Blog
      const blogRes = await getBlogById(id);
      const blogData = blogRes.response || blogRes; 
      setBlog(blogData);
      setEditData({ title: blogData.title, description: blogData.description });

      // 2. Fetch Comments (Using the new comment API)
      const commentRes = await getCommentsByBlogId(id);
      setComments(commentRes.comments || []); // Adjust based on actual backend structure
      
    } catch (err) {
      console.error("Error fetching data:", err);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE BLOG ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login to edit.");

    try {
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("description", editData.description);

      await updateBlog(id, formData);
      
      setBlog({ ...blog, title: editData.title, description: editData.description });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update blog.");
    }
  };

  // --- DELETE BLOG ---
  const handleDelete = async () => {
    if (!token) return alert("Please login to delete.");
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await deleteBlog(id);
      navigate("/");
    } catch (err) {
      alert("Failed to delete blog.");
    }
  };

  // --- ADD COMMENT ---
  const handleAddComment = async () => {
    if (!token) return alert("Login required to comment.");
    if (!commentText.trim()) return;

    try {
      // Using the new comment API
      const res = await addComment(id, commentText);
      
      setComments([...comments, res.newComment]);
      setCommentText("");
    } catch (err) {
      alert("Failed to post comment.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-base-200 pb-20">
      
      {/* --- NAV BAR --- */}
      <div className="sticky top-0 z-30 bg-base-100/80 backdrop-blur-md border-b border-base-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
          </button>
          
          {token && (
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-ghost text-primary">Edit</button>
                  <button onClick={handleDelete} className="btn btn-sm btn-ghost text-error">Delete</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-ghost">Cancel</button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* READ MODE */}
          {!isEditing ? (
            <article className="bg-base-100 rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
              <figure className="relative h-[350px] md:h-[450px]">
                <img src={getImageUrl(blog.image)} alt={blog.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
                  <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight shadow-sm">
                    {blog.title}
                  </h1>
                </div>
              </figure>

              <div className="p-6 md:p-10">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-base-200">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${blog.creator?.username || 'User'}`} alt="Author" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-base-content">{blog.creator?.username || "Unknown Author"}</p>
                    <p className="text-xs text-gray-500">{formatDate(blog.createdAt)}</p>
                  </div>
                </div>

                <div className="prose prose-lg max-w-none text-gray-700">
                  {blog.description.split('\n').map((para, i) => (
                    <p key={i} className="mb-4 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            </article>
          ) : (
            
            /* EDIT MODE */
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Editing: {blog.title}</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="form-control">
                    <label className="label font-bold">Title</label>
                    <input 
                      type="text" 
                      className="input input-bordered w-full text-xl" 
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-control">
                    <label className="label font-bold">Content</label>
                    <textarea 
                      className="textarea textarea-bordered h-64 text-lg" 
                      value={editData.description}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={() => setIsEditing(false)} className="btn">Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: COMMENTS SIDEBAR --- */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-base-100 rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              💬 Discussion ({comments.length})
            </h3>

            <div className="mb-6">
              <textarea
                className="textarea textarea-bordered w-full h-24 text-sm mb-2 focus:textarea-primary"
                placeholder={token ? "Join the discussion..." : "Login to comment..."}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={!token}
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleAddComment} 
                  className="btn btn-sm btn-primary"
                  disabled={!token || !commentText.trim()}
                >
                  Post
                </button>
              </div>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {comments.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-base-200 rounded-xl">
                  <p>No comments yet.</p>
                  <p className="text-xs">Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="chat chat-start">
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${c.creator?.username || 'User'}`} alt="User" />
                      </div>
                    </div>
                    <div className="chat-bubble chat-bubble-primary bg-base-200 text-base-content shadow-sm">
                      <div className="font-bold text-xs text-primary mb-1">
                        {c.creator?.username || "Anonymous"}
                      </div>
                      <p className="text-sm text-gray-800">{c.content}</p>
                      <div className="text-[10px] text-gray-500 mt-1 text-right">
                        {formatDate(c.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}