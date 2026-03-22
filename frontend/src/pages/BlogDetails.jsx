import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
    // Moved function inside useEffect to fix dependency warning
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

    fetchData();
  }, [id, navigate]); // Added 'navigate' to dependencies

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
      <div className="flex items-center justify-center min-h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen pb-20 bg-base-200">
      
      {/* --- NAV BAR --- */}
      <div className="sticky top-0 z-30 border-b shadow-sm bg-base-100/80 backdrop-blur-md border-base-200">
        <div className="flex items-center justify-between h-16 max-w-5xl px-4 mx-auto">
          <button onClick={() => navigate(-1)} className="gap-2 btn btn-ghost btn-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
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

      <div className="grid max-w-5xl grid-cols-1 gap-8 px-4 mx-auto mt-8 lg:grid-cols-3">
        
        {/* --- LEFT COLUMN: MAIN CONTENT --- */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* READ MODE */}
          {!isEditing ? (
            <article className="overflow-hidden shadow-xl bg-base-100 rounded-2xl animate-fade-in-up">
              <figure className="relative h-[350px] md:h-[450px]">
                <img src={getImageUrl(blog.image)} alt={blog.title} className="object-cover w-full h-full" />
                <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/70 to-transparent">
                  <h1 className="text-3xl font-bold leading-tight text-white shadow-sm md:text-5xl">
                    {blog.title}
                  </h1>
                </div>
              </figure>

              <div className="p-6 md:p-10">
                <div className="flex items-center gap-3 pb-6 mb-6 border-b border-base-200">
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

                <div className="prose prose-lg text-gray-700 max-w-none">
                  {blog.description.split('\n').map((para, i) => (
                    <p key={i} className="mb-4 leading-relaxed">{para}</p>
                  ))}
                </div>
              </div>
            </article>
          ) : (
            
            /* EDIT MODE */
            <div className="shadow-xl card bg-base-100">
              <div className="card-body">
                <h2 className="mb-4 card-title">Editing: {blog.title}</h2>
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="form-control">
                    <label className="font-bold label">Title</label>
                    <input 
                      type="text" 
                      className="w-full text-xl input input-bordered" 
                      value={editData.title}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                      required 
                    />
                  </div>
                  <div className="form-control">
                    <label className="font-bold label">Content</label>
                    <textarea 
                      className="h-64 text-lg textarea textarea-bordered" 
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
          <div className="sticky p-6 shadow-xl top-24 bg-base-100 rounded-2xl">
            <h3 className="flex items-center gap-2 mb-6 text-xl font-bold">
              💬 Discussion ({comments.length})
            </h3>

            <div className="mb-6">
              <textarea
                className="w-full h-24 mb-2 text-sm textarea textarea-bordered focus:textarea-primary"
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
                <div className="py-10 text-center text-gray-400 bg-base-200 rounded-xl">
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
                    <div className="shadow-sm chat-bubble chat-bubble-primary bg-base-200 text-base-content">
                      <div className="mb-1 text-xs font-bold text-primary">
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